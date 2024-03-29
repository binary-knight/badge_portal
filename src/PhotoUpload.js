import React, { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import * as mutations from './graphql/mutations';
import { generateClient } from 'aws-amplify/api';

Amplify.configure(config);

function PhotoUpload({ user, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState("");
  const [uploadError, setUploadError] = useState("");
  const client = generateClient();

  const handleChange = (event) => {
    setFile(event.target.files[0]);
    setUploadResult("");
    setUploadError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError("No file selected");
      return;
    }
  
    const filename = `${user.username}-${Date.now()}-${file.name}`;
  
    try {
      const uploadResult = await uploadData({
        key: filename,
        data: file,
        options: { contentType: file.type } // Set the correct content type
      });
  
      // Generate a TinyURL
      const fileUrl = `https://${uploadResult.key}`; // Construct the file URL
      const tinyUrl = await shortenUrl(fileUrl);
  
      // Create a TinyURLMapping item using GraphQL API
      const client = generateClient();
      const newMapping = { fileKey: filename, tinyUrl: tinyUrl };
  
      await client.graphql({
        query: mutations.createTinyURLMapping,
        variables: { input: newMapping }
      });
  
      setUploadResult('Upload Succeeded: ' + filename);
      onUploadSuccess();
  
      // Clear the success message after 5 seconds
      setTimeout(() => setUploadResult(''), 5000);
    } catch (error) {
      setUploadError('Error: ' + error.message);
    }
  };

  const shortenUrl = async (url) => {
    const tinyURLApiKey = process.env.REACT_APP_TINYURL_API_KEY;
    try {
      const response = await fetch('https://api.tinyurl.com/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tinyURLApiKey}`
        },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      return data.data.tiny_url;
    } catch (error) {
      console.error('Error shortening URL:', error);
      return url;
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadResult && <div className="toast-message">{uploadResult}</div>}
      {uploadError && <p>{uploadError}</p>}
    </div>
  );
}

export default withAuthenticator(PhotoUpload);


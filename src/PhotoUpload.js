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
      const uploadTask = await uploadData({
        key: filename,
        data: file,
        options: { 
          contentType: file.type,
          acl: 'public-read'
         }
      });
  
      const uploadResult = await uploadTask.result;
  
      // Check the state after the result promise resolves
      if (uploadTask.state === 'SUCCESS') {
        // Construct the S3 file URL
        const bucketName = config.aws_user_files_s3_bucket; // Your S3 bucket name
        const region = config.aws_project_region; // Your AWS region
        const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/public/${uploadResult.key}`;
  
        const tinyUrl = await shortenUrl(fileUrl);
  
        // Create a TinyURLMapping item using GraphQL API
        const newMapping = { fileKey: filename, tinyUrl: tinyUrl };
        console.log("Storing TinyURL mapping:", newMapping);
  
        await client.graphql({
          query: mutations.createTinyURLMapping,
          variables: { input: newMapping }
        });
  
        setUploadResult('Upload Succeeded: ' + filename);
        onUploadSuccess();
      } else {
        // Handle incomplete or failed upload
        console.error('Upload did not complete:', uploadTask);
        setUploadError('Upload did not complete');
      }
  
      // Clear the success message after 5 seconds
      setTimeout(() => setUploadResult(''), 5000);
    } catch (error) {
      console.error('Error during upload:', error);
      setUploadError('Error: ' + error.message);
    }
  };

  const shortenUrl = async (url) => {
    const tinyURLApiKey = process.env.REACT_APP_TINYURL_API_KEY
    console.log("Generating TinyURL for:", url);
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


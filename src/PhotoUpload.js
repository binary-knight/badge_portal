import React, { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
Amplify.configure(config);

function PhotoUpload({ user, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState("");
  const [uploadError, setUploadError] = useState("");

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
      const result = await uploadData({
        key: filename,
        data: file
      }).result;
      setUploadResult('Upload Succeeded: ' + filename);
      onUploadSuccess();
    } catch (error) {
      setUploadError('Error: ' + error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadResult && <p>{uploadResult}</p>}
      {uploadError && <p>{uploadError}</p>}
    </div>
  );
}

export default withAuthenticator(PhotoUpload);


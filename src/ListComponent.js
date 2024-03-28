import React, { useState, useEffect } from 'react';
import { getUrl, list } from 'aws-amplify/storage';
import DeleteComponent from './DeleteComponent';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
Amplify.configure(config);


function ListComponent({ user, refreshTrigger }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFiles();
  }, [user, refreshTrigger]);

  const fetchFiles = async () => {
    try {
      const usernamePrefix = user.username;
      const listResult = await list({ prefix: usernamePrefix });

      if (listResult && Array.isArray(listResult.items)) {
        const filesWithShortUrls = await Promise.all(listResult.items.map(async item => {
          const getUrlResult = await getUrl({
            key: item.key,
            options: { expiresIn: 60 }
          });
          const tinyUrl = await shortenUrl(getUrlResult.url);
          return { key: item.key, url: getUrlResult.url, tinyUrl };
        }));

        setFiles(filesWithShortUrls);
      } else {
        console.error('Unexpected structure of files:', listResult);
        setError('Failed to fetch files. Unexpected data format.');
      }
    } catch (err) {
      console.error('Error fetching files:', err);
      setError(`Error fetching files: ${err.message}`);
    }
  };

  const shortenUrl = async (url) => {
    const tinyURLApiKey = process.env.REACT_APP_TINYURL_API_KEY;
    console.log('API Response: ', tinyURLApiKey)
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
      console.log('TinyURL response:', data.data.tiny_url); // Log the response for debugging
      return data.data.tiny_url; // Ensure this matches the TinyURL response structure
    } catch (error) {
      console.error('Error shortening URL:', error);
      return url; // Return the original URL in case of error
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard');
    }).catch(err => {
      console.error('Error copying URL to clipboard:', err);
    });
  };

  const handleDeleteSuccess = (deletedFilename) => {
    setFiles(files => files.filter(file => file.key !== deletedFilename));
    // Optionally, you can trigger a message that file was deleted
  };

  return (
    <div>
      {files.map(file => (
        <div key={file.key} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <img src={file.url} alt={file.key} style={{ width: '300px', height: '300px', marginRight: '10px' }} />
          <div style={{ flexGrow: 1 }}>
            <p>{file.key}</p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="text" value={file.tinyUrl || file.url} readOnly style={{ flexGrow: 1 }} />
              <button onClick={() => copyToClipboard(file.tinyUrl || file.url)}>Copy</button>
              <DeleteComponent filename={file.key} onDeleteSuccess={handleDeleteSuccess} />
            </div>
          </div>
        </div>
      ))}
      {error && <p>{error}</p>}
    </div>
  );
}

export default withAuthenticator(ListComponent);


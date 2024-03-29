import React, { useState, useEffect } from 'react';
import { getUrl, list } from 'aws-amplify/storage';
import DeleteComponent from './DeleteComponent';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { generateClient } from 'aws-amplify/api';
import * as queries from './graphql/queries';

Amplify.configure(config);


function ListComponent({ user, refreshTrigger }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const client = generateClient();

  useEffect(() => {
    setTimeout(() => {
      fetchFiles();
    }, 3000);
  }, [user, refreshTrigger]);

  const fetchFiles = async () => {
    try {
      const usernamePrefix = user.username;
      const listResult = await list({ prefix: usernamePrefix });

      if (listResult && Array.isArray(listResult.items)) {
        // Fetch the TinyURL mappings using GraphQL query via the client
        const mappingsData = await client.graphql({ query: queries.listTinyURLMappings });
        const mappings = mappingsData.data.listTinyURLMappings.items.reduce((acc, mapping) => {
          acc[mapping.fileKey] = mapping.tinyUrl;
          return acc;
        }, {});

        let filesWithUrls = [];
        for (let item of listResult.items) {
          const getUrlResult = await getUrl({
            key: item.key,
            options: { expiresIn: 60 }
          });
          const tinyUrl = mappings[item.key] || getUrlResult.url;
          filesWithUrls.push({ key: item.key, url: getUrlResult.url, tinyUrl });
        }

        setFiles(filesWithUrls);
      } else {
        console.error('Unexpected structure of files:', listResult);
        setError('Failed to fetch files. Unexpected data format.');
      }
    } catch (err) {
      console.error('Error fetching files:', err);
      setError(`Error fetching files: ${err.message}`);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard, now paste it in the url field of the badge creator');
    }).catch(err => {
      console.error('Error copying URL to clipboard:', err);
    });
  };

  const handleDeleteSuccess = (deletedFilename) => {
    setFiles(files => files.filter(file => file.key !== deletedFilename));
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


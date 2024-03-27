import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
import PhotoUpload from './PhotoUpload';
import ListComponent from './ListComponent'; // Import the ListComponent
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(config);



function App() {

  const [refreshFileList, setRefreshFileList] = useState(false);

  const handleUploadSuccess = () => {
    // Toggle the state to trigger useEffect in ListComponent
    setRefreshFileList(!refreshFileList);
  };

  return (
    <div>
      <h1>SAVRP Badge Photo Server</h1>
      <PhotoUpload onUploadSuccess={handleUploadSuccess} />
      <ListComponent refreshTrigger={refreshFileList} />
    </div>
  );
}

export default withAuthenticator(App);

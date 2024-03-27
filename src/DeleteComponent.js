import React from 'react';
import { remove } from 'aws-amplify/storage';

function DeleteComponent({ filename, onDeleteSuccess }) {
  const handleDelete = async () => {
    try {
      await remove({ key: filename });
      // Call the onDeleteSuccess callback to notify the parent component
      onDeleteSuccess(filename);
    } catch (error) {
      alert(`Error deleting file: ${error.message}`);
    }
  };

  return (
    <button onClick={handleDelete}>Delete</button>
  );
}

export default DeleteComponent;
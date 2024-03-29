import React from 'react';
import { remove } from 'aws-amplify/storage';

function DeleteComponent({ filename, onDeleteSuccess }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${filename}`);
    if (!confirmDelete) {
      return;
    }

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
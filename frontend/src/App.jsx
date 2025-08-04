import React, { useState, useEffect } from 'react';
import VideoUploadForm from './components/VideoUploadForm';
import VideoList from './components/VideoList';

function App() {
  const [refresh, setRefresh] = useState(false);

  const onUploadSuccess = () => setRefresh(!refresh);

  return (
    <div style={{ padding: 20 }}>
      <h1>Omnicular</h1>
      <VideoUploadForm onUploadSuccess={onUploadSuccess} />
      <hr />
      <VideoList refresh={refresh} />
    </div>
  );
}

export default App;

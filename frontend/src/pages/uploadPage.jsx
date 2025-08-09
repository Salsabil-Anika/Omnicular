import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VideoUploadForm from '../components/VideoUploadForm';
import VideoList from '../components/VideoList';

export default function UploadPage() {
  return (
    <div className="upload-layout">
      <Navbar onSearch={() => {}} /> {/* No search on this page */}
      <div className="content">
        <Sidebar />
        <div className="upload-content">
          <h2>Upload Video</h2>
          <VideoUploadForm />
          <h3>Your Videos</h3>
          <VideoList />
        </div>
      </div>
    </div>
  );
}

import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UploadPage from './pages/uploadPage';
import SignInPage from './pages/SignInPage';
import VideoPlayerPage from './pages/VideoPlayerPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/auth" element={<SignInPage />} />
      <Route path="/video/:id" element={<VideoPlayerPage />} />
      
    </Routes>
  );
}

export default App;

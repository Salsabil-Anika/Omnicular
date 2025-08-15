import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UploadPage from './pages/uploadPage';
import SignInPage from './pages/SignIn';
import SignUp from './pages/Signup';
import VideoPlayerPage from './pages/VideoPlayerPage';
import SearchResult from './pages/SearchResult';
import MyVideos from './pages/MyVideos';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-videos"
        element={
          <ProtectedRoute>
            <MyVideos />
          </ProtectedRoute>
        }
      />

      <Route path="/auth" element={<SignInPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/video/:id" element={<VideoPlayerPage />} />
      <Route path="/search" element={<SearchResult />} />
    </Routes>
  );
}

export default App;

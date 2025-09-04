import { Routes, Route, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UploadPage from './pages/uploadPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import VideoPlayerPage from './pages/VideoPlayerPage';
import SearchResult from './pages/SearchResult';
import MyVideos from './pages/MyVideos';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './index.css';

function Shell() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-content">
        <Sidebar />
        <div className="page-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
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
        <Route path="/video/:id" element={<VideoPlayerPage />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/user/:id" element={<UserProfilePage />} />
      </Route>

      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchVideos } from "../services/videoService"; // ✅ correct function
import VideoGrid from "../components/VideoGrid";

export default function SearchResults() {
  const [videos, setVideos] = useState([]);
  const location = useLocation();

  // Get query string value
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  useEffect(() => {
    if (query.trim()) {
      searchVideos(query)
        .then((data) => setVideos(data))
        .catch(console.error);
    } else {
      setVideos([]);
    }
  }, [query]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Search results for: "{query}"</h2>
      {videos.length > 0 ? (
        <VideoGrid videos={videos} />
      ) : (
        <p>No videos found.</p>
      )}
    </div>
  );
}

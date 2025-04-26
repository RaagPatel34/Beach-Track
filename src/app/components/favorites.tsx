import { useEffect, useState } from "react";
import "../../styles/search-results.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/favorite");
        const data = await response.json();

        if (Array.isArray(data)) {
          setFavorites(data);
        } else {
          console.warn("Unexpected response:", data);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  if (favorites.length === 0) {
    return (
      <div>
        <p>No Favorite Classrooms</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Favorite Classrooms</h1>
      <div className="search-results">
        {favorites.map((location, index) => (
          <div key={index} className="search-item">
            <h3 className="course-name">{location}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;

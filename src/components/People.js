import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import "./People.css";
import { useGlobalData } from "./globaldatacontext";
import Loader from "./loader";

function People() {
  const navigate = useNavigate();
  const { people: globalPeople, loading, progress, error } = useGlobalData();
  const [visibleCount, setVisibleCount] = useState(12); // Start with 12 people
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Ensure globalPeople is defined before proceeding
  const people = globalPeople || [];

  // Get all unique tags for filter options
  const allTags = [...new Set(people.flatMap((person) => person.tags || []))];

  // Function to count occurrences of each tag
  const getTagCount = (tag) => {
    return people.filter((person) => person.tags?.includes(tag)).length;
  };

  const toggleFilter = (tag) => {
    setSelectedFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredPeople = people.filter(
    (person) =>
      selectedFilters.length === 0 ||
      selectedFilters.some((tag) => person.tags?.includes(tag))
  );

  // Show only up to the current `visibleCount`
  const visiblePeople = filteredPeople.slice(0, visibleCount);

  // Load More function
  const loadMore = () => {
    setVisibleCount((prev) => prev + 12); // Increase by 12 each time
  };

  if (loading) return <Loader percentage={progress} dataName="people" />;
  if (error) return <p>Error: {error}</p>;
  if (!people.length) return <p>No people data available.</p>;

  return (
    <div className="people-container">
      <div className="people-header">
        <h1>People</h1>

        <div className="filter-section">
          <div className="filter-header">
            <Filter size={20} />
            <span>Categories</span>
          </div>

          <div className="filter-tags">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`filter-tag ${selectedFilters.includes(tag) ? "active" : ""}`}
                onClick={() => toggleFilter(tag)}
                aria-pressed={selectedFilters.includes(tag)}
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)} ({getTagCount(tag)})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="people-grid">
        {visiblePeople.length > 0 ? (
          visiblePeople.map((person) => (
            <div
              key={person.person_id || person.slug}
              className="person-card"
              onClick={() => navigate(`/people/${person.slug}`)}
            >
              <div className="card-image-container">
                <img
                  src={person.image || "default-image.jpg"}
                  alt={person.full_name || "Unknown"}
                  className="card-image"
                />
              </div>
              <div className="card-content">
                <h3>{person.full_title_name || "Untitled"}</h3>
                <div className="card-tags">
                  {person.tags?.map((tag, index) => (
                    <span key={`${tag}-${index}`} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="card-title">{person.association || "No association"}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No people match the selected filters.</p>
        )}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredPeople.length && (
        <div className="load-more-container">
          <button onClick={loadMore} className="load-more-button">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default People;

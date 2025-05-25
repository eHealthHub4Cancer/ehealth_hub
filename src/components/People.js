import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import "./People.css";
import { useGlobalData } from "./globaldatacontext";
import Loader from "./loader";

function People() {
  const navigate = useNavigate();
  const { 
    people: globalPeople, 
    peopleLoading, 
    peopleProgress, 
    error
  } = useGlobalData();
  
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const people = globalPeople || [];
  const allTags = [...new Set(people.flatMap((person) => person.tags || []))];

  const getTagCount = useCallback((tag) => {
    return people.filter((person) => person.tags?.includes(tag)).length;
  }, [people]);

  const toggleFilter = useCallback((tag) => {
    setSelectedFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const filteredPeople = people.filter(
    (person) =>
      selectedFilters.length === 0 ||
      selectedFilters.some((tag) => person.tags?.includes(tag))
  );

  const visiblePeople = filteredPeople.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 12);
  }, []);

  // Use peopleLoading instead of general loading
  if (peopleLoading) return <Loader percentage={peopleProgress} dataName="people" />;
  if (error) return <p>Error: {error}</p>;
  if (!people.length) return <p>No people data available.</p>;

  return (
    <div className="people-container">
      <div className="people-header">
        <h1>People</h1>
        <div className="filter-section">
          <div className="filter-header">
            <Filter size={24} />
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
                  src={person.image || "/default-image.jpg"}
                  alt={person.full_name || "Unknown"}
                  className="card-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/default-image.jpg";
                  }}
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

export default React.memo(People);
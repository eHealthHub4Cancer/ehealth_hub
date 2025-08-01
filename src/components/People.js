import React, { useState, useCallback, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, RefreshCw } from "lucide-react";
import "./People.css";
import { useGlobalData } from "./globaldatacontext";
import Loader from "./loader";

// Debounce utility to limit preloading calls
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Custom memo comparison to log re-renders
const areEqual = (prevProps, nextProps) => {
  console.log("People.js memo check: prevProps", prevProps, "nextProps", nextProps);
  return true; // Prevent re-renders (no props expected)
};

// Function to determine person's priority group
const getPersonPriority = (person) => {
  const tags = person.tags || [];
  const lowerTags = tags.map(tag => tag.toLowerCase());
  
  if (lowerTags.includes('project leader') || lowerTags.includes('project-leader')) {
    return 1; // Highest priority
  } else if (lowerTags.includes('project supervisor') || lowerTags.includes('project-supervisor')) {
    return 2; // Second priority
  } else {
    return 3; // Lowest priority (others)
  }
};

// Custom sorting function
const sortPeople = (people) => {
  return people.sort((a, b) => {
    const priorityA = getPersonPriority(a);
    const priorityB = getPersonPriority(b);
    
    // First, sort by priority group
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    // Within the same priority group, sort alphabetically by full_title_name or full_name
    const nameA = (a.full_title_name || a.full_name || 'Untitled').toLowerCase();
    const nameB = (b.full_title_name || b.full_name || 'Untitled').toLowerCase();
    
    return nameA.localeCompare(nameB);
  });
};

function People() {
  console.log("People.js rendered"); // Debug re-renders
  const navigate = useNavigate();
  const {
    people: globalPeople,
    peopleLoading,
    error,
    refreshCache,
    preloadVisiblePeople,
  } = useGlobalData();

  const [visibleCount, setVisibleCount] = useState(28);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Sort people using custom sorting function
  const people = globalPeople ? sortPeople([...globalPeople]) : [];
  const allTags = [...new Set(people.flatMap((person) => person.tags || []))];

  const getTagCount = useCallback((tag) => {
    console.log(`getTagCount called for tag: ${tag}`); // Debug state usage
    return people.filter((person) => person.tags?.includes(tag)).length;
  }, [people]);

  const toggleFilter = useCallback((tag) => {
    console.log(`toggleFilter called for tag: ${tag}`); // Debug filter changes
    setSelectedFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  // Apply filters and maintain sorting
  const filteredPeople = people.filter(
    (person) =>
      selectedFilters.length === 0 ||
      selectedFilters.some((tag) => person.tags?.includes(tag))
  );

  const visiblePeople = filteredPeople.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    console.log("loadMore called"); // Debug button clicks
    setVisibleCount((prev) => prev + 12);
  }, []);

  // Debounced preloading
  const debouncedPreload = useCallback(
    debounce((people) => {
      console.log("Preloading visible people:", people.map((p) => p.slug));
      preloadVisiblePeople(people);
    }, 300),
    [preloadVisiblePeople]
  );

  // Preload visible people when they change
  useEffect(() => {
    if (visiblePeople.length > 0) {
      debouncedPreload(visiblePeople);
    }
  }, [visiblePeople, debouncedPreload]);

  if (error) {
    console.log("People.js showing error:", error); // Debug error state
    return <p>Error: {error}</p>;
  }

  return (
    <div className="people-container">
      {peopleLoading && (
        <div className="loading-overlay">
          <Loader dataName="people" />
        </div>
      )}
      <div className="people-header">
        <div className="header-top">
          <h1>People</h1>
          <button
            onClick={() => {
              console.log("refreshCache called"); // Debug refresh
              refreshCache();
            }}
            className="refresh-button"
            disabled={peopleLoading}
            title="Refresh to get latest updates"
          >
            <RefreshCw size={18} className={peopleLoading ? "spinning" : ""} />
            {peopleLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
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

      {/* Optional: Show sorting info */}
      <div className="sorting-info">
        <small className="sort-description">
          Showing: Project Leaders → Project Supervisors → Others (alphabetically within each group)
        </small>
      </div>

      <div className="people-grid">
        {people.length > 0 ? (
          visiblePeople.length > 0 ? (
            visiblePeople.map((person) => {
              return (
                <div
                  key={person.person_id || person.slug}
                  className={`person-card priority-${getPersonPriority(person)}`}
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
              );
            })
          ) : (
            <p>No people match the selected filters.</p>
          )
        ) : (
          !peopleLoading && <p>No people data available.</p>
        )}
      </div>
      {visibleCount < filteredPeople.length && (
        <div className="load-more-container">
          <button onClick={loadMore} className="load-more-button">
            Load More ({filteredPeople.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(People, areEqual);
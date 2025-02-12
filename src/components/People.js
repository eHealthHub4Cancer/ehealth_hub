import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import "./People.css";
import { useGlobalData } from "./globaldatacontext"; // Import the hook
import Loader from "./loader";

function People() {
  const navigate = useNavigate();
  const { people: globalPeople, loading, progress, error } = useGlobalData();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const itemsPerPage = 100; // Set the number of people per page.

  // Ensure globalPeople is defined before proceeding
  const people = globalPeople || [];

  // Get all unique tags for filter options
  const allTags = [...new Set(people.flatMap((person) => person.tags || []))];

  const toggleFilter = (tag) => {
    setSelectedFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1); // Reset to the first page on filter change.
  };

  const filteredPeople = people.filter(
    (person) =>
      selectedFilters.length === 0 ||
      selectedFilters.some((tag) => person.tags?.includes(tag))
  );

  const getTagCount = (tag) => {
    return people.filter((person) => person.tags?.includes(tag)).length;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPeople.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <Loader percentage={progress} dataName="people"/>;
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
        {currentItems.length > 0 ? (
          currentItems.map((person) => (
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination-button ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => handlePageChange(i + 1)}
              aria-current={currentPage === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default People;

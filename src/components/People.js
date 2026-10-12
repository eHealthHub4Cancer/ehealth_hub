import React, { useState, useCallback, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { Filter, RefreshCw } from "lucide-react";
import "./People.css";
import { useGlobalData } from "./globaldatacontext";
import Loader from "./loader";
import PersonPortrait from "./People/PersonPortrait";

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const areEqual = (prevProps, nextProps) => {
  return true;
};

const getPersonPriority = (person) => {
  const tags = person.tags || [];
  const lowerTags = tags.map(tag => tag.toLowerCase());

  if (lowerTags.includes('project leader') || lowerTags.includes('project-leader')) {
    return 1;
  } else if (lowerTags.includes('project supervisor') || lowerTags.includes('project-supervisor')) {
    return 2;
  } else {
    return 3;
  }
};

const sortPeople = (people) => {
  return people.sort((a, b) => {
    const priorityA = getPersonPriority(a);
    const priorityB = getPersonPriority(b);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    const nameA = (a.full_title_name || a.full_name || 'Untitled').toLowerCase();
    const nameB = (b.full_title_name || b.full_name || 'Untitled').toLowerCase();

    return nameA.localeCompare(nameB);
  });
};

function People() {
  const {
    people: globalPeople,
    peopleLoading,
    error,
    refreshCache,
    preloadVisiblePeople,
  } = useGlobalData();

  const [visibleCount, setVisibleCount] = useState(28);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [search, setSearch] = useState("");

  const people = globalPeople ? sortPeople([...globalPeople]) : [];
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
      (selectedFilters.length === 0 ||
      selectedFilters.some((tag) => person.tags?.includes(tag))) &&
      [person.full_title_name, person.full_name, person.association, ...(person.tags || [])].filter(Boolean).join(" ").toLowerCase().includes(search.trim().toLowerCase())
  );

  const visiblePeople = filteredPeople.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 12);
  }, []);

  const debouncedPreload = useCallback(
    debounce((people) => {
      preloadVisiblePeople(people);
    }, 300),
    [preloadVisiblePeople]
  );

  useEffect(() => {
    if (visiblePeople.length > 0) {
      debouncedPreload(visiblePeople);
    }
  }, [visiblePeople, debouncedPreload]);

  if (error) {
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
            onClick={() => refreshCache()}
            className="refresh-button"
            disabled={peopleLoading}
            title="Refresh to get latest updates"
          >
            <RefreshCw size={18} className={peopleLoading ? "spinning" : ""} />
            {peopleLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <div className="filter-section">
          <label className="people-search-label" htmlFor="people-search">Find a person</label>
          <input id="people-search" className="people-search" type="search" value={search} onChange={event => { setSearch(event.target.value); setVisibleCount(28); }} placeholder="Search by name, institution or category" />
          <div className="filter-header">
            <Filter size={16} />
            <span>Filter by role</span>
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

      <div className="directory-results" aria-live="polite">
        <span>{filteredPeople.length} {filteredPeople.length === 1 ? "person" : "people"}{search || selectedFilters.length ? " matching your search" : ""}</span>
        {(search || selectedFilters.length > 0) && <button type="button" onClick={() => {setSearch(""); setSelectedFilters([]);}}>Clear filters</button>}
      </div>
      <div className="people-grid">
        {people.length > 0 ? (
          visiblePeople.length > 0 ? (
            visiblePeople.map((person) => {
              return (
                <Link
                  key={person.person_id || person.slug}
                  className={`person-card priority-${getPersonPriority(person)}`}
                  to={`/people/${person.slug}`}
                >
                  <PersonPortrait person={person} />
                  <div className="card-content">
                    <h3>{person.full_title_name || person.full_name || "Untitled"}</h3>
                    <div className="card-tags">
                      {person.tags?.map((tag, index) => (
                        <span key={`${tag}-${index}`} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {person.association && <p className="card-title">{person.association}</p>}
                    <span className="view-profile">View profile →</span>
                  </div>
                </Link>
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

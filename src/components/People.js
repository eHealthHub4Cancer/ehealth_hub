import React, { useState, useCallback, useEffect, useRef, memo } from "react";
import { Link } from "react-router-dom";
import { Filter, RefreshCw, ArrowDown, Search } from "lucide-react";
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

  const [isMobile, setIsMobile] = useState(() => typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 600px)').matches);
  const [extraCount, setExtraCount] = useState(0);
  const batchSize = isMobile ? 10 : 20;
  const visibleCount = batchSize + extraCount;
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(max-width: 600px)');
    const update = () => { setIsMobile(query.matches); setExtraCount(0); };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [search, setSearch] = useState("");
  const [chosenTags, setChosenTags] = useState(null);
  const badgePickerRef = useRef(null);
  useEffect(() => {
    const dismiss = event => {
      const picker = badgePickerRef.current;
      if (picker && !picker.contains(event.target)) picker.open = false;
    };
    const escape = event => { if (event.key === 'Escape' && badgePickerRef.current) badgePickerRef.current.open = false; };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape); };
  }, []);

  const people = globalPeople ? sortPeople([...globalPeople]) : [];
  const allTags = [...new Set(people.flatMap((person) => person.tags || []))];

  const availableTags = chosenTags === null ? allTags : allTags.filter(tag => chosenTags.includes(tag));
  const allTagsChosen = chosenTags === null || availableTags.length === allTags.length;
  const unselectedTags = allTags.filter(tag => !availableTags.includes(tag));
  const visibleFilterTags = availableTags;
  const hiddenTags = unselectedTags;
  const changeChosenTag = (tag) => {
    const current = chosenTags === null ? allTags : chosenTags;
    const next = current.includes(tag) ? current.filter(value => value !== tag) : [...current, tag];
    setChosenTags(next);
    setSelectedFilters(previous => previous.filter(value => next.includes(value)));
    setExtraCount(0);
  };

  const getTagCount = useCallback((tag) => {
    return people.filter((person) => person.tags?.includes(tag)).length;
  }, [people]);

  const filteredPeople = people.filter(
    (person) =>
      (selectedFilters.length === 0 ||
      selectedFilters.some((tag) => person.tags?.includes(tag))) &&
      [person.full_title_name, person.full_name, person.association, ...(person.tags || [])].filter(Boolean).join(" ").toLowerCase().includes(search.trim().toLowerCase())
  );

  const visiblePeople = filteredPeople.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    setExtraCount((prev) => prev + batchSize);
  }, [batchSize]);

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
          <div className="people-search-wrap">
            <Search size={18} aria-hidden="true" />
          <label className="people-search-label" htmlFor="people-search">Find a person</label>
          <input id="people-search" className="people-search" type="search" value={search} onChange={event => { setSearch(event.target.value); setExtraCount(0); }} placeholder="Search by name, institution or category" />
          </div>
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
          <div className="filter-header">
            <Filter size={16} />
            <span>Filter by category</span>
            <details className="filter-badge-picker" ref={badgePickerRef}>
              <summary>Choose filter badges</summary>
              <div className="filter-badge-options">
                <label><input type="checkbox" checked={allTagsChosen} onChange={event => { setChosenTags(event.target.checked ? null : []); setSelectedFilters([]); setExtraCount(0); }} />Select all</label>
                {allTags.map(tag => <label key={tag}><input type="checkbox" checked={chosenTags === null || chosenTags.includes(tag)} onChange={() => changeChosenTag(tag)} />{tag}</label>)}
              </div>
            </details>
          </div>
          <div className="filter-tags">
            {visibleFilterTags.map((tag) => (
              <button
                key={tag}
                className={`filter-tag ${selectedFilters.includes(tag) ? "active" : ""}`}
                onClick={() => { setSelectedFilters(previous => previous.includes(tag) ? previous.filter(value => value !== tag) : [...previous, tag]); setExtraCount(0); }}
                aria-pressed={selectedFilters.includes(tag)}
              >
                <span>{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
                <span className="filter-badge-count">{getTagCount(tag)}</span>
              </button>
            ))}
          </div>
          {hiddenTags.length > 0 && <button type="button" className="filter-badge-more" aria-label={`Load more filter badges (${Math.min(5, hiddenTags.length)})`} onClick={() => {
            const loaded = hiddenTags.slice(0, 5);
            const next = [...new Set([...availableTags, ...loaded])];
            setChosenTags(next);
                    setExtraCount(0);
          }}>Load more ({Math.min(5, hiddenTags.length)})<ArrowDown size={15} aria-hidden="true" /></button>}
        </div>
      </div>

      <div className="directory-results" aria-live="polite">
        <span>{filteredPeople.length} {filteredPeople.length === 1 ? "person" : "people"}{search || selectedFilters.length ? " matching your search" : ""}</span>
        {(search || selectedFilters.length > 0) && <button type="button" onClick={() => {setSearch(""); setSelectedFilters([]); setChosenTags(null); setExtraCount(0);}}>Clear filters</button>}
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
                      {person.tags?.slice().sort((a, b) => Number(/leader|supervisor|researcher|student/i.test(b)) - Number(/leader|supervisor|researcher|student/i.test(a))).slice(0, 2).map((tag, index) => (
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
            Load more ({Math.min(batchSize, filteredPeople.length - visibleCount)})
            <ArrowDown size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(People, areEqual);

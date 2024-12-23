import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import './People.css';
import API_ENDPOINTS from "./api/config";
import axios from 'axios';

function People() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const itemsPerPage = 5; // set the number of people per page.
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // add people from the axios request to the state.
    useEffect(() => {
      const fetchPeople = async () => {
        try {
          const response = await axios.get(API_ENDPOINTS.PEOPLE, { withCredentials: true });
          const data = response.data;
          // Add a unique person_id to each person in PeopleData.people
          const peopleWithIds = data.map((person, index) => ({
              ...person,
              person_id: index + 1
          }));
          setPeople(peopleWithIds);
          console.log(peopleWithIds);
          console.log(data.tags);
        } catch (error) {
          setError(error.message); // Handle any errors
        } finally {
          setLoading(false); // Set loading to false once data is fetched
        }
      };

      fetchPeople();
    }, []); // Empty dependency array ensures this runs once when the component mounts
  
    // get all the unique tags for filter options.
    const allTags = [...new Set(people.flatMap(person => person.tags))];
    
    const toggleFilter = (tag) => {
        setSelectedFilters(prev => 
            prev.includes(tag)
            ? prev.filter(t => t !== tag)
            : [...prev, tag]
        );
        setCurrentPage(1); // reset to the first page on filter change.
    };

    const filteredPeople = people.filter(person => 
        selectedFilters.length === 0 || selectedFilters.some(tag => person.tags.includes(tag))
    );

    const getTagCount = (tag) => {
        return people.filter(person => person.tags.includes(tag)).length;
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPeople.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`filter-tag ${selectedFilters.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleFilter(tag)}
                >
                  {tag.charAt(0) + tag.slice(1)} ({getTagCount(tag)})
                </button>
              ))}
            </div>
          </div>
        </div>
  
        <div className="people-grid">
          {currentItems.map(person => (
            <div
              key={person.person_id}
              className="person-card"
              onClick={() => navigate(`/people/${person.slug}`)}
            >
              <div className="card-image-container">
                <img src={person.image} alt={person.full_name} className="card-image" />
              </div>
              <div className="card-content">
                <h3>{person.full_title_name}</h3>
                <div className="card-tags">
                  {person.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="card-title">{person.association}</p>
              </div>
            </div>
          ))}
        </div>
  
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(i + 1)}
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
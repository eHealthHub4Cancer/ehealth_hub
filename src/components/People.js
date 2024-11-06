import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import './People.css';

function People() {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState([]);
  
  const people = [
    {
      id: 1,
      name: 'Dr Shirin Moghaddam',
      title: 'Mathematics and Statistics, Faculty Of Science & Engineering, University of Limerick',
      image: require('../Images/People/ShirinMoghaddam.jpeg'),
      tags: ['PROJECT SUPERVISOR', 'LIMERICK'],
      route: '/people/shirin'
    },
    {
      id: 2,
      name: 'Dr Katie Crowley',
      title: 'Associate Professor Computer Science & Health Informatics, Funded Investigator, Lero, University of Limerick',
      image: require('../Images/People/KatieCrowley.png'),
      tags: ['PROJECT SUPERVISOR', 'LIMERICK', 'LDCRC'],
      route: '/people/katie'
    },
    {
      id: 3,
      name: 'Prof Aedin Culhane',
      title: 'Professor, University of Limerick',
      image: require('../Images/People/aedinculhane.png'),
      tags: ['PROJECT LEADER', 'LIMERICK', 'LDCRC'],
      route: '/people/aedin'
    },
    {
      id: 4,
      name: 'Prof Bill Watson',
      title: 'Professor, University College Dublin',
      image: require('../Images/People/BillWatson.jpeg'),
      tags: ['PROJECT SUPERVISOR', 'DUBLIN', 'UCD'],
      route: '/people/bill'
    },
    {
      id: 5,
      name: 'Prof Ian Overton',
      title: 'Reader, School of Medicine, Dentistry and Biomedical Sciences, Patrick G Johnston Centre for Cancer Research, Queens University, Belfast',
      image: require('../Images/People/ianOverton.png'),
      tags: ['PROJECT SUPERVISOR', 'BELFAST', 'QUB'],
      route: '/people/ian'
    },
    {
      id: 6,
      name: 'Prof Mark Lawler',
      title: 'Professor, Queens University Belfast',
      image: require('../Images/People/MarkLawler.jpg'),
      tags: ['PROJECT LEADER', 'BELFAST', 'QUB'],
      route: '/people/mark'
    },
    {
      id: 7,
      name: 'Prof Nina Orfali',
      title: "Consultant Haematologist, St. James's Hospital Dublin",
      image: require('../Images/People/NinaOrfali.png'),
      tags: ['PROJECT SUPERVISOR', 'DUBLIN', 'ST JAMES'],
      route: '/people/nina'
    },
    {
      id: 8,
      name: 'Prof Ruth Clifford',
      title: 'Consultant Haematologist, University Hospital Limerick',
      image: require('../Images/People/RuthClifford.jpg'),
      tags: ['PROJECT LEADER', 'LIMERICK', 'LDCRC'],
      route: '/people/ruth'
    },
    {
      id: 9,
      name: 'Prof Simon McDade',
      title: 'Reader, Patrick G Johnston Centre for Cancer Research, Queens University, Belfast',
      image: require('../Images/People/simonmcdade.png'),
      tags: ['PROJECT SUPERVISOR', 'BELFAST', 'QUB'],
      route: '/people/simon'
    }
  ];

  // Get all unique tags for filter options
  const allTags = [...new Set(people.flatMap(person => person.tags))];
  
  const toggleFilter = (tag) => {
    setSelectedFilters(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredPeople = people.filter(person =>
    selectedFilters.length === 0 || selectedFilters.some(tag => person.tags.includes(tag))
  );

  const getTagCount = (tag) => {
    return people.filter(person => person.tags.includes(tag)).length;
  };

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
                {tag.charAt(0) + tag.slice(1).toLowerCase()} ({getTagCount(tag)})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="people-grid">
        {filteredPeople.map(person => (
          <div
            key={person.id}
            className="person-card"
            onClick={() => navigate(person.route)}
          >
            <div className="card-image-container">
              <img src={person.image} alt={person.name} className="card-image" />
            </div>
            <div className="card-content">
              <h3>{person.name}</h3>
              <div className="card-tags">
                {person.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag.toLowerCase()}
                  </span>
                ))}
              </div>
              <p className="card-title">{person.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default People;
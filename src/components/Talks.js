import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './Talks.css';

function Talks() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample talks data
  const talks = [
    {
      id: 1,
      fileName: '22_09_09_BCNI_Galway.pdf',
      modified: '6/5/24, 3:06:20 AM',
      url: 'https://ehealth4cancer.org/contents/presentations/22_09_09_BCNI_Galway.pdf'
    },
    {
      id: 2,
      fileName: '22_09_28_AICRI_launch.pdf',
      modified: '6/5/24, 3:06:20 AM',
      url: 'https://ehealth4cancer.org/contents/presentations/22_09_28_AICRI_launch.pdf'
    }
  ];

  // Filter talks based on search term
  const filteredTalks = talks.filter(talk =>
    talk.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="talks-container">
      <div className="talks-header">
        <div className="header-content">
          <h1>Talks</h1>
          <p className="talks-count">All ({talks.length})</p>
        </div>
        
        <div className="search-container">
          <div className="search-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Filter by filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="talks-table-container">
        <table className="talks-table">
          <thead>
            <tr>
              <th className="file-name-header">File Name</th>
              <th className="modified-header">Modified</th>
            </tr>
          </thead>
          <tbody>
            {filteredTalks.map((talk) => (
              <tr key={talk.id} className="talk-row">
                <td className="file-name-cell">
                  <a href={talk.url} target="_blank" rel="noopener noreferrer" className="file-link">
                    {talk.fileName}
                  </a>
                </td>
                <td className="modified-cell">{talk.modified}</td>
              </tr>
            ))}
            {filteredTalks.length === 0 && (
              <tr>
                <td colSpan="2" className="no-results">
                  No talks found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Talks;
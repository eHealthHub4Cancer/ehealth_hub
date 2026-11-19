// src/components/MigrateResearchOutputs.js
// One-time import of the publications, reports and other outputs data files into Firebase
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllOutputs,
  getStaticOutputs,
  importStaticOutputs,
  OUTPUT_TYPES
} from '../services/researchOutputsService';
import './MigrateNews.css';

const MigrateResearchOutputs = () => {
  const [status, setStatus] = useState('checking'); // checking, ready, importing, done, error
  const [existingCount, setExistingCount] = useState(0);
  const [importedCount, setImportedCount] = useState(0);
  const [errorText, setErrorText] = useState('');

  const staticOutputs = getStaticOutputs();

  useEffect(() => {
    getAllOutputs(false)
      .then(outputs => {
        setExistingCount(outputs.length);
        setStatus('ready');
      })
      .catch(error => {
        setErrorText(error.message);
        setStatus('error');
      });
  }, []);

  const handleImport = async () => {
    setStatus('importing');
    try {
      setImportedCount(await importStaticOutputs());
      setStatus('done');
    } catch (error) {
      setErrorText(error.message);
      setStatus('error');
    }
  };

  return (
    <div className="migrate-container">
      <div className="migrate-header">
        <h1>Import Publications & Outputs</h1>
        <p>Copies the current publications, reports, posters and presentations into Firebase so they can be managed from the admin page.</p>
      </div>

      <div className="preview-container">
        <h3>To import</h3>
        <div className="preview-summary">
          {OUTPUT_TYPES.map(type => (
            <div key={type.value}>
              {type.plural}: <strong>{staticOutputs.filter(o => o.type === type.value).length}</strong>
            </div>
          ))}
        </div>
      </div>

      {status === 'ready' && existingCount > 0 && (
        <div className="migrate-warning">
          Firebase already has outputs, so the import is disabled to avoid duplicates.
          <span className="existing-count">{existingCount} outputs already in Firebase</span>
        </div>
      )}

      {status === 'done' && (
        <div className="migrate-warning">
          Imported {importedCount} outputs. They can now be managed under{' '}
          <Link to="/admin/news?section=outputs">News admin → Publications & Outputs</Link>.
        </div>
      )}

      {status === 'error' && (
        <div className="migrate-warning">
          Something went wrong: {errorText}
        </div>
      )}

      <div className="migrate-actions">
        <button
          className="btn-upload"
          onClick={handleImport}
          disabled={status !== 'ready' || existingCount > 0}
        >
          {status === 'checking' && 'Checking Firebase...'}
          {status === 'importing' && 'Importing...'}
          {(status === 'ready' || status === 'error') && `Import ${staticOutputs.length} outputs`}
          {status === 'done' && 'Done'}
        </button>
      </div>
    </div>
  );
};

export default MigrateResearchOutputs;

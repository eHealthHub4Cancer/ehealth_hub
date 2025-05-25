import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getPeople, getPersonInformation } from "./api";

// Constants for caching
const PEOPLE_CACHE_KEY = 'people_data_cache';
const PERSON_INFO_CACHE_KEY = 'person_info_cache';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const [people, setPeople] = useState(null);
  const [personInformation, setPersonInformation] = useState(null);
  
  // Separate loading states
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [personLoading, setPersonLoading] = useState(false);
  
  // Separate progress states
  const [peopleProgress, setPeopleProgress] = useState(0);
  const [personProgress, setPersonProgress] = useState(0);
  
  const [error, setError] = useState(null);

  // Check cache for data
  const getCachedData = (key) => {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp <= CACHE_EXPIRY) {
          return data;
        }
      }
    } catch (e) {
      console.warn('Cache read error:', e);
    }
    return null;
  };

  // Set cache for data
  const setCachedData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        timestamp: Date.now(),
        data
      }));
    } catch (e) {
      console.warn('Cache write error:', e);
    }
  };

  // Fetch the list of people on initialization
  useEffect(() => {
    const fetchGlobalData = async () => {
      setPeopleLoading(true);
      setPeopleProgress(0);
      setError(null);
      
      try {
        // Check cache first
        const cachedPeople = getCachedData(PEOPLE_CACHE_KEY);
        if (cachedPeople) {
          setPeople(cachedPeople);
          setPeopleProgress(100);
          setPeopleLoading(false);
          return;
        }

        // Fetch from API
        setPeopleProgress(50);
        const peopleData = await getPeople();
        setPeople(peopleData);
        setCachedData(PEOPLE_CACHE_KEY, peopleData);
        setPeopleProgress(100);
      } catch (err) {
        setError(err.message);
      } finally {
        setPeopleLoading(false);
      }
    };
    
    fetchGlobalData();
  }, []);

  // Fetch individual person information by slug
  const fetchPersonInformation = useCallback(async (slug) => {
    setPersonLoading(true);
    setPersonProgress(0);
    setError(null);
    
    try {
      // Check cache first
      const cachedPersonInfo = getCachedData(PERSON_INFO_CACHE_KEY);
      if (cachedPersonInfo && cachedPersonInfo[slug]) {
        setPersonInformation(cachedPersonInfo[slug]);
        setPersonProgress(100);
        setPersonLoading(false);
        return;
      }

      // Fetch from API
      setPersonProgress(50);
      const personData = await getPersonInformation(slug);
      setPersonInformation(personData);

      // Update cache
      const updatedCache = { ...(getCachedData(PERSON_INFO_CACHE_KEY) || {}), [slug]: personData };
      setCachedData(PERSON_INFO_CACHE_KEY, updatedCache);
      
      setPersonProgress(100);
    } catch (err) {
      if (err.message.includes("404")) {
        setPersonInformation(null);
      } else {
        setError(err.message);
      }
    } finally {
      setPersonLoading(false);
    }
  }, []);

  // Reset personInformation
  const resetPersonInformation = useCallback(() => {
    setPersonInformation(null);
    setError(null);
    setPersonProgress(0);
  }, []);

  return (
    <GlobalDataContext.Provider
      value={{
        people,
        personInformation,
        
        // Expose separate loading states
        peopleLoading,
        personLoading,
        loading: peopleLoading || personLoading, // Legacy support
        
        // Expose separate progress states  
        peopleProgress,
        personProgress,
        progress: personLoading ? personProgress : peopleProgress, // Legacy support
        
        error,
        fetchPersonInformation,
        resetPersonInformation,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);
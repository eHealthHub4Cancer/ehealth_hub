import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getPeople, getPersonInformation } from "./api";

// Constants for caching
const PEOPLE_CACHE_KEY = 'people_data_cache';
const PERSON_INFO_CACHE_KEY = 'person_info_cache';
const CACHE_EXPIRY = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const [people, setPeople] = useState(null);
  const [personInformation, setPersonInformation] = useState(null);
  
  // Separate loading states
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [personLoading, setPersonLoading] = useState(false);
  
  const [error, setError] = useState(null);

  // Check cache for data
  const getCachedData = (key) => {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp <= CACHE_EXPIRY) {
          return data;
        } else {
          localStorage.removeItem(key);
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

  // Batch preload person details for a specific set of people (pagination-aware)
  const preloadVisiblePeople = useCallback(async (visiblePeople) => {
    if (!visiblePeople?.length) return;

    const cachedPersonInfo = getCachedData(PERSON_INFO_CACHE_KEY) || {};
    const slugsToPreload = visiblePeople
      .map(person => person.slug)
      .filter(slug => !cachedPersonInfo[slug]); // Only preload uncached people

    if (slugsToPreload.length === 0) {
      console.log(' All visible people already cached');
      return;
    }

    console.log(` Preloading ${slugsToPreload.length} visible people...`);
    
    // Batch load in groups of 3
    const batchSize = 3;
    const personInfoMap = { ...cachedPersonInfo };
    
    for (let i = 0; i < slugsToPreload.length; i += batchSize) {
      const batch = slugsToPreload.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (slug) => {
        try {
          const personData = await getPersonInformation(slug);
          personInfoMap[slug] = personData;
          console.log(` Preloaded: ${slug}`);
        } catch (err) {
          console.warn(` Failed to preload: ${slug}`);
        }
      });
      
      await Promise.all(batchPromises);
    }

    // Update cache with newly preloaded data
    setCachedData(PERSON_INFO_CACHE_KEY, personInfoMap);
    console.log(`✅ Preloaded ${slugsToPreload.length} people details`);
  }, []);

  // Fetch ONLY the people list (fast initial load)
  useEffect(() => {
    const fetchPeopleList = async () => {
      setPeopleLoading(true);
      setError(null);
      
      try {
        // Check cache first
        const cachedPeople = getCachedData(PEOPLE_CACHE_KEY);
        if (cachedPeople) {
          console.log(`Loaded ${cachedPeople.length} people from cache`);
          setPeople(cachedPeople);
          setPeopleLoading(false);
          
          // Preload first 12 people silently
          setTimeout(() => {
            const firstTwelve = cachedPeople.slice(0, 12);
            preloadVisiblePeople(firstTwelve);
          }, 100);
          return;
        }

        // Fetch from API
        const peopleData = await getPeople();
        setPeople(peopleData);
        setCachedData(PEOPLE_CACHE_KEY, peopleData);
        console.log(`Loaded ${peopleData.length} people from API`);
        
        // Preload first 12 people
        const firstTwelve = peopleData.slice(0, 12);
        await preloadVisiblePeople(firstTwelve);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setPeopleLoading(false);
      }
    };
    
    fetchPeopleList();
  }, [preloadVisiblePeople]);

  // Fetch individual person information by slug (instant if preloaded)
  const fetchPersonInformation = useCallback(async (slug) => {
    console.log(` Fetching person: ${slug}`);
    
    setPersonLoading(true);
    setError(null);
    
    try {
      // Check cache first
      const cachedPersonInfo = getCachedData(PERSON_INFO_CACHE_KEY);
      if (cachedPersonInfo && cachedPersonInfo[slug]) {
        console.log(` INSTANT: ${slug} loaded from cache`);
        setPersonInformation(cachedPersonInfo[slug]);
        setPersonLoading(false);
        return;
      }

      // Fallback: fetch from API if not preloaded
      console.log(` API FETCH: ${slug}`);
      const personData = await getPersonInformation(slug);
      setPersonInformation(personData);

      // Update cache
      const updatedCache = { ...(getCachedData(PERSON_INFO_CACHE_KEY) || {}), [slug]: personData };
      setCachedData(PERSON_INFO_CACHE_KEY, updatedCache);
      
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

  // Refresh only the people list (fast refresh)
  const refreshCache = useCallback(async () => {
    console.log(' Refreshing people list...');
    localStorage.removeItem(PEOPLE_CACHE_KEY);
    
    setPeopleLoading(true);
    try {
      const peopleData = await getPeople();
      setPeople(peopleData);
      setCachedData(PEOPLE_CACHE_KEY, peopleData);
      console.log(` Refreshed ${peopleData.length} people`);
    } catch (err) {
      setError(err.message);
    } finally {
      setPeopleLoading(false);
    }
  }, []);

  // Reset personInformation
  const resetPersonInformation = useCallback(() => {
    setPersonInformation(null);
    setError(null);
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
        
        error,
        fetchPersonInformation,
        preloadVisiblePeople,
        resetPersonInformation,
        refreshCache,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);
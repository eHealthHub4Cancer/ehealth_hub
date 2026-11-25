import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { getPeople, getPersonInformation } from "./api";

// Constants for caching
const PEOPLE_CACHE_KEY = "people_data_cache";
const PERSON_INFO_CACHE_KEY = "person_info_cache";
const PEOPLE_REFRESH_INTERVAL = 60 * 1000;
const CACHE_EXPIRY = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const [people, setPeople] = useState(null);
  const [personInformation, setPersonInformation] = useState(null);

  // Separate loading states
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [personLoading, setPersonLoading] = useState(false);

  const [error, setError] = useState(null);
  const peopleRequest = useRef(null);
  const lastPeopleRequest = useRef(null);
  const hasPeople = useRef(false);
  const mounted = useRef(false);

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
      console.warn("Cache read error:", e);
    }
    return null;
  };

  // Set cache for data
  const setCachedData = (key, data) => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          timestamp: Date.now(),
          data,
        })
      );
    } catch (e) {
      console.warn("Cache write error:", e);
    }
  };

  // Silent batch preload for person details
  const preloadVisiblePeople = useCallback(async (visiblePeople) => {
    if (!visiblePeople?.length) {
      console.log("No people to preload");
      return;
    }

    const cachedPersonInfo = getCachedData(PERSON_INFO_CACHE_KEY) || {};
    const slugsToPreload = visiblePeople
      .map((person) => person.slug)
      .filter((slug) => !cachedPersonInfo[slug]); // Skip cached slugs

    if (slugsToPreload.length === 0) {
      console.log("All visible people already cached");
      return;
    }

    console.log(`Preloading ${slugsToPreload.length} people...`);

    // Batch load in groups of 12 as requested
    const batchSize = 12;
    const personInfoMap = { ...cachedPersonInfo };

    for (let i = 0; i < slugsToPreload.length; i += batchSize) {
      const batch = slugsToPreload.slice(i, i + batchSize);
      const batchPromises = batch.map(async (slug) => {
        try {
          const personData = await getPersonInformation(slug);
          personInfoMap[slug] = personData;
          console.log(`Preloaded ${slug}`);
        } catch (err) {
          console.warn(`Failed to preload ${slug}:`, err);
        }
      });

      await Promise.all(batchPromises);
    }

    // Update cache silently without triggering personLoading
    setCachedData(PERSON_INFO_CACHE_KEY, personInfoMap);
    console.log(`Preloaded ${slugsToPreload.length} people details`);
  }, []);

  // Preload all people details after initial load
  useEffect(() => {
    const preloadAllPeople = async () => {
      if (!people?.length) return;

      const cachedPersonInfo = getCachedData(PERSON_INFO_CACHE_KEY) || {};
      const slugsToPreload = people
        .map((person) => person.slug)
        .filter((slug) => !cachedPersonInfo[slug]);

      if (slugsToPreload.length === 0) {
        console.log("All people details already cached");
        return;
      }

      console.log(`Preloading all ${slugsToPreload.length} people details...`);

      // Batch load in groups of 12
      const batchSize = 12;
      const personInfoMap = { ...cachedPersonInfo };

      for (let i = 0; i < slugsToPreload.length; i += batchSize) {
        const batch = slugsToPreload.slice(i, i + batchSize);
        const batchPromises = batch.map(async (slug) => {
          try {
            const personData = await getPersonInformation(slug);
            personInfoMap[slug] = personData;
            console.log(`Preloaded all: ${slug}`);
          } catch (err) {
            console.warn(`Failed to preload all: ${slug}:`, err);
          }
        });

        await Promise.all(batchPromises);
      }

      setCachedData(PERSON_INFO_CACHE_KEY, personInfoMap);
      console.log(`Preloaded all ${slugsToPreload.length} people details`);
    };

    if (people && !peopleLoading) {
      preloadAllPeople();
    }
  }, [people, peopleLoading]);

  // Cached data stays visible while one shared request refreshes the list.
  const revalidatePeople = useCallback(({ force = false } = {}) => {
    if (peopleRequest.current) return peopleRequest.current;
    if (!force && lastPeopleRequest.current !== null && Date.now() - lastPeopleRequest.current < PEOPLE_REFRESH_INTERVAL) {
      return Promise.resolve();
    }
    lastPeopleRequest.current = Date.now();
    if (!hasPeople.current || force) setPeopleLoading(true);
    setError(null);
    const request = (async () => {
      try {
        const peopleData = await getPeople();
        if (!mounted.current) return;
        hasPeople.current = true;
        setPeople(peopleData);
        setCachedData(PEOPLE_CACHE_KEY, peopleData);
      } catch (err) {
        // A failed background request must not hide a usable cached directory.
        if (mounted.current && (!hasPeople.current || force)) setError(err.message);
      } finally {
        if (mounted.current) setPeopleLoading(false);
        peopleRequest.current = null;
      }
    })();
    peopleRequest.current = request;
    return request;
  }, []);

  useEffect(() => {
    mounted.current = true;
    const cachedPeople = getCachedData(PEOPLE_CACHE_KEY);
    if (cachedPeople) {
      hasPeople.current = true;
      setPeople(cachedPeople);
      // Respect the refresh limit across reloads as well as focus events.
      try {
        lastPeopleRequest.current = JSON.parse(localStorage.getItem(PEOPLE_CACHE_KEY)).timestamp;
      } catch {
        lastPeopleRequest.current = null;
      }
    }
    revalidatePeople();
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') revalidatePeople();
    };
    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    const timer = window.setInterval(refreshWhenVisible, PEOPLE_REFRESH_INTERVAL);
    return () => {
      mounted.current = false;
      window.clearInterval(timer);
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [revalidatePeople]);

  // Fetch individual person information by slug
  const fetchPersonInformation = useCallback(async (slug) => {
    console.log(`Fetching person: ${slug}`);
    setPersonLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedPersonInfo = getCachedData(PERSON_INFO_CACHE_KEY);
      if (cachedPersonInfo && cachedPersonInfo[slug]) {
        console.log(`Showing cached ${slug} while refreshing from API`);
        setPersonInformation(cachedPersonInfo[slug]);
        setPersonLoading(false);
      }

      // Always refresh viewed profiles so admin changes do not stay stale.
      console.log(`API FETCH: ${slug}`);
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

  // Manual refresh bypasses the minute limit and invalidates profile details.
  const refreshCache = useCallback(async () => {
    try {
      localStorage.removeItem(PERSON_INFO_CACHE_KEY);
    } catch (err) {
      console.warn("Cache removal error:", err);
    }
    return revalidatePeople({ force: true });
  }, [revalidatePeople]);

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
        peopleLoading,
        personLoading,
        loading: peopleLoading || personLoading, 
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
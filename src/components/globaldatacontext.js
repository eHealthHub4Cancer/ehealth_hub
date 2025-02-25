import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getPeople, getPersonInformation } from "./api";

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const [people, setPeople] = useState(null);
  const [personInformation, setPersonInformation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  // Simulate a progressive fetch with updates to progress
  const simulateProgressiveFetch = useCallback(async (fetchFunction) => {
    const totalSteps = 5;
    let result = null;
    try {
      const fetchPromise = fetchFunction();
      for (let step = 1; step <= totalSteps; step++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setProgress((prev) => Math.min(prev + 100 / totalSteps, 100));
        if (step === totalSteps || result) {
          result = await fetchPromise;
        }
      }
    } catch (error) {
      throw error;
    }
    return result;
  }, []);

  // Fetch the list of people on initialization
  useEffect(() => {
    const fetchGlobalData = async () => {
      setLoading(true);
      setProgress(0);
      setError(null);
      try {
        const peopleData = await simulateProgressiveFetch(getPeople);
        setPeople(peopleData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalData();
  }, [simulateProgressiveFetch]);

  // Fetch individual person information by slug.
  // If a 404 error is encountered, we simply set personInformation to null.
  const fetchPersonInformation = useCallback(async (slug) => {
    setLoading(true);
    setProgress(0);
    setError(null);
    try {
      const personData = await simulateProgressiveFetch(() =>
        getPersonInformation(slug)
      );
      setPersonInformation(personData);
    } catch (err) {
      if (err.message.includes("404")) {
        // Treat 404 as "no data" rather than an error.
        setPersonInformation(null);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [simulateProgressiveFetch]);

  // Expose the context values including fetchPersonInformation.
  return (
    <GlobalDataContext.Provider
      value={{
        people,
        personInformation,
        loading,
        progress,
        error,
        fetchPersonInformation,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);

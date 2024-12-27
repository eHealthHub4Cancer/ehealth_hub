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
      // Perform the fetch outside the loop to decouple progress simulation
      const fetchPromise = fetchFunction();
  
      for (let step = 1; step <= totalSteps; step++) {
        await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate delay
        setProgress((prev) => Math.min(prev + 100 / totalSteps, 100)); // Update progress incrementally
  
        if (step === totalSteps || result) {
          result = await fetchPromise; // Wait for the fetch to complete
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
      setError(null); // Reset error

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

  // Fetch individual person information by slug
  const fetchPersonInformation = useCallback(async (slug) => {
    setLoading(true);
    setProgress(0);
    setError(null); // Reset error

    try {
      const personData = await simulateProgressiveFetch(() =>
        getPersonInformation(slug)
      );
      setPersonInformation(personData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [simulateProgressiveFetch]);

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

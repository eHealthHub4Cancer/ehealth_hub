import API_ENDPOINTS from "./api/config";

// Generalized fetch function
export const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
    throw error;
  }
};

// Fetch a list of people
export const getPeople = async () => {
  return await fetchData(API_ENDPOINTS.PEOPLE);
};

// Fetch details for a specific person by slug
export const getPersonInformation = async (slug) => {
  return await fetchData(`${API_ENDPOINTS.PEOPLE_INFORMATION}${slug}/`);
};

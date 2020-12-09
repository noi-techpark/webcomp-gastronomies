import {
  BASE_PATH_TOURISM_GASTRONOMY,
  BASE_PATH_TOURISM_GASTRONOMYTYPES,
  BASE_PATH_TOURISM_GASTRONOMY_REDUCED,
} from "./config";

export const requestTourismGastronomies = async (filters) => {
  let categorycodefilter = "";
  if (filters.categories.length) {
    console.log(filters.categories);
    categorycodefilter = `&categorycodefilter=${filters.categories.toString()}`;
  }
  // categorycodefilter
  try {
    const request = await fetch(
      `${BASE_PATH_TOURISM_GASTRONOMY_REDUCED}?active=true&odhactive=true&fields=Id,Latitude,Longitude${categorycodefilter}`
    );
    if (request.status !== 200) {
      throw new Error(request.statusText);
    }
    const response = await request.json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const requestTourismGastronomiesCategories = async (language) => {
  try {
    const request = await fetch(`${BASE_PATH_TOURISM_GASTRONOMYTYPES}`);
    if (request.status !== 200) {
      throw new Error(request.statusText);
    }
    const response = await request.json();
    const categories = response
      .filter((o) => o.Type === "CategoryCodes")
      .map((o) => {
        return [o.TypeDesc[language], o.Bitmask];
      });
    return categories;
  } catch (error) {
    console.log(error);
  }
};

export const requestTourismGastronomyDetails = async ({ Id }) => {
  try {
    const request = await fetch(`${BASE_PATH_TOURISM_GASTRONOMY}/${Id}`);
    if (request.status !== 200) {
      throw new Error(request.statusText);
    }
    const response = await request.json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

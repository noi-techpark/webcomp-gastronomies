import {
  BASE_PATH_TOURISM_GASTRONOMY,
  BASE_PATH_TOURISM_GASTRONOMYTYPES,
  BASE_PATH_TOURISM_GASTRONOMY_REDUCED,
} from "./config";

export const requestTourismGastronomies = async (filters, currentLocation) => {
  let categorycodefilter = "";
  if (filters.categories.length) {
    categorycodefilter = `&categorycodefilter=${filters.categories.toString()}`;
  }
  let facilityCodesCreditCard = "";
  if (filters.facilityCodesCreditCard.length) {
    facilityCodesCreditCard = `&facilitycodefilter=${filters.facilityCodesCreditCard.toString()}`;
  }
  let facilityCodesFeatures = "";
  if (filters.facilityCodesFeatures.length) {
    facilityCodesFeatures = `&facilitycodefilter=${filters.facilityCodesFeatures.toString()}`;
  }
  let facilityCodesQuality = "";
  if (filters.facilityCodesQuality.length) {
    facilityCodesQuality = `&facilitycodefilter=${filters.facilityCodesQuality.toString()}`;
  }
  let facilityCodesCuisine = "";
  if (filters.facilityCodesCuisine.length) {
    facilityCodesCuisine = `&facilitycodefilter=${filters.facilityCodesCuisine.toString()}`;
  }
  let radius = "";
  if (filters.radius && filters.radius !== "0") {
    radius = `&latitude=${currentLocation.lat}&longitude=${
      currentLocation.lng
    }&radius=${parseInt(filters.radius) * 1000}`;
  }

  try {
    const request = await fetch(
      `${BASE_PATH_TOURISM_GASTRONOMY_REDUCED}?active=true&odhactive=true&fields=Id,Latitude,Longitude${categorycodefilter}${facilityCodesCreditCard}${facilityCodesFeatures}${facilityCodesQuality}${facilityCodesCuisine}${radius}`
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

export const requestTourismGastronomiesCodes = async (language, type) => {
  try {
    const request = await fetch(`${BASE_PATH_TOURISM_GASTRONOMYTYPES}`);
    if (request.status !== 200) {
      throw new Error(request.statusText);
    }
    const response = await request.json();
    const categories = response
      .filter((o) => o.Type === type)
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

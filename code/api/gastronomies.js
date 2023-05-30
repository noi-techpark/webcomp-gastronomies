// SPDX-FileCopyrightText: 2021 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  BASE_PATH_TOURISM_GASTRONOMY,
  BASE_PATH_TOURISM_GASTRONOMYTYPES,
  ORIGIN
} from "./config";

const createUrlFilters = (filters, currentLocation) => {
  let categorycodefilter = "";
  if (filters.categories.length) {
    const bitmaskSum = filters.categories.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    categorycodefilter = `&categorycodefilter=${bitmaskSum}`;
  }

  let facilityCodesCreditCard = "";
  if (filters.facilityCodesCreditCard.length) {
    const bitmaskSum = filters.facilityCodesCreditCard.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    facilityCodesCreditCard = `&facilitycodefilter=${bitmaskSum}`;
  }

  let facilityCodesFeatures = "";
  if (filters.facilityCodesFeatures.length) {
    const bitmaskSum = filters.facilityCodesFeatures.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    facilityCodesFeatures = `&facilitycodefilter=${bitmaskSum}`;
  }

  let facilityCodesQuality = "";
  if (filters.facilityCodesQuality.length) {
    const bitmaskSum = filters.facilityCodesQuality.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    facilityCodesQuality = `&facilitycodefilter=${bitmaskSum}`;
  }

  let facilityCodesCuisine = "";
  if (filters.facilityCodesCuisine.length) {
    const bitmaskSum = filters.facilityCodesCuisine.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    facilityCodesCuisine = `&cuisinecodefilter=${bitmaskSum}`;
  }

  let facilityCodesCeremony = "";
  if (filters.facilityCodesCeremony.length) {
    const bitmaskSum = filters.facilityCodesCeremony.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    facilityCodesCeremony = `&ceremonycodefilter=${bitmaskSum}`;
  }

  let radius = "";
  if (filters.radius && filters.radius !== "0") {
    radius = `&latitude=${currentLocation.lat}&longitude=${currentLocation.lng
      }&radius=${parseInt(filters.radius) * 1000}`;
  }

  return `${categorycodefilter}${facilityCodesFeatures}${facilityCodesCreditCard}${facilityCodesQuality}${facilityCodesCuisine}${facilityCodesCeremony}${radius}`;
};

export const requestTourismGastronomies = async (filters, currentLocation) => {
  try {
    const request = await fetch(
      `${BASE_PATH_TOURISM_GASTRONOMY}?` + ORIGIN + `&active=true&odhactive=true&pagesize=-1&fields=Id,Latitude,Longitude${createUrlFilters(
        filters,
        currentLocation
      )}`
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

export const requestTourismGastronomiesPaginated = async (
  filters,
  currentLocation,
  pageNumber,
  pageSize,
  language
) => {
  try {
    const request = await fetch(
      `${BASE_PATH_TOURISM_GASTRONOMY}?` + ORIGIN + `&active=true&odhactive=true&language=${language}&fields=Id,Detail,CategoryCodes,LocationInfo&pagenumber=${pageNumber}&pagesize=${pageSize}${createUrlFilters(
        filters,
        currentLocation
      )}`
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

export const requestTourismGastronomiesCodes = async () => {
  try {
    const request = await fetch(`${BASE_PATH_TOURISM_GASTRONOMYTYPES}?` + ORIGIN);
    if (request.status !== 200) {
      throw new Error(request.statusText);
    }
    const response = await request.json();
    const categories = response;
    return categories;
  } catch (error) {
    console.log(error);
  }
};

export const requestTourismGastronomyDetails = async ({ Id }) => {
  try {
    const request = await fetch(`${BASE_PATH_TOURISM_GASTRONOMY}/${Id}?` + ORIGIN);
    if (request.status !== 200) {
      throw new Error(request.statusText);
    }
    const response = await request.json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

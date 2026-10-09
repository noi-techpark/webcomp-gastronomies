// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  BASE_PATH_TOURISM_GASTRONOMY,
  BASE_PATH_TOURISM_GASTRONOMYTYPES,
  GEO_BASE_URL,
  GEO_TAGFILTER,
  GEO_TILE_TYPE,
  ORIGIN,
  TOURISM_TAGFILTER,
} from "./config";

const originParam = `origin=${ORIGIN}`;

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

const sourceQuery = (source) => (source ? `&source=${source}` : "");

/**
 * Vector tile URL template of the Geo Api. Clustering is done server side.
 * Used by MapLibre for the map modality — replaces the slow full REST list load.
 */
export function gastronomyTilesUrl(source) {
  const params = new URLSearchParams({
    operationmode: "points",
    enableclustering: "true",
    tagfilter: GEO_TAGFILTER,
  });
  if (source) {
    params.set("source", source);
  }
  return `${GEO_BASE_URL}/api/tiles/${GEO_TILE_TYPE}/{z}/{x}/{y}.pbf?${params}`;
}

/**
 * The Geo Api serves the open data copy of a record, suffixed with "_REDUCED".
 * The Content Api expects the plain Id.
 */
export function toContentApiId(tileFeatureId) {
  return String(tileFeatureId).replace(/_REDUCED$/i, "");
}

export const requestTourismGastronomiesPaginated = async (
  filters,
  currentLocation,
  pageNumber,
  pageSize,
  language,
  source
) => {
  try {
    const request = await fetch(
      `${BASE_PATH_TOURISM_GASTRONOMY}?tagfilter=${TOURISM_TAGFILTER}${sourceQuery(
        source
      )}&${originParam}&active=true&odhactive=true&language=${language}&rawfilter=isnotnull(GpsInfo)&fields=Id,Detail,CategoryCodes,LocationInfo&pagenumber=${pageNumber}&pagesize=${pageSize}${createUrlFilters(
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
    const request = await fetch(
      `${BASE_PATH_TOURISM_GASTRONOMYTYPES}?pagesize=0&fields=Id,Types,TagName&validforentity=gastronomy&${originParam}`
    );
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
    const request = await fetch(
      `${BASE_PATH_TOURISM_GASTRONOMY}/${encodeURIComponent(
        toContentApiId(Id)
      )}?${originParam}&removenullvalues=true`
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

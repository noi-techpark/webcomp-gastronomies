// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  BASE_PATH_TOURISM_GASTRONOMY,
  ORIGIN,
  TOURISM_TAGFILTER,
} from "./config";

/**
 * Place search used by the search bar.
 *
 * Uses ODHActivityPoi `searchfilter`, which matches the query against
 * Detail texts (e.g. Title) of active gastronomy POIs. Results are used to
 * fly the map to a matching gastronomy — not to load the map markers
 * (those come from Geo Api vector tiles).
 *
 * The deprecated Tourism `/api/Poi` endpoint is no longer called.
 */
export async function requestGetCoordinatesFromSearch(query) {
  const r = 150 * 1000;
  try {
    if (query) {
      let formattedTourismGastronomyData = [];
      const sourceParam = this.source ? `&source=${this.source}` : "";
      const tourismGastronomyRequest = await fetch(
        `${BASE_PATH_TOURISM_GASTRONOMY}?tagfilter=${TOURISM_TAGFILTER}${sourceParam}&origin=${ORIGIN}&active=true&odhactive=true&pagesize=50&fields=Detail,GpsInfo&searchfilter=${encodeURIComponent(
          query
        )}&rawfilter=isnotnull(GpsInfo)`
      );
      const tourismGastronomyResponse = await tourismGastronomyRequest.json();

      if (tourismGastronomyResponse.Items) {
        formattedTourismGastronomyData = tourismGastronomyResponse.Items.map(
          (o) => {
            let title = "";
            const detail =
              (o.Detail && o.Detail[this.language]) ||
              (o.Detail && (o.Detail.it || o.Detail.de || o.Detail.en)) ||
              {};
            if (detail.Title) {
              title = detail.Title;
            }
            if (!o.GpsInfo || !o.GpsInfo[0]) {
              return null;
            }
            return {
              position: [o.GpsInfo[0].Latitude, o.GpsInfo[0].Longitude],
              title: title,
            };
          }
        ).filter(Boolean);
      }

      let formattedHereData = [];
      const hereKey =
        (typeof process !== "undefined" &&
          process.env &&
          process.env.DOTENV &&
          process.env.DOTENV.HEREMAPS_API_KEY) ||
        "";
      if (!formattedTourismGastronomyData.length && hereKey) {
        const hereResponse = await fetch(
          `https://places.ls.hereapi.com/places/v1/browse?apiKey=${hereKey}&in=46.31,11.26;r=${r}&q=${encodeURIComponent(
            query
          )}`,
          {
            method: "GET",
            headers: new Headers({
              Accept: "application/json",
            }),
          }
        );
        const hereData = await hereResponse.json();
        formattedHereData = (hereData.results && hereData.results.items
          ? hereData.results.items
          : []
        ).map((item) => {
          return {
            position: item.position,
            title: item.title,
          };
        });
      }

      this.searchPlacesFound = {
        "Open Data Hub": [...formattedTourismGastronomyData],
        "Other results": [...formattedHereData],
      };
    }
  } catch (error) {
    console.error(error);
    this.searchPlacesFound = {};
  }
}

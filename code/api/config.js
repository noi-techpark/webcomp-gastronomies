// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export const ORIGIN = "webcomp-gastronomies";

export const BASE_PATH_TOURISM =
  (typeof process !== "undefined" &&
    process.env &&
    (process.env.TOURISM_BASE_PATH ||
      (process.env.DOTENV && process.env.DOTENV.TOURISM_BASE_PATH))) ||
  "https://tourism.api.opendatahub.com/v1";

export const GEO_BASE_URL =
  (typeof process !== "undefined" &&
    process.env &&
    (process.env.GEO_BASE_PATH ||
      (process.env.DOTENV && process.env.DOTENV.GEO_BASE_PATH))) ||
  "https://geo.api.opendatahub.com";

export const BASEMAP_STYLE_URL =
  (typeof process !== "undefined" &&
    process.env &&
    (process.env.BASEMAP_STYLE_URL ||
      (process.env.DOTENV && process.env.DOTENV.BASEMAP_STYLE_URL))) ||
  "https://tiles.openfreemap.org/styles/positron";

export const BASE_PATH_TOURISM_GASTRONOMY = `${BASE_PATH_TOURISM}/ODHActivityPoi`;
export const BASE_PATH_TOURISM_GASTRONOMYTYPES = `${BASE_PATH_TOURISM}/Tag`;

/** Geo Api vector tile type / source-layer for gastronomy POIs */
export const GEO_TILE_TYPE = "odhactivitypoi";

/** Official Geo example tag for gastronomies */
export const GEO_TAGFILTER = "eating drinking";

/** Tourism Content Api tag used for list / search / filters */
export const TOURISM_TAGFILTER = "gastronomy";

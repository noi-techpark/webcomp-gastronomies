// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export const observedProperties = {
  height: { type: String },
  width: { type: String },
  fontFamily: { type: String },
  language: { type: String },
  tiles_url: { type: String, attribute: "tiles-url" },
  modality: { type: String },
  disableGastronomyDirections: { type: Boolean },
  categoriesFilter: { type: Array },
  currentLocation: { type: Object },

  mobileOpen: { type: Boolean },
  isMobile: { type: Boolean },

  isLoading: { type: Boolean },

  hereMapsQuery: { type: String },
  searchPlacesFound: { type: Array },
  mapAttribution: { type: String },

  pageSize: { type: Number },
  listGastronomies: { type: Array },
  listGastronomiesCurrentPage: { type: Number },

  currentGastronomy: { type: Object },

  detailsOpen: { type: Boolean },
  filtersOpen: { type: Boolean },

  // Filters
  filters: { type: Object },
  filterRadius: { type: String },
  categories: { type: Array },
  facilityCodesCreditCard: { type: Array },
  facilityCodesFeatures: { type: Array },
  facilityCodesQuality: { type: Array },
  facilityCodesCuisine: { type: Array },
  facilityCodesCeremony: { type: Array },

  filtersAccordionOpen: { type: Object },
};

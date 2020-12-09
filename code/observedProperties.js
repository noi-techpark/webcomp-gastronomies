export const observedProperties = {
  height: { type: String },
  width: { type: String },
  fontFamily: { type: String },
  language: { type: String },
  tiles_url: { type: String, attribute: "tiles-url" },

  isLoading: { type: Boolean },

  hereMapsQuery: { type: String },
  hereMapsPlacesFound: { type: Array },
  mapAttribution: { type: String },

  currentGastronomy: { type: Object },

  detailsOpen: { type: Boolean },
  filtersOpen: { type: Boolean },

  // Filters
  filters: { type: Object },
  categories: { type: Array },
  filtersAccordionOpen: { type: Object },
};

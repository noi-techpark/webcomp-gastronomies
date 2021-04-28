import { LitElement } from "lit-element";
import {
  get_system_language,
  isMobile,
  STATE_DEFAULT_FILTERS,
  STATE_DEFAULT_FILTERS_ACCORDIONS_OPEN,
  STATE_MODALITIES,
} from "./utils";

export class BaseGastronomies extends LitElement {
  constructor() {
    super();
    this.height = "500px";
    this.width = "100%";
    this.fontFamily = "";
    this.mapAttribution = "";
    this.language = get_system_language();
    this.modality = STATE_MODALITIES.map;
    this.disableGastronomyDirections = false;
    this.categoriesFilter = [];

    this.isLoading = true;
    this.mobileOpen = false;
    this.isMobile = isMobile();

    this.map = undefined;
    this.currentLocation = { lat: 46.479, lng: 11.331 };

    this.searchPlacesFound = {};
    this.hereMapsQuery = "";

    this.currentGastronomy = {};

    this.pageSize = 10;
    this.listGastronomies = [];
    this.listGastronomiesCurrentPage = 1;

    this.detailsOpen = false;
    this.filtersOpen = false;

    this.filters = STATE_DEFAULT_FILTERS;
    this.filtersAccordionOpen = STATE_DEFAULT_FILTERS_ACCORDIONS_OPEN;
  }
}

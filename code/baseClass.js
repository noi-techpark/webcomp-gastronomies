import { LitElement } from "lit-element";
import {
  isMobile,
  LANGUAGES,
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
    this.language = LANGUAGES.EN;
    this.modality = STATE_MODALITIES.map;

    this.isLoading = true;
    this.mobileOpen = false;
    this.isMobile = isMobile();

    this.map = undefined;
    this.currentLocation = { lat: 46.479, lng: 11.331 };

    this.hereMapsPlacesFound = [];
    this.hereMapsQuery = "";

    this.currentGastronomy = {};

    this.listGastronomies = [];
    this.listGastronomiesCurrentPage = 1;

    this.detailsOpen = false;
    this.filtersOpen = false;

    this.filters = STATE_DEFAULT_FILTERS;
    this.filtersAccordionOpen = STATE_DEFAULT_FILTERS_ACCORDIONS_OPEN;
  }
}

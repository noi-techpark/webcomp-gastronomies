import "@babel/polyfill";
import leafletStyle from "leaflet/dist/leaflet.css";
import { css, html, LitElement, unsafeCSS } from "lit-element";
import { requestTourismGastronomiesPaginated } from "./api/gastronomies";
import { requestGetCoordinatesFromSearch } from "./api/hereMaps";
import { render_details } from "./components/details";
import { render_filters } from "./components/filters";
import { render__list } from "./components/list";
import { render__listControls } from "./components/listControls";
import { render__mapControls } from "./components/mapControls";
import { render_searchPlaces } from "./components/searchPlaces";
import { getFilters } from "./mainClassMethods/filters";
import {
  drawGastronomiesOnMap,
  drawUserOnMap,
  initializeMap,
} from "./mainClassMethods/map";
import { observedProperties } from "./observedProperties";
import "./shared_components/button/button";
import "./shared_components/checkBox/checkBox";
import "./shared_components/divider/divider";
import "./shared_components/dropdown/dropdown";
import "./shared_components/languagePicker/languagePicker";
// Shared components
import "./shared_components/searchBar/searchBar";
import "./shared_components/sideModalHeader/sideModalHeader";
import "./shared_components/sideModalRow/sideModalRow";
import "./shared_components/sideModalTabs/sideModalTabs";
import "./shared_components/tag/tag";
import {
  debounce,
  isMobile,
  LANGUAGES,
  STATE_DEFAULT_FILTERS,
  STATE_DEFAULT_FILTERS_ACCORDIONS_OPEN,
  STATE_MODALITIES,
} from "./utils";
import ParkingStyle from "./webcomp-gastronomies.scss";

class Gastronomies extends LitElement {
  constructor() {
    super();
    this.height = "500px";
    this.width = "100%";
    this.fontFamily = "";
    this.mapAttribution = "";
    this.language = LANGUAGES.EN;
    this.modality = STATE_MODALITIES.map;

    this.isLoading = true;

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

  static get properties() {
    return observedProperties;
  }

  static get styles() {
    return css`
      /* Map */
      ${unsafeCSS(leafletStyle)}
      ${unsafeCSS(ParkingStyle)}
    `;
  }

  async drawMap() {
    drawUserOnMap.bind(this)();
  }

  async firstUpdated() {
    await getFilters.bind(this)();

    if (this.modality === STATE_MODALITIES.list) {
      this.listGastronomies = await requestTourismGastronomiesPaginated(
        this.filters,
        this.currentLocation,
        this.listGastronomiesCurrentPage,
        this.language
      );
    }

    if (this.modality === STATE_MODALITIES.map) {
      initializeMap.bind(this)();
      drawUserOnMap.bind(this)();
      await drawGastronomiesOnMap.bind(this)();
    }

    this.isLoading = false;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "filters" && this.modality === STATE_MODALITIES.list) {
        requestTourismGastronomiesPaginated(
          this.filters,
          this.currentLocation,
          this.listGastronomiesCurrentPage,
          this.language
        ).then((gastronomies) => {
          this.listGastronomies = gastronomies;
        });
      }
      if (propName === "filters" || propName === "language") {
        if (this.map) {
          this.map.off();
          this.map.remove();
          this.isLoading = true;
          initializeMap
            .bind(this)()
            .then(() => {
              drawUserOnMap.bind(this)();
              drawGastronomiesOnMap
                .bind(this)()
                .then(() => {
                  this.isLoading = false;
                });
            });
        }
      }
      if (propName === "modality" && oldValue === STATE_MODALITIES.list) {
        console.log(propName, oldValue);

        this.isLoading = true;
        initializeMap.bind(this)();
        drawUserOnMap.bind(this)();
        drawGastronomiesOnMap
          .bind(this)()
          .then(() => {
            this.isLoading = false;
          });
      }
    });
  }

  handleSearchBarFilterAction = () => {
    this.detailsOpen = false;
    this.filtersOpen = !this.filtersOpen;
  };

  debounced__request__get_coordinates_from_search = debounce(
    500,
    requestGetCoordinatesFromSearch.bind(this)
  );

  render() {
    console.log(this.listGastronomies);

    return html`
      <style>
        * {
          --width: ${this.width};
          --height: ${this.height};
          --w-c-font-family: ${this.fontFamily};
        }
      </style>
      ${this.tiles_url
        ? ""
        : html`
            <p style="color:red">Required attribute \`tiles_url\` is missing</p>
          `}

      <div
        class="gastronomies ${
          /*this.mobile_open ? `MODE__mobile__open` : `MODE__mobile__closed`*/ ""
        }
          ${isMobile() ? `mobile` : ``}"
      >
        ${this.isLoading ? html`<div class="globalOverlay"></div>` : ""}

        <div class="gastronomies__language_picker ">
          <wc-languagepicker
            .supportedLanguages="${LANGUAGES}"
            .language="${this.language}"
            .changeLanguageAction="${(language) => {
              this.language = language;
            }}"
          ></wc-languagepicker>
        </div>
        ${/*this.isFullScreen ? this.render_closeFullscreenButton() : null*/ ""}

        <div class="gastronomies__sideBar">
          <div class="gastronomies__sideBar__searchBar mt-4px">
            ${render_searchPlaces.bind(this)()}
          </div>

          ${this.detailsOpen
            ? html`<div class="gastronomies__sideBar__details mt-4px">
                ${render_details.bind(this)()}
              </div>`
            : ""}
          ${this.filtersOpen
            ? html`<div class="gastronomies__sideBar__filters mt-4px">
                ${render_filters.bind(this)()}
              </div>`
            : ""}
        </div>
        ${this.modality === STATE_MODALITIES.map
          ? html`<div id="${STATE_MODALITIES.map}"></div>
              ${render__mapControls.bind(this)()}`
          : null}
        ${this.modality === STATE_MODALITIES.list
          ? html`<div id="${STATE_MODALITIES.list}">
              ${render__list.bind(this)()} ${render__listControls.bind(this)()}
            </div> `
          : null}
      </div>
    `;
  }
}

customElements.get("webcomp-gastronomies") ||
  customElements.define("webcomp-gastronomies", Gastronomies);

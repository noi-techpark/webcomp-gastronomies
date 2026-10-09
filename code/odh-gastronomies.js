// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import "@babel/polyfill";
import maplibreStyle from "maplibre-gl/dist/maplibre-gl.css";
import { css, html, unsafeCSS } from "lit-element";
import { classMap } from "lit-html/directives/class-map";
import { debounce as _debounce } from "lodash";
import { requestTourismGastronomiesPaginated } from "./api/gastronomies";
import { requestGetCoordinatesFromSearch } from "./api/poi";
import { BaseGastronomies } from "./baseClass";
import { render_details } from "./components/details";
import { render_filters } from "./components/filters";
import { render__list } from "./components/list";
import { render__listControls } from "./components/listControls";
import { render__mapControls } from "./components/mapControls";
import { render_searchPlaces } from "./components/searchPlaces";
import { getFilters } from "./mainClassMethods/filters";
import {
  drawUserOnMap,
  initializeMap,
  updateGastronomyTiles,
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
import { isMobile, LANGUAGES, STATE_MODALITIES } from "./utils";
import GastronomiesStyle from "./odh-gastronomies.scss";

class Gastronomies extends BaseGastronomies {
  static get properties() {
    return observedProperties;
  }

  static get styles() {
    return css`
      /* MapLibre */
      ${unsafeCSS(maplibreStyle)}
      ${unsafeCSS(GastronomiesStyle)}
    `;
  }

  handleWindowResize() {
    if (isMobile() !== this.isMobile) {
      if (!this.isMobile) {
        this.mobileOpen = false;
      }
      this.isMobile = isMobile();
    }
    if (this.map) {
      requestAnimationFrame(() => this.map.resize());
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      "resize",
      _debounce(this.handleWindowResize.bind(this), 150)
    );
    if (this.filterRadius && parseFloat(this.filterRadius)) {
      this.filters = {
        ...this.filters,
        radius: this.filterRadius,
      };
    }
    if (this.categoriesFilter && this.categoriesFilter.length) {
      this.filters = {
        ...this.filters,
        categories: this.categoriesFilter,
      };
    }
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.handleWindowResize.bind(this));
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
    super.disconnectedCallback();
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
        this.pageSize,
        this.language,
        this.source
      );
    }

    if (this.modality === STATE_MODALITIES.map) {
      await initializeMap.bind(this)();
    }

    this.isLoading = false;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "mobileOpen" || propName === "isMobile") {
        if (this.map) {
          requestAnimationFrame(() => this.map.resize());
        }
      }
      if (
        (propName === "filters" ||
          propName === "listGastronomiesCurrentPage" ||
          propName === "language" ||
          propName === "modality" ||
          propName === "source") &&
        this.modality === STATE_MODALITIES.list
      ) {
        requestTourismGastronomiesPaginated(
          this.filters,
          this.currentLocation,
          this.listGastronomiesCurrentPage,
          this.pageSize,
          this.language,
          this.source
        ).then((gastronomies) => {
          this.listGastronomies = gastronomies;
        });
      }
      if (
        propName === "source" &&
        this.modality === STATE_MODALITIES.map &&
        this.map
      ) {
        updateGastronomyTiles.bind(this)();
      }
      if (
        propName === "filters" &&
        this.modality === STATE_MODALITIES.map &&
        this.map
      ) {
        // Radius is drawn client-side; category bitmasks are Tourism-only
        // and apply to the list modality / REST list endpoint.
        drawUserOnMap.bind(this)();
      }
      if (propName === "modality" && this.modality === STATE_MODALITIES.map) {
        if (!this.map) {
          this.isLoading = true;
          initializeMap
            .bind(this)()
            .then(() => {
              this.isLoading = false;
            });
        } else {
          requestAnimationFrame(() => this.map.resize());
        }
      }
      if (propName === "modality" && this.modality === STATE_MODALITIES.list) {
        if (this.map) {
          this.map.remove();
          this.map = undefined;
          this.userMarker = undefined;
        }
      }
    });
  }

  handleSearchBarFilterAction = () => {
    this.detailsOpen = false;
    this.filtersOpen = !this.filtersOpen;
  };

  debounced__request__get_coordinates_from_search = _debounce(
    requestGetCoordinatesFromSearch.bind(this),
    500
  );

  render() {
    let isSmallWidth = false;
    let isSmallHeight = false;
    if (this.width.includes("px")) {
      isSmallWidth = parseInt(this.width.replace("px")) <= 400;
    } else if (this.width.includes("%")) {
      if (this.shadowRoot.querySelector(".gastronomies")) {
        isSmallWidth =
          this.shadowRoot.querySelector(".gastronomies").clientWidth <= 400;
      }
    }

    let height = `${this.height}`;

    if (this.height.includes("px")) {
      isSmallHeight = parseInt(this.height.replace("px")) <= 400;
    } else if (this.height.includes("%")) {
      if (this.shadowRoot.querySelector(".gastronomies")) {
        height = `${
          this.shadowRoot.querySelector(".gastronomies").clientHeight
        }px`;
        isSmallHeight =
          this.shadowRoot.querySelector(".gastronomies").clientHeight <= 400;
      }
    }

    return html`
      <style>
        :host {
          --width: ${this.width};
          --height: ${height};
          --w-c-font-family: ${this.fontFamily};
        }
      </style>

      <div
        class=${classMap({
          gastronomies: true,
          mobile: this.isMobile,
          MODE__mobile__open: this.isMobile && this.mobileOpen,
          MODE__mobile__closed: this.isMobile && !this.mobileOpen,
          isSmallWidth: isSmallWidth,
          isSmallHeight: isSmallHeight,
        })}
      >
        ${this.isLoading ? html`<div class="globalOverlay"></div>` : ""}
        ${(isMobile() &&
          !this.detailsOpen &&
          !this.filtersOpen &&
          this.mobileOpen) ||
        !isMobile()
          ? html`<div class="gastronomies__language_picker">
              <wc-languagepicker
                .supportedLanguages="${LANGUAGES}"
                .language="${this.language}"
                .changeLanguageAction="${(language) => {
                  this.language = language;
                }}"
              ></wc-languagepicker>
            </div>`
          : null}
        ${(this.isMobile && this.mobileOpen) || !this.isMobile
          ? html`<div class="gastronomies__sideBar">
              <div class="gastronomies__sideBar__searchBar">
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
            </div>`
          : null}
        <!-- Map -->
        ${this.modality === STATE_MODALITIES.map
          ? html`<div id="${STATE_MODALITIES.map}"></div>
              ${(this.isMobile && this.mobileOpen) || !this.isMobile
                ? html`${render__mapControls.bind(this)()}`
                : null}`
          : null}
        <!-- List -->
        ${this.modality === STATE_MODALITIES.list
          ? html`<div id="${STATE_MODALITIES.list}">
              ${render__list.bind(this)()}
              ${(this.isMobile && this.mobileOpen) || !this.isMobile
                ? html`${render__listControls.bind(this)()}`
                : null}
            </div> `
          : null}
      </div>
    `;
  }
}

customElements.get("odh-gastronomies") ||
  customElements.define("odh-gastronomies", Gastronomies);

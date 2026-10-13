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

  syncLayoutFromHostSize() {
    const { width, height } = this.getHostSize();
    const nextIsMobile = isMobile(this);
    const nextSmallWidth = width > 0 && width <= 480;
    const nextSmallHeight = height > 0 && height <= 420;
    const sizeChanged =
      width !== this._lastHostWidth || height !== this._lastHostHeight;
    const layoutChanged =
      nextIsMobile !== this.isMobile ||
      nextSmallWidth !== this._lastSmallWidth ||
      nextSmallHeight !== this._lastSmallHeight;

    this._lastHostWidth = width;
    this._lastHostHeight = height;
    this._lastSmallWidth = nextSmallWidth;
    this._lastSmallHeight = nextSmallHeight;

    if (nextIsMobile !== this.isMobile) {
      if (!nextIsMobile) {
        this.mobileOpen = true;
      }
      this.isMobile = nextIsMobile;
    }

    if (layoutChanged) {
      this.requestUpdate();
    }
    if (sizeChanged && this.map) {
      requestAnimationFrame(() => this.map.resize());
    }
  }

  handleWindowResize() {
    this.syncLayoutFromHostSize();
  }

  connectedCallback() {
    super.connectedCallback();
    this._debouncedSyncLayout = _debounce(
      this.syncLayoutFromHostSize.bind(this),
      150
    );
    window.addEventListener("resize", this._debouncedSyncLayout);
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
    window.removeEventListener("resize", this._debouncedSyncLayout);
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = undefined;
    }
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
    this.isMobile = isMobile(this);
    if (typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver(this._debouncedSyncLayout);
      this._resizeObserver.observe(this);
    }

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

  getHostSize() {
    const root = this.shadowRoot && this.shadowRoot.querySelector(".gastronomies");
    return {
      width: (root && root.clientWidth) || this.clientWidth || 0,
      height: (root && root.clientHeight) || this.clientHeight || 0,
    };
  }

  render() {
    const { width: hostWidth, height: hostHeight } = this.getHostSize();
    const isSmallWidth = hostWidth > 0 && hostWidth <= 480;
    const isSmallHeight = hostHeight > 0 && hostHeight <= 420;
    // Prefer measured px height so nested max-height calcs stay valid
    const heightCss =
      hostHeight > 0
        ? `${hostHeight}px`
        : this.height && this.height.includes("px")
        ? this.height
        : "100%";

    const showChrome = (this.isMobile && this.mobileOpen) || !this.isMobile;
    const showLanguagePicker =
      showChrome &&
      (!this.isMobile || (!this.detailsOpen && !this.filtersOpen));

    return html`
      <style>
        :host {
          --width: ${this.width};
          --height: ${heightCss};
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
        ${showLanguagePicker
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
        ${showChrome
          ? html`<div class="gastronomies__sideBar">
              <div class="gastronomies__sideBar__searchBar">
                ${render_searchPlaces.bind(this)()}
              </div>

              ${this.detailsOpen && this.currentGastronomy && this.currentGastronomy.Id
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
              ${showChrome ? html`${render__mapControls.bind(this)()}` : null}`
          : null}
        <!-- List -->
        ${this.modality === STATE_MODALITIES.list
          ? html`<div id="${STATE_MODALITIES.list}">
              ${render__list.bind(this)()}
              ${showChrome ? html`${render__listControls.bind(this)()}` : null}
            </div> `
          : null}
      </div>
    `;
  }
}

customElements.get("odh-gastronomies") ||
  customElements.define("odh-gastronomies", Gastronomies);

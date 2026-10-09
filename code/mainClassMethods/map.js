// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import maplibregl from "maplibre-gl";
import {
  gastronomyTilesUrl,
  requestTourismGastronomyDetails,
} from "../api/gastronomies";
import { BASEMAP_STYLE_URL, GEO_TILE_TYPE } from "../api/config";
import user__marker from "../assets/user.svg";

export const SOURCE_ID = "gastronomies";
export const SOURCE_LAYER = GEO_TILE_TYPE;
const LAYER_CLUSTERS = "gastronomy-clusters";
const LAYER_POINTS = "gastronomy-points";
const USER_SOURCE_ID = "user-location";
const USER_CIRCLE_LAYER = "user-location-circle";

const DEFAULT_MAP_ATTRIBUTION =
  '<a target="_blank" rel="noopener" href="https://opendatahub.com">Open Data Hub</a>';

export async function initializeMap() {
  const container = this.shadowRoot.getElementById("map");
  if (!container) {
    return;
  }

  if (this.map) {
    this.map.remove();
    this.map = undefined;
    this.searchMarker = undefined;
  }

  this.hoveredId = null;
  this.selectedId = null;
  this.detailRequest = 0;

  const attribution =
    this.mapAttribution && this.mapAttribution.trim()
      ? this.mapAttribution
      : DEFAULT_MAP_ATTRIBUTION;

  this.map = new maplibregl.Map({
    container,
    style: BASEMAP_STYLE_URL,
    center: [this.currentLocation.lng, this.currentLocation.lat],
    zoom: 10,
    attributionControl: {
      compact: true,
      customAttribution: attribution,
    },
  });

  await new Promise((resolve) => {
    this.map.on("load", () => {
      addGastronomyLayers.bind(this)();
      bindMapEvents.bind(this)();
      drawUserOnMap.bind(this)();
      resolve();
    });
  });

  // Lit may have laid out the shadow tree after MapLibre measured it
  requestAnimationFrame(() => {
    if (this.map) {
      this.map.resize();
    }
  });
}

function themeColor(name, fallback) {
  const root = this.shadowRoot.querySelector(".gastronomies");
  if (!root) {
    return fallback;
  }
  const value = getComputedStyle(root).getPropertyValue(name).trim();
  return value || fallback;
}

export function addGastronomyLayers() {
  const primary = themeColor.bind(this)("--gastro-primary", "#97be0e");
  const primaryStrong = themeColor.bind(this)(
    "--gastro-primary-strong",
    "#067322"
  );
  const accent = themeColor.bind(this)("--gastro-accent", "#e07a2e");
  const surface = themeColor.bind(this)("--gastro-surface", "#ffffff");
  const count = ["to-number", ["get", "count"], 2];
  const clusterRadius = (extra) => [
    "interpolate",
    ["linear"],
    ["zoom"],
    8,
    [
      "interpolate",
      ["linear"],
      count,
      2,
      8 + extra,
      50,
      12 + extra,
      1000,
      18 + extra,
    ],
    13,
    [
      "interpolate",
      ["linear"],
      count,
      2,
      11 + extra,
      50,
      16 + extra,
      1000,
      24 + extra,
    ],
  ];
  const isActive = [
    "any",
    ["boolean", ["feature-state", "hover"], false],
    ["boolean", ["feature-state", "selected"], false],
  ];

  this.map.addSource(SOURCE_ID, {
    type: "vector",
    tiles: [gastronomyTilesUrl(this.source)],
    minzoom: 0,
    maxzoom: 22,
    promoteId: "id",
  });

  this.map.addLayer({
    id: `${LAYER_CLUSTERS}-halo`,
    type: "circle",
    source: SOURCE_ID,
    "source-layer": SOURCE_LAYER,
    filter: ["==", ["get", "cluster"], true],
    layout: {
      "circle-sort-key": count,
    },
    paint: {
      "circle-color": primary,
      "circle-opacity": 0.18,
      "circle-radius": clusterRadius(5),
    },
  });

  this.map.addLayer({
    id: LAYER_CLUSTERS,
    type: "circle",
    source: SOURCE_ID,
    "source-layer": SOURCE_LAYER,
    filter: ["==", ["get", "cluster"], true],
    layout: {
      "circle-sort-key": count,
    },
    paint: {
      "circle-color": [
        "interpolate",
        ["linear"],
        count,
        2,
        primary,
        500,
        primaryStrong,
      ],
      "circle-radius": clusterRadius(0),
      "circle-stroke-width": 2,
      "circle-stroke-color": surface,
    },
  });

  this.map.addLayer({
    id: `${LAYER_CLUSTERS}-count`,
    type: "symbol",
    source: SOURCE_ID,
    "source-layer": SOURCE_LAYER,
    filter: ["==", ["get", "cluster"], true],
    layout: {
      "text-field": ["to-string", count],
      "text-font": ["Noto Sans Bold"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 8, 10, 13, 12],
      "symbol-sort-key": count,
      "text-allow-overlap": true,
    },
    paint: {
      "text-color": surface,
    },
  });

  this.map.addLayer({
    id: LAYER_POINTS,
    type: "circle",
    source: SOURCE_ID,
    "source-layer": SOURCE_LAYER,
    filter: ["!=", ["get", "cluster"], true],
    paint: {
      "circle-color": ["case", isActive, accent, primary],
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8,
        ["case", isActive, 8, 5],
        14,
        ["case", isActive, 11, 7],
        18,
        ["case", isActive, 14, 10],
      ],
      "circle-stroke-width": 2,
      "circle-stroke-color": surface,
    },
  });
}

export function updateGastronomyTiles() {
  if (!this.map || !this.map.getSource(SOURCE_ID)) {
    return;
  }
  this.map.getSource(SOURCE_ID).setTiles([gastronomyTilesUrl(this.source)]);
}

function setFeatureState(id, state) {
  if (id != null && this.map) {
    this.map.setFeatureState(
      { source: SOURCE_ID, sourceLayer: SOURCE_LAYER, id: id },
      state
    );
  }
}

export function bindMapEvents() {
  [LAYER_CLUSTERS, LAYER_POINTS].forEach((layer) => {
    this.map.on("mouseenter", layer, () => {
      this.map.getCanvas().style.cursor = "pointer";
    });
    this.map.on("mouseleave", layer, () => {
      this.map.getCanvas().style.cursor = "";
    });
  });

  this.map.on("mousemove", LAYER_POINTS, (e) => {
    const id = e.features[0] && e.features[0].id;
    if (id === this.hoveredId) {
      return;
    }
    setFeatureState.bind(this)(this.hoveredId, { hover: false });
    this.hoveredId = id;
    setFeatureState.bind(this)(id, { hover: true });
  });

  this.map.on("mouseleave", LAYER_POINTS, () => {
    setFeatureState.bind(this)(this.hoveredId, { hover: false });
    this.hoveredId = null;
  });

  this.map.on("click", LAYER_CLUSTERS, (e) => {
    this.map.easeTo({
      center: e.features[0].geometry.coordinates,
      zoom: Math.min(this.map.getZoom() + 2, 17),
    });
  });

  this.map.on("click", async (e) => {
    const feature = this.map.queryRenderedFeatures(e.point, {
      layers: [LAYER_POINTS],
    })[0];
    if (feature) {
      await openDetailFromFeature.bind(this)(feature);
    } else if (
      !this.map.queryRenderedFeatures(e.point, { layers: [LAYER_CLUSTERS] })
        .length
    ) {
      // click on empty map — leave detail open state to the sidebar close button
    }
  });
}

async function openDetailFromFeature(feature) {
  const request = ++this.detailRequest;

  setFeatureState.bind(this)(this.selectedId, { selected: false });
  this.selectedId = feature.id;
  setFeatureState.bind(this)(this.selectedId, { selected: true });

  this.searchPlacesFound = {};
  this.filtersOpen = false;
  this.isLoading = true;

  try {
    const details = await requestTourismGastronomyDetails({
      Id: feature.id,
    });

    if (request !== this.detailRequest) {
      return;
    }

    if (details) {
      this.currentGastronomy = {
        ...details,
      };
      this.detailsOpen = true;
    }
  } finally {
    if (request === this.detailRequest) {
      this.isLoading = false;
    }
  }
}

export function drawUserOnMap() {
  if (!this.map) {
    return;
  }

  const radiusMeters =
    this.filters && this.filters.radius && this.filters.radius !== "0"
      ? parseInt(this.filters.radius, 10) * 1000
      : 0;

  const center = [this.currentLocation.lng, this.currentLocation.lat];
  const circleGeoJson = {
    type: "FeatureCollection",
    features:
      radiusMeters > 0
        ? [
            {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [createGeoJsonCircle(center, radiusMeters)],
              },
            },
          ]
        : [],
  };

  if (this.map.getSource(USER_SOURCE_ID)) {
    this.map.getSource(USER_SOURCE_ID).setData(circleGeoJson);
  } else {
    this.map.addSource(USER_SOURCE_ID, {
      type: "geojson",
      data: circleGeoJson,
    });
    this.map.addLayer({
      id: USER_CIRCLE_LAYER,
      type: "fill",
      source: USER_SOURCE_ID,
      paint: {
        "fill-color": "rgba(66, 133, 244, 0.5)",
        "fill-outline-color": "rgba(66, 133, 244, 0.6)",
      },
    });
  }

  if (this.userMarker) {
    this.userMarker.setLngLat(center);
  } else {
    const el = document.createElement("div");
    el.style.width = "25px";
    el.style.height = "25px";
    el.style.backgroundImage = `url(${user__marker})`;
    el.style.backgroundSize = "contain";
    el.style.backgroundRepeat = "no-repeat";
    this.userMarker = new maplibregl.Marker({ element: el })
      .setLngLat(center)
      .addTo(this.map);
  }
}

/** Approximate circle as polygon (radius in meters). */
function createGeoJsonCircle(centerLngLat, radiusMeters, points = 64) {
  const [lng, lat] = centerLngLat;
  const coords = [];
  const earthRadius = 6371000;
  const latRad = (lat * Math.PI) / 180;

  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dx = (radiusMeters / earthRadius) * Math.cos(angle);
    const dy = (radiusMeters / earthRadius) * Math.sin(angle);
    const pointLat = lat + (dy * 180) / Math.PI;
    const pointLng =
      lng + ((dx * 180) / Math.PI) / Math.cos(latRad);
    coords.push([pointLng, pointLat]);
  }
  return coords;
}

/** Fly the map to a place and refresh the user marker / radius. */
export function flyToLocation(lat, lng, zoom = 15) {
  if (!this.map) {
    return;
  }
  this.map.flyTo({
    center: [parseFloat(lng), parseFloat(lat)],
    zoom,
  });
  drawUserOnMap.bind(this)();
}

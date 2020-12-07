import Leaflet from "leaflet";
import leaflet_mrkcls from "leaflet.markercluster";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import user__marker from "../assets/user.svg";
import {
  requestTourismGastronomies,
  requestTourismGastronomyDetails,
} from "../api/gastronomies";
import { getLatLongFromStationDetail, get_system_language } from "../utils";
import stationIcon from "../assets/station.svg";

export async function initializeMap() {
  const DefaultIcon = Leaflet.icon({
    iconUrl: icon,
    iconAnchor: [12.5, 41],
    shadowUrl: iconShadow,
  });
  Leaflet.Marker.prototype.options.icon = DefaultIcon;

  this.map = Leaflet.map(this.shadowRoot.getElementById("map"), {
    zoomControl: false,
  });

  const tileUrl = `${this.tiles_url}${process.env.TILES_API_KEY || ""}`;

  Leaflet.tileLayer(tileUrl, {
    attribution: this.mapAttribution,
  }).addTo(this.map);

  this.map.setView(
    { lat: this.currentLocation.lat, lon: this.currentLocation.lng },
    10
  );
}

export function drawUserOnMap() {
  /**
   * User Icon
   */
  const user_icon = Leaflet.icon({
    iconUrl: user__marker,
    iconSize: [25, 25],
  });
  const user = Leaflet.marker(
    [this.currentLocation.lat, this.currentLocation.lng],
    {
      icon: user_icon,
    }
  );
  /**
   * Circle around the user
   */
  const circle = Leaflet.circle(
    [this.currentLocation.lat, this.currentLocation.lng],
    {
      radius: this.filters.radius * 1000,
      color: "rgba(66, 133, 244, 0.6)",
      fillColor: "rgba(66, 133, 244, 0.5)",
      weight: 1,
    }
  );
  /**
   * Add to map
   */
  this.layer_user = Leaflet.layerGroup([user, circle], {});
  this.layer_user.addTo(this.map);
}

export async function drawGastronomiesOnMap() {
  const stations_layer_array = [];

  const gastronomies = await requestTourismGastronomies();
  console.log(gastronomies.Items);

  gastronomies.Items.filter((station) => {
    // Use filters on all retrived stations
    let valid = true;
    // if (this.filters.availability) {
    // if (
    //   station.sdatatypes.occupied &&
    //   station.sdatatypes.occupied.tmeasurements[0].mvalue >=
    //     station.smetadata.capacity
    // ) {
    //   valid = false;
    // }
    // }
    return valid;
  }).map((gastronomy) => {
    const marker_position = getLatLongFromStationDetail({
      x: gastronomy.Longitude,
      y: gastronomy.Latitude,
    });
    const station_icon = Leaflet.icon({
      iconUrl: stationIcon,
      iconSize: [36, 36],
    });
    const marker = Leaflet.marker([marker_position.lat, marker_position.lng], {
      icon: station_icon,
    });

    const action = async () => {
      const details = await requestTourismGastronomyDetails({
        Id: gastronomy.Id,
      });
      if (details) {
        console.log(details);

        this.currentGastronomy = {
          ...details,
        };
      }

      this.filtersOpen = false;
      this.detailsOpen = true;
    };

    marker.on("mousedown", action);
    stations_layer_array.push(marker);
  });

  if (!this.language) {
    this.language = get_system_language();
  }

  const stations_layer = Leaflet.layerGroup(stations_layer_array, {});

  this.layer_stations = new leaflet_mrkcls.MarkerClusterGroup({
    showCoverageOnHover: false,
    chunkedLoading: true,
    iconCreateFunction(cluster) {
      return Leaflet.divIcon({
        html: `<div class="marker_cluster__marker">${cluster.getChildCount()}</div>`,
        iconSize: Leaflet.point(36, 36),
      });
    },
  });
  /** Add maker layer in the cluster group */
  this.layer_stations.addLayer(stations_layer);
  /** Add the cluster group to the map */
  this.map.addLayer(this.layer_stations);
}

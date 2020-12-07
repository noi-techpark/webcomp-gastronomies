import { html } from "lit-html";
import expandImage from "../assets/expand.svg";
import findPositionImage from "../assets/find-position.svg";
import minusImage from "../assets/minus.svg";
import plusImage from "../assets/plus.svg";
import { drawUserOnMap } from "../mainClassMethods/map";
import { getCurrentPosition, isMobile } from "../utils";

export function render__mapControls() {
  const handleBtnZoomIn = () => {
    this.map.setZoom(this.map.getZoom() + 1);
  };

  const handleBtnZoomOut = () => {
    this.map.setZoom(this.map.getZoom() - 1);
  };

  const handleBtnCenterMap = async () => {
    this.isLoading = true;
    try {
      const { coords } = await getCurrentPosition();
      const { latitude, longitude } = coords;
      console.log(latitude, longitude);

      this.currentLocation = { lat: latitude, lng: longitude };
      this.map.flyTo([latitude, longitude], 13);
      // this.map.removeLayer(this.layer_columns);
      this.map.removeLayer(this.layer_user);
      drawUserOnMap.bind(this)();
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
    }
  };

  return html`
    <div class="map_controls">
      ${isMobile()
        ? html`<div class="mt-16px">
            <wc-button
              @click="${() => {}}"
              type="square"
              .image="${expandImage}"
            ></wc-button>
          </div>`
        : ""}
      <wc-button
        @click="${handleBtnCenterMap}"
        type="square"
        .image="${findPositionImage}"
      ></wc-button>
      <div class="mt-16px">
        <wc-button
          @click="${handleBtnZoomIn}"
          type="square"
          .image="${plusImage}"
        ></wc-button>
        <div class="mt-4px">
          <wc-button
            @click="${handleBtnZoomOut}"
            type="square"
            .image="${minusImage}"
          ></wc-button>
        </div>
      </div>
    </div>
  `;
}

/* <div
        @click=${() => {
          this.handleFullScreenMap();
        }}
        class=${`map_controls__button ${
          isMobile() && !this.mobile_open ? "" : `d-none`
        }`}
      >
        <img src=${expandImage} alt="" />
      </div> */

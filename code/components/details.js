import { html } from "lit-element";
import { t } from "../translations";
import dayjs from "dayjs";

export function render_details() {
  console.log(this.currentGastronomy);
  const {
    Detail,
    Latitude,
    Longitude,
    OperationSchedule,
  } = this.currentGastronomy;
  const { Title, BaseText } = Detail[this.language];

  return html` <div class="details">
    <div class="header">
      <wc-sidemodal-header
        .type="title"
        .tTitle="${Title}"
        .tLinkedTagText="${typeof occupiedSpots === "number" &&
        gastronomiesCapacity - occupiedSpots <= 0
          ? t["tag__free"][this.language]
          : ""}"
        .tOptionalLink="${{
          text: t["directions"][this.language],
          url: `http://www.google.com/maps/place/${Latitude},${Longitude}`,
        }}"
        .closeModalAction="${() => {
          this.detailsOpen = false;
        }}"
      ></wc-sidemodal-header>
    </div>
    <div>
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p class="caption">${t["description"][this.language]}</p>
        <p class="">${BaseText}</p>
      </div>
    </div>
    <div>
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p class="caption">${t["description"][this.language]}</p>
        <p>
          ${OperationSchedule.map((o) => {
            return html`
              ${dayjs(o.Start).format("DD/MM/YYYY")} -
              ${dayjs(o.Stop).format("DD/MM/YYYY")} <br />
            `;
          })}
        </p>
      </div>
    </div>
  </div>`;
}

import { html } from "lit-element";
import { requestTourismGastronomyDetails } from "../api/gastronomies";
import { t } from "../translations";

function renderRows(Detail, CategoryCodes, LocationInfo, Id) {
  if (!Detail[this.language]) {
    return null;
  }
  return html`<div class="gastronomies__list_content_row">
    <div>${Detail[this.language].Title}</div>
    <div>
      ${CategoryCodes.map(({ Shortname }) => {
        return html`${Shortname}, `;
      })}
    </div>
    <div>${LocationInfo.TvInfo.Name[this.language]}</div>
    <div>
      <p
        @click="${() => {
          requestTourismGastronomyDetails({ Id: Id }).then((details) => {
            if (details) {
              this.currentGastronomy = {
                ...details,
              };
            }
            this.filtersOpen = false;
            this.detailsOpen = true;
          });
        }}"
        class="link"
      >
        ${t["details"][this.language]}
      </p>
    </div>
  </div>`;
}

export function render__list() {
  if (!this.listGastronomies) {
    console.log("no list");

    return null;
  }
  const { Items, TotalPages, CurrentPage, Id } = this.listGastronomies;
  return html`
    <div class="gastronomies__list">
      <div class="gastronomies__list_content">
        <div><h3>${t[`gastronomies`][this.language]}</h3></div>
        <div class="gastronomies__list_content_row header">
          <div>${t[`shortname`][this.language].toUpperCase()}</div>
          <div>${t[`category`][this.language].toUpperCase()}</div>
          <div>${t[`location`][this.language].toUpperCase()}</div>
          <div>${t[`actions`][this.language].toUpperCase()}</div>
        </div>
        ${Items
          ? Items.map(({ Detail, CategoryCodes, LocationInfo, Id }) => {
              return renderRows.bind(this)(
                Detail,
                CategoryCodes,
                LocationInfo,
                Id
              );
            })
          : null}
      </div>
    </div>
    <div class="gastronomies__list__pagination">
      <wc-button
        type="primary"
        content="${t[`prev`][this.language]}"
        @click="${() => {
          if (CurrentPage > 1) {
            this.listGastronomiesCurrentPage =
              this.listGastronomiesCurrentPage - 1;
          }
        }}"
      ></wc-button>
      <p>${CurrentPage} / ${TotalPages}</p>
      <wc-button
        type="primary"
        content="${t[`next`][this.language]}"
        @click="${() => {
          if (CurrentPage < TotalPages) {
            this.listGastronomiesCurrentPage =
              this.listGastronomiesCurrentPage + 1;
          }
        }}"
      ></wc-button>
    </div>
  `;
}

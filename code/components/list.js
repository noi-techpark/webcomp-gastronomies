import { html } from "lit-element";
import { t } from "../translations";

const renderRows = (Detail, CategoryCodes, LocationInfo, language) => {
  return html`<div class="gastronomies__list_content_row">
    <div>${Detail[language].Title}</div>
    <div>
      ${CategoryCodes.map(({ Shortname }) => {
        return html`${Shortname}, `;
      })}
    </div>
    <div>${LocationInfo.TvInfo.Name[language]}</div>
    <div></div>
  </div>`;
};

export function render__list() {
  if (!this.listGastronomies) {
    console.log("no list");

    return null;
  }
  const { Items, TotalPages, CurrentPage } = this.listGastronomies;
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
          ? Items.map(({ Detail, CategoryCodes, LocationInfo }) => {
              return renderRows(
                Detail,
                CategoryCodes,
                LocationInfo,
                this.language
              );
            })
          : null}
      </div>
    </div>
    <div class="gastronomies__list__pagination">
      <wc-button
        type="primary"
        content="${t[`prev`][this.language]}"
      ></wc-button>
      <p>${CurrentPage} / ${TotalPages}</p>
      <wc-button
        type="primary"
        content="${t[`next`][this.language]}"
      ></wc-button>
    </div>
  `;
}

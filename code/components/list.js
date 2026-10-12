// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { html } from "lit-element";
import { requestTourismGastronomyDetails } from "../api/gastronomies";
import { t } from "../translations";

function localizedName(map, language) {
  if (!map || typeof map !== "object") {
    return "";
  }
  const entry = map[language] || map.en || map.de || map.it;
  return (entry && entry.Title) || (entry && entry.Name) || "";
}

function categoryLabels(CategoryCodes, Tags, AdditionalPoiInfos, language) {
  if (Array.isArray(CategoryCodes) && CategoryCodes.length) {
    return CategoryCodes.map((c) => c && c.Shortname).filter(Boolean);
  }
  if (Array.isArray(Tags) && Tags.length) {
    const fromTags = Tags.filter(
      (tag) =>
        tag &&
        (tag.Type === "gastronomycategory" || tag.Type === "odhcategory") &&
        tag.Name &&
        !["Gastronomy", "Eating & Drinking"].includes(tag.Name)
    ).map((tag) => tag.Name);
    if (fromTags.length) {
      return fromTags;
    }
  }
  const additional =
    (AdditionalPoiInfos &&
      (AdditionalPoiInfos[language] ||
        AdditionalPoiInfos.en ||
        AdditionalPoiInfos.de ||
        AdditionalPoiInfos.it)) ||
    {};
  return Array.isArray(additional.Categories) ? additional.Categories : [];
}

function locationLabel(LocationInfo, language) {
  if (!LocationInfo) {
    return "---";
  }
  const tv = LocationInfo.TvInfo || LocationInfo.MunicipalityInfo || {};
  const name = tv.Name;
  if (typeof name === "string") {
    return name;
  }
  if (name && typeof name === "object") {
    return name[language] || name.en || name.de || name.it || "---";
  }
  return "---";
}

function renderRows(
  Detail,
  CategoryCodes,
  LocationInfo,
  Id,
  Tags,
  AdditionalPoiInfos
) {
  const title = localizedName(Detail, this.language);
  if (!title) {
    return null;
  }
  const categories = categoryLabels(
    CategoryCodes,
    Tags,
    AdditionalPoiInfos,
    this.language
  );

  return html`<div class="gastronomies__list_content_row">
    <div>${title}</div>
    <div>${categories.length ? categories.join(", ") : "---"}</div>
    <div>${locationLabel(LocationInfo, this.language)}</div>
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
          ? Items.map(
              ({
                Detail,
                CategoryCodes,
                LocationInfo,
                Id,
                Tags,
                AdditionalPoiInfos,
              }) => {
                return renderRows.bind(this)(
                  Detail,
                  CategoryCodes,
                  LocationInfo,
                  Id,
                  Tags,
                  AdditionalPoiInfos
                );
              }
            )
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

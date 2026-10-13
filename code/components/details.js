// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import dayjs from "dayjs";
import { html } from "lit-element";
import { SIDE_MODAL_ROW_TYPES } from "../shared_components/sideModalRow/sideModalRow";
import { t } from "../translations";

const EMPTY = "---";

/** Prefer the active language, then common fallbacks. */
function localized(map, language) {
  if (!map || typeof map !== "object") {
    return {};
  }
  return (
    map[language] ||
    map.en ||
    map.de ||
    map.it ||
    Object.values(map).find(Boolean) ||
    {}
  );
}

function joinParts(...parts) {
  const text = parts
    .filter((part) => part != null && String(part).trim() !== "")
    .join(" ")
    .trim();
  return text || EMPTY;
}

/**
 * Categories: Tourism still returns CategoryCodes for many LTS records,
 * but suedtirolwein / reduced payloads often omit it. Fall back to Tags
 * (gastronomycategory) and AdditionalPoiInfos.*.Categories.
 */
function resolveCategories(gastronomy, language) {
  const codes = Array.isArray(gastronomy.CategoryCodes)
    ? gastronomy.CategoryCodes.map((c) => c && c.Shortname).filter(Boolean)
    : [];
  if (codes.length) {
    return codes;
  }

  const tags = Array.isArray(gastronomy.Tags)
    ? gastronomy.Tags.filter(
        (tag) =>
          tag &&
          (tag.Type === "gastronomycategory" ||
            tag.Type === "odhcategory") &&
          tag.Name &&
          !["Gastronomy", "Eating & Drinking", "gastronomy"].includes(tag.Name)
      ).map((tag) => tag.Name)
    : [];
  if (tags.length) {
    return tags;
  }

  const additional = localized(gastronomy.AdditionalPoiInfos, language);
  return Array.isArray(additional.Categories) ? additional.Categories : [];
}

/**
 * Facilities is no longer present on ODHActivityPoi detail responses.
 * Use Tags with facility-like types when available; otherwise empty.
 */
function resolveFacilities(gastronomy) {
  if (Array.isArray(gastronomy.Facilities) && gastronomy.Facilities.length) {
    return gastronomy.Facilities.map((f) => f && f.Shortname).filter(Boolean);
  }
  if (!Array.isArray(gastronomy.Tags)) {
    return [];
  }
  return gastronomy.Tags.filter(
    (tag) =>
      tag &&
      tag.Name &&
      (tag.Type === "gastronomyfacility" ||
        tag.Type === "facility" ||
        /facility/i.test(tag.Type || ""))
  ).map((tag) => tag.Name);
}

function resolveGps(gastronomy) {
  const gps = Array.isArray(gastronomy.GpsInfo) ? gastronomy.GpsInfo[0] : null;
  if (gps && gps.Latitude != null && gps.Longitude != null) {
    return gps;
  }
  const points = gastronomy.GpsPoints || {};
  const position = points.position || points.Position;
  if (position && position.Latitude != null && position.Longitude != null) {
    return position;
  }
  return null;
}

export function render_details() {
  const gastronomy = this.currentGastronomy || {};
  const language = this.language;

  const detail = localized(gastronomy.Detail, language);
  const contact = localized(gastronomy.ContactInfos, language);
  const Title = detail.Title || gastronomy.Shortname || EMPTY;
  const BaseText = detail.BaseText || "";

  const OperationSchedule = Array.isArray(gastronomy.OperationSchedule)
    ? gastronomy.OperationSchedule
    : [];
  const categories = resolveCategories(gastronomy, language);
  const facilities = resolveFacilities(gastronomy);
  const gps = resolveGps(gastronomy);

  const contactPerson = joinParts(contact.Givenname, contact.Surname);
  const address = joinParts(
    contact.Address,
    contact.City,
    contact.CountryName,
    contact.CountryCode
  );

  const directionsUrl =
    gps && !this.disableGastronomyDirections
      ? {
          text: t["directions"][language],
          url: `http://www.google.com/maps/place/${gps.Latitude},${gps.Longitude}`,
        }
      : { text: "", url: "" };

  return html` <div class="details">
    <div class="header">
      <wc-sidemodal-header
        .type="title"
        .tTitle="${Title}"
        .tOptionalLink="${directionsUrl}"
        .closeModalAction="${() => {
          this.detailsOpen = false;
        }}"
      ></wc-sidemodal-header>
    </div>
    <div>
      <wc-divider></wc-divider>
    </div>
    ${BaseText
      ? html`<div>
          <div>
            <p class="caption">${t["description"][language]}</p>
            <p class="">${BaseText}</p>
          </div>
        </div>
        <div>
          <wc-divider></wc-divider>
        </div>`
      : null}
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["season"][language]}"
        .text="${OperationSchedule.length
          ? OperationSchedule.map((o) => {
              const start = o && o.Start ? dayjs(o.Start).format("DD/MM/YYYY") : EMPTY;
              const stop = o && o.Stop ? dayjs(o.Stop).format("DD/MM/YYYY") : EMPTY;
              return html`${start} - ${stop} <br />`;
            })
          : EMPTY}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["category"][language]}"
        .text="${categories.length ? categories.join(", ") : EMPTY}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p class="caption">${t["contactInfo"][language]}</p>
      </div>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["organization"][language]}"
        .text="${contact.CompanyName || EMPTY}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["address"][language]}"
        .text="${address}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["place"][language]}"
        .text="${contact.ZipCode || EMPTY}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["contactPerson"][language]}"
        .text="${contactPerson}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["telFax"][language]}"
        .text="${(contact.Phonenumber || EMPTY) +
        " / " +
        (contact.Faxnumber || EMPTY)}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["eMail"][language]}"
        .text="${contact.Email || EMPTY}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["web"][language]}"
        .isUrl="${Boolean(contact.Url)}"
        .text="${contact.Url || EMPTY}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["facilities"][language]}"
        .text="${facilities.length ? facilities.join(", ") : EMPTY}"
      ></wc-sidemodal-row>
    </div>
    ${gastronomy.Source
      ? html`<div>
          <wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["source"][language]}"
            .text="${gastronomy.Source}"
          ></wc-sidemodal-row>
        </div>`
      : null}
  </div>`;
}

// SPDX-FileCopyrightText: 2021 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import dayjs from "dayjs";
import { html } from "lit-element";
import { SIDE_MODAL_ROW_TYPES } from "../shared_components/sideModalRow/sideModalRow";
import { t } from "../translations";

export function render_details() {
  const { Detail, Latitude, Longitude } = this.currentGastronomy;
  var {
    OperationSchedule,
    CategoryCodes,
    ContactInfos,
  } = this.currentGastronomy;
  // to fix problem with reduced data from Open Data Hub
  if (OperationSchedule == null) {
    OperationSchedule = [];
  }

  // to fix problem with reduced data from Open Data Hub
  const Facilities = this.currentGastronomy["Facilities"] ? this.currentGastronomy : [];

  const { Title, BaseText } = Detail[this.language];
  const { Address, City, CompanyName, CountryCode, CountryName } = ContactInfos[
    this.language
  ];
  const { Email, Faxnumber, Givenname } = ContactInfos[this.language];
  const { Phonenumber, Surname, Url, ZipCode } = ContactInfos[this.language];

  return html` <div class="details">
    <div class="header">
      <wc-sidemodal-header
        .type="title"
        .tTitle="${Title}"
        .tOptionalLink="${!this.disableGastronomyDirections
      ? {
        text: t["directions"][this.language],
        url: `http://www.google.com/maps/place/${Latitude},${Longitude}`,
      }
      : {
        text: "",
        url: "",
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
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["season"][this.language]}"
        .text="${OperationSchedule.map((o) => {
      return html`
            ${dayjs(o.Start).format("DD/MM/YYYY")} -
            ${dayjs(o.Stop).format("DD/MM/YYYY")} <br />
          `;
    })}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["category"][this.language]}"
        .text="${CategoryCodes.map((category, i) => {
      return html`${category.Shortname}${i !== CategoryCodes.length - 1
        ? ", "
        : ""} `;
    })}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p class="caption">${t["contactInfo"][this.language]}</p>
      </div>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["organization"][this.language]}"
        .text="${CompanyName}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["address"][this.language]}"
        .text="${Address} ${City} ${CountryName} ${CountryCode}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["place"][this.language]}"
        .text="${ZipCode}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["contactPerson"][this.language]}"
        .text="${Givenname} ${Surname}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["telFax"][this.language]}"
        .text="${Phonenumber || "---"} / ${Faxnumber || "---"}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["eMail"][this.language]}"
        .text="${Email}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["web"][this.language]}"
        .isUrl="${true}"
        .text="${Url}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["facilities"][this.language]}"
        .text="${Facilities.map((facility, i) => {
      return html`${facility.Shortname}${i !== Facilities.length - 1
        ? ", "
        : ""} `;
    })}"
      ></wc-sidemodal-row>
    </div>
  </div>`;
}

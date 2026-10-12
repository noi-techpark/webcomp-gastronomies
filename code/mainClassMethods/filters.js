// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { requestTourismGastronomiesCodes } from "../api/gastronomies";

const filterCode = (codes, language, type) => {
  if (!Array.isArray(codes)) {
    return [];
  }
  return codes
    .filter((o) => o && Array.isArray(o.Types) && o.Types.includes(type))
    .map((o) => {
      const tagName =
        (o.TagName && (o.TagName[language] || o.TagName.en || o.TagName.de || o.TagName.it)) ||
        o.Id;
      return [tagName, o.Id];
    });
};

export async function getFilters() {
  const codes = await requestTourismGastronomiesCodes();
  const items = (codes && codes.Items) || (Array.isArray(codes) ? codes : []);

  this.categories = filterCode(items, this.language, "gastronomycategory");
  this.facilityCodesCreditCard = filterCode(
    items,
    this.language,
    "facilitycodes_creditcard"
  );
  this.facilityCodesFeatures = filterCode(
    items,
    this.language,
    "facilitycodes_equipment"
  );
  this.facilityCodesQuality = filterCode(
    items,
    this.language,
    "facilitycodes_qualityseals"
  );
  this.facilityCodesCuisine = filterCode(
    items,
    this.language,
    "facilitycodes_cuisinecodes"
  );
  this.facilityCodesCeremony = filterCode(
    items,
    this.language,
    "gastronomyceremonycodes"
  );
}

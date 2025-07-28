// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { requestTourismGastronomiesCodes } from "../api/gastronomies";

const filterCode = (codes, language, type) => {
  return codes
    .filter((o) => o.Types.includes(type))
    .map((o) => {
      return [o.TagName[language], o.Id];
    });
};

export async function getFilters() {
  const codes = await requestTourismGastronomiesCodes();

  // Category
  const categories = filterCode(codes.Items, this.language, "gastronomycategory");

  // Facility Codes CreditCard
  const facilityCodesCreditCard = filterCode(
    codes.Items,
    this.language,
    "facilitycodes_creditcard"
  );

  // Facility Codes Features
  const facilityCodesFeatures = filterCode(
    codes.Items,
    this.language,
    "facilitycodes_equipment"
  );

  // Facility Codes Quality
  const facilityCodesQuality = filterCode(
    codes.Items,
    this.language,
    "facilitycodes_qualityseals"
  );

  // Facility Codes Cuisine
  const facilityCodesCuisine = filterCode(codes.Items, this.language, "facilitycodes_cuisinecodes");

  // Facility Codes Ceremony
  const facilityCodesCeremony = filterCode(
    codes.Items,
    this.language,
    "gastronomyceremonycodes"
  );

  this.categories = categories;
  this.facilityCodesCreditCard = facilityCodesCreditCard;
  this.facilityCodesFeatures = facilityCodesFeatures;
  this.facilityCodesQuality = facilityCodesQuality;
  this.facilityCodesCuisine = facilityCodesCuisine;
  this.facilityCodesCeremony = facilityCodesCeremony;
}

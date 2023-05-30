// SPDX-FileCopyrightText: 2021 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { requestTourismGastronomiesCodes } from "../api/gastronomies";

const filterCode = (codes, language, type) => {
  return codes
    .filter((o) => o.Type === type)
    .map((o) => {
      return [o.TypeDesc[language], o.Bitmask];
    });
};

export async function getFilters() {
  const codes = await requestTourismGastronomiesCodes();

  // Category
  const categories = filterCode(codes, this.language, "CategoryCodes");

  // Facility Codes CreditCard
  const facilityCodesCreditCard = filterCode(
    codes,
    this.language,
    "FacilityCodes_CreditCard"
  );

  // Facility Codes Features
  const facilityCodesFeatures = filterCode(
    codes,
    this.language,
    "FacilityCodes_Equipment"
  );

  // Facility Codes Quality
  const facilityCodesQuality = filterCode(
    codes,
    this.language,
    "FacilityCodes_QualitySeals"
  );

  // Facility Codes Cuisine
  const facilityCodesCuisine = filterCode(codes, this.language, "CuisineCodes");

  // Facility Codes Ceremony
  const facilityCodesCeremony = filterCode(
    codes,
    this.language,
    "CeremonyCodes"
  );

  this.categories = categories;
  this.facilityCodesCreditCard = facilityCodesCreditCard;
  this.facilityCodesFeatures = facilityCodesFeatures;
  this.facilityCodesQuality = facilityCodesQuality;
  this.facilityCodesCuisine = facilityCodesCuisine;
  this.facilityCodesCeremony = facilityCodesCeremony;
}

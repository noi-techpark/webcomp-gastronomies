import { requestTourismGastronomiesCodes } from "../api/gastronomies";

export async function getFilters() {
  // Category
  const categories = await requestTourismGastronomiesCodes(
    this.language,
    "CategoryCodes"
  );

  // Facility Codes CreditCard
  const facilityCodesCreditCard = await requestTourismGastronomiesCodes(
    this.language,
    "FacilityCodes_CreditCard"
  );

  // Facility Codes Features
  const facilityCodesFeatures = await requestTourismGastronomiesCodes(
    this.language,
    "FacilityCodes_Equipment"
  );

  // Facility Codes Quality
  const facilityCodesQuality = await requestTourismGastronomiesCodes(
    this.language,
    "FacilityCodes_QualitySeals"
  );

  // Facility Codes Cuisine
  const facilityCodesCuisine = await requestTourismGastronomiesCodes(
    this.language,
    "CuisineCodes"
  );

  // Facility Codes Ceremony
  const facilityCodesCeremony = await requestTourismGastronomiesCodes(
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

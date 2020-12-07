import { BASE_PATH_TOURISM_GASTRONOMY } from "./config";

export const requestTourismGastronomies = async () => {
  try {
    const request = await fetch(
      `${BASE_PATH_TOURISM_GASTRONOMY}?pagenumber=1&pagesize=10000&active=true&odhactive=true&fields=Id%2CLongitude%2CLatitude`
    );
    if (request.status !== 200) {
      throw new Error(request.statusText);
    }
    const response = await request.json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const requestTourismGastronomyDetails = async ({ Id }) => {
  try {
    const request = await fetch(`${BASE_PATH_TOURISM_GASTRONOMY}/${Id}`);
    if (request.status !== 200) {
      throw new Error(request.statusText);
    }
    const response = await request.json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

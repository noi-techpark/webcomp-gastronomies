import {
  BASE_PATH_TOURISM_GASTRONOMY,
  BASE_PATH_TOURISM_GASTRONOMY_REDUCED,
} from "./config";

export const requestTourismGastronomies = async () => {
  try {
    const request = await fetch(
      `${BASE_PATH_TOURISM_GASTRONOMY_REDUCED}?active=true&odhactive=true&fields=Id,Latitude,Longitude,CategoryCodes`
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

function uniq(a) {
  return Array.from(new Set(a));
}

export const requestTourismGastronomiesCategories = async () => {
  try {
    const request = await fetch(
      `${BASE_PATH_TOURISM_GASTRONOMY_REDUCED}?active=true&odhactive=true&fields=CategoryCodes`
    );
    if (request.status !== 200) {
      throw new Error(request.statusText);
    }
    const response = await request.json();

    const categories = [];
    for (let i = 0; i < response.length; i++) {
      const { CategoryCodes } = response[i];
      for (let z = 0; z < CategoryCodes.length; z++) {
        const { Shortname } = CategoryCodes[z];
        categories.push(Shortname);
      }
    }

    return uniq(categories);
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

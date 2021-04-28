import { BASE_PATH_TOURISM_GASTRONOMY } from "./config";

export async function requestGetCoordinatesFromSearch(query) {
  const r = 150 * 1000;
  try {
    if (query) {
      // Open data hub
      let formattedTourismGastronomyData = [];
      const tourismGastronomyRequest = await fetch(
        `${BASE_PATH_TOURISM_GASTRONOMY}?active=true&odhactive=true&pagesize=-1&fields=Detail,Latitude,Longitude&searchfilter=${query}`
      );
      const tourismGastronomyResponse = await tourismGastronomyRequest.json();

      if (tourismGastronomyResponse.Items) {
        formattedTourismGastronomyData = tourismGastronomyResponse.Items.map(
          (o) => {
            let title = "";
            if (o.Detail[this.language].Title) {
              title = o.Detail[this.language].Title;
            }
            return {
              position: [o.Latitude, o.Longitude],
              title: title || o.Detail.it.Title || o.Detail.de.Title,
            };
          }
        );
      }

      // Other data

      let formattedHereData = [];
      if (!formattedTourismGastronomyData.length && process.env.DOTENV.HEREMAPS_API_KEY) {
        const hereResponse = await fetch(
          `https://places.ls.hereapi.com/places/v1/browse?apiKey=${process.env.DOTENV.HEREMAPS_API_KEY}&in=46.31,11.26;r=${r}&q=${query}`,
          {
            method: "GET",
            headers: new Headers({
              Accept: "application/json",
            }),
          }
        );
        const hereData = await hereResponse.json();
        formattedHereData = hereData.results.items.map((item) => {
          return {
            position: item.position,
            title: item.title,
          };
        });
      }

      //

      const tourismResponse = await fetch(
        `https://tourism.opendatahub.bz.it/api/Poi?pagenumber=1&pagesize=10000&poitype=511&searchfilter=${query}`,
        {
          method: "GET",
          headers: new Headers({
            Accept: "application/json",
          }),
        }
      );
      const tourismData = await tourismResponse.json();
      const formattedTourismData = tourismData.Items.map((item) => {
        return {
          position: [item.GpsInfo[0].Latitude, item.GpsInfo[0].Longitude],
          title: item.Detail[this.language].Title,
        };
      });

      this.searchPlacesFound = {
        "Open Data Hub": [...formattedTourismGastronomyData],
        "Other results": [...formattedTourismData, ...formattedHereData],
      };
    }
  } catch (error) {
    console.error(error);
    this.searchPlacesFound = {};
  }
}

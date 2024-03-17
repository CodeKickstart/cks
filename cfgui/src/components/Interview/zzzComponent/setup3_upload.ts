import { JsonObjectType } from "../../../shared/defs/types";
import { valtioStore } from "../defs/types/ValtioTypes";

export const fnUpload = async (postData: JsonObjectType) => {
  async function postDataAsync() {
    try {
      let url = "";
      if (!url) {
        const urlInfo = valtioStore.urlInfo;
        url = `${urlInfo.baseUrl}${urlInfo.path}?${urlInfo.queryParams}`;
      }
      const urlInfo = valtioStore.urlInfo; // Import the urlInfo variable from valtioStore

      const postDataString = JSON.stringify(postData);
      const urlPath = urlInfo.baseUrl + urlInfo.path;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Origin: urlPath, // Specify the origin
          "Content-Type": "application/json", // Specify content type as JSON
        },
        body: postDataString, // Convert JSON object to string
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // Parse response body as JSON
      console.log("Response:", data); // Log the response data
      return { data }; // Return response data
    } catch (error) {
      return { error }; // Return error if any
    }
  }

  // Await the asynchronous postDataAsync function
  return await postDataAsync();
};

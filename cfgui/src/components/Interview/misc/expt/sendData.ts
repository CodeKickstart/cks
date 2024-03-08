export const sendData = (url: string) => async () => {
  const postData = { name: "John", age: 30 }; // Sample JSON data to send // URL of your Express server endpoint

  async function postDataAsync() {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify content type as JSON
        },
        body: JSON.stringify(postData), // Convert JSON object to string
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // Parse response body as JSON
      console.log("Response:", data); // Log the response data
    } catch (error) {
      console.error("Error:", error); // Log any errors
    }
  }

  postDataAsync();
};

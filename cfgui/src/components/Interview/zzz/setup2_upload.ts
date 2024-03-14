export const fnSendData = (url: string) => async () => {
  const postData = { name: "John", age: 30 };

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

// export const fnUpload = async (data: unknown) => {
//   const response = await fetch("https://api.example.com/answers", {
//     method: "POST",

//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) {
//     throw new Error("Failed to upload answers");
//   }
//   return response.json();
// };

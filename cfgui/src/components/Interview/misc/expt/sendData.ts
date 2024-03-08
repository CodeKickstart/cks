export const sendData = (url: string) => async () => {
  const postData = { name: "John", age: 30 };
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
  return response.json();
};

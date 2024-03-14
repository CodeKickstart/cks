export const fnUpload = async (data: unknown) => {
  const response = await fetch("https://api.example.com/answers", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to upload answers");
  }
  return response.json();
};

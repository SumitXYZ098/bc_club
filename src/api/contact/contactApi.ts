interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const contactApi = async (data: FormData) => {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to subscribe");
  }

  return result;
};

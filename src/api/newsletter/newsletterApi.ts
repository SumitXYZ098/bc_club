interface NewsletterData {
  email: string;
}

export const newsletterApi = async (data: NewsletterData) => {
  const response = await fetch("/api/newsletter", {
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

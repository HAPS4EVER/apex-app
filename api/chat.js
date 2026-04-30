export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const key = process.env.ANTHROPIC_API_KEY;
  console.log("KEY EXISTS:", !!key);
  console.log("KEY:", key?.substring(0, 15));

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log("RESPONSE:", JSON.stringify(data).substring(0, 100));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { phone, firstLevel, amount } = req.body;

  if (!phone || !firstLevel || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds

  try {
    console.log("Sending request to external API:", { phone, firstLevel, amount });

    const response = await fetch("https://www.iabconcept.com/api/airtimeapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.API_KEY,
        "secret-key": process.env.SECRET_KEY,
      },
      body: JSON.stringify({ phone, firstLevel, amount }),
      signal: controller.signal, // Attach the timeout controller
    });

    clearTimeout(timeout);

    const data = await response.json();
    console.log("Response from Airtime API:", data);

    // 🔹 Check if API returned an error
    if (data.error) {
      return res.status(400).json({ message: data.error, details: data });
    }

    if (!response.ok) {
      return res.status(response.status).json({ 
        message: data.message || "Failed to purchase airtime", 
        details: data 
      });
    }

    return res.status(200).json({ message: "Transaction successful", data: data.airtimeHistory });

  } catch (error) {
    console.error("Airtime API Error:", error);

    return res.status(500).json({ 
      message: "Failed to connect to the Airtime API. Please try again later.",
      errorDetails: error.toString(),
    });
  }

}

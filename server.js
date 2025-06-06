const express = require("express");
const fetch = require("node-fetch"); // node-fetch v2 required
const cors = require("cors");
require("dotenv").config();

console.log("Loaded API Key:", process.env.OPENAI_API_KEY?.slice(0, 10) + "...");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/omen", async (req, res) => {
  const { species } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // ✅ safest model to ensure access
        temperature: 0.9,
        messages: [
          {
            role: "system",
            content: "YYou are a poetic mystic and ornithologist who interprets bird sightings as omens. Speak in brief, mythic phrases — evocative but concise, no more than 3 sentences."
          },
          {
            role: "user",
            content: `What is the symbolic meaning of seeing a ${species}? Speak with confidence and clarity.`
          }
        ]
      })
    });

    const data = await response.json();
    console.log("🔍 Raw OpenAI response:", JSON.stringify(data, null, 2)); // debug

    if (!data.choices || !data.choices[0]) {
      throw new Error("No choices returned from OpenAI.");
    }

    const omen = data.choices[0].message.content;
    res.json({ omen });

  } catch (error) {
    console.error("🔴 Error fetching omen:", error.message);
    res.status(500).json({ error: "Failed to interpret the omen." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

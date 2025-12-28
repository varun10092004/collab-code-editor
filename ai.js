const axios = require("axios");

async function getAISuggestion(code) {
  const apiKey = process.env.MISTRAL_API_KEY;

  // 🔐 Validate API key
  if (!apiKey) {
    console.error("MISTRAL_API_KEY is missing");
    return "⚠️ AI key not configured. Please check server .env file.";
  }

  try {
    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-small",
        messages: [
          {
            role: "system",
            content: "You are a helpful coding assistant.",
          },
          {
            role: "user",
            content: `Analyze the following code and suggest improvements:\n\n${code}`,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 15000, // prevent hanging requests
      }
    );

    // 🛡️ Safe response handling
    return (
      response.data?.choices?.[0]?.message?.content ||
      "⚠️ AI returned no response."
    );
  } catch (error) {
    console.error(
      "MISTRAL API ERROR:",
      error.response?.data || error.message
    );

    return `
AI Suggestion (Fallback):

• Improve code readability
• Add proper comments
• Handle edge cases
• Follow best practices
`;
  }
}

module.exports = getAISuggestion;

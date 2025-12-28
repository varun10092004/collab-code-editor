const axios = require("axios");

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

async function getAISuggestion(code) {
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
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("MISTRAL API ERROR:", error.response?.data || error.message);

    return `
AI Suggestion (Fallback):

• Improve code formatting
• Add comments
• Handle edge cases
• Follow best practices
`;
  }
}

module.exports = getAISuggestion;

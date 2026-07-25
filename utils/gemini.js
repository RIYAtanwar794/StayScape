const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateDescription(data) {

    const prompt = `
        Write an attractive Airbnb-style property description.

        Title: ${data.title}
        Location: ${data.location}
        Country: ${data.country}

        Rules:
          - Around 30-50 words.
          - Friendly and premium tone.
          - Mention nearby attractions if appropriate.
          - Do not use markdown.
          - Return only the description.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
    });
    return response.text;
}

module.exports = generateDescription;



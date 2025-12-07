import { GoogleGenAI } from "@google/genai";
import { NewsData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchNewsAndImage = async (country: string): Promise<NewsData> => {
  try {
    // Step 1: Fetch News with Search Grounding
    // We cannot use responseSchema with search tools, so we rely on a strict prompt.
    const newsPrompt = `
      Find the single most significant, newsworthy story that happened in ${country} within the last 24 hours.
      Focus on major political, social, or cultural events. 
      
      Strictly format your response as follows:
      HEADLINE: [Insert a catchy, short headline here]
      SUMMARY: [Insert a 2-3 sentence summary of the event here]
      
      Do not include any other text or markdown formatting like **.
    `;

    const newsResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: newsPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = newsResponse.text || "";
    
    // Parse the text manually since we can't use JSON schema with Search
    const headlineMatch = rawText.match(/HEADLINE:\s*(.*)/i);
    const summaryMatch = rawText.match(/SUMMARY:\s*(.*)/is); // 's' flag for dotAll if summary spans lines

    const headline = headlineMatch ? headlineMatch[1].trim() : `Latest News from ${country}`;
    const summary = summaryMatch ? summaryMatch[1].trim() : rawText;

    // Extract Grounding Metadata
    const chunks = newsResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Source",
        url: chunk.web.uri || "#",
      }));

    // Step 2: Generate Image based on the news
    // We use the headline and country to drive the creative process.
    const imagePrompt = `
      Create a high-quality, artistic, editorial-style illustration representing this news headline from ${country}: "${headline}".
      The style should be modern, evocative, and suitable for a top-tier news magazine. 
      Do not include text in the image. 
      Use a moody or dramatic lighting depending on the subject.
    `;

    const imageResponse = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: imagePrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9',
        outputMimeType: 'image/jpeg',
      },
    });

    let imageUrl = "";
    if (imageResponse.generatedImages?.[0]?.image?.imageBytes) {
      imageUrl = `data:image/jpeg;base64,${imageResponse.generatedImages[0].image.imageBytes}`;
    } else {
      // Fallback if image generation fails or returns no bytes (rare but possible)
      imageUrl = `https://picsum.photos/800/450?blur=2`;
    }

    return {
      country,
      headline,
      summary,
      imageUrl,
      sources,
      timestamp: new Date().toLocaleDateString(),
    };

  } catch (error) {
    console.error("Error in fetchNewsAndImage:", error);
    throw error;
  }
};
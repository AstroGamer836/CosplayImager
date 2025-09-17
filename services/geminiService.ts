
import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { EditedImageResult, ImageData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const base64ToPureBase64 = (base64: string): string => {
    return base64.split(',')[1];
}

export const editImageWithNanoBanana = async (
    image: ImageData,
    prompt: string
): Promise<EditedImageResult> => {
    try {
        const pureBase64 = base64ToPureBase64(image.base64);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: pureBase64,
                            mimeType: image.mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const result: EditedImageResult = {};

        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.text) {
                    result.text = part.text;
                } else if (part.inlineData) {
                    result.imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                    result.mimeType = part.inlineData.mimeType;
                }
            }
        }
        
        if (!result.imageUrl) {
            throw new Error("API did not return an image. It might have deemed the prompt unsafe.");
        }

        return result;

    } catch (error) {
        console.error("Error editing image with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to edit image: ${error.message}`);
        }
        throw new Error("An unknown error occurred while editing the image.");
    }
};

export const getPromptSuggestions = async (image: ImageData): Promise<string[]> => {
    try {
        const pureBase64 = base64ToPureBase64(image.base64);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: pureBase64,
                            mimeType: image.mimeType,
                        },
                    },
                    {
                        text: 'Analyze this image and suggest 3 creative, distinct, and concise editing ideas. The ideas should be actionable prompts for an AI. For example: "Add a superhero cape" or "Change the background to a futuristic city". Return ONLY a valid JSON array of 3 strings.',
                    },
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const suggestions = JSON.parse(jsonText);

        if (Array.isArray(suggestions) && suggestions.every(item => typeof item === 'string')) {
            return suggestions;
        } else {
            throw new Error("API returned an invalid format for suggestions.");
        }

    } catch (error) {
        console.error("Error getting prompt suggestions:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get suggestions: ${error.message}`);
        }
        throw new Error("An unknown error occurred while getting suggestions.");
    }
};
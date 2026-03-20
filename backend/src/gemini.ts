import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey || 'dummy-key-for-now');

const responseSchema: any = {
  type: SchemaType.OBJECT,
  properties: {
    intent: {
      type: SchemaType.STRING,
      description: "The core intent or goal of the user derived from the input",
    },
    category: {
      type: SchemaType.STRING,
      description: "The domain category: health, emergency, travel, finance, civic issue, etc.",
    },
    urgency_level: {
      type: SchemaType.STRING,
      description: "LOW, MEDIUM, HIGH, or CRITICAL based on the situation",
    },
    key_entities: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Important entities extracted like locations, symptoms, names, conditions",
    },
    recommended_actions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Step-by-step actionable recommendations for the user",
    },
    confidence_score: {
      type: SchemaType.STRING,
      description: "Confidence percentage of the AI in its analysis (e.g. '95%')",
    },
    sources: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "General types of sources or rationale used, e.g., 'General Medical Knowledge', 'Traffic Safety Guidelines'",
    }
  },
  required: ["intent", "category", "urgency_level", "key_entities", "recommended_actions", "confidence_score", "sources"]
};

interface ProcessInputArgs {
  text?: string | undefined;
  image?: Express.Multer.File | undefined;
}

export const processInput = async ({ text, image }: ProcessInputArgs) => {
  try {
    const contents: any[] = [];
    
    // Add text if present
    if (text) {
      contents.push({ text: text });
    }
    
    // Add image if present
    if (image?.buffer) {
      contents.push({
        inlineData: {
          data: image.buffer.toString('base64'),
          mimeType: image.mimetype,
        }
      });
    }

    const systemPrompt = `You are the Universal Context Bridge AI. Your job is to accept messy, real-world, multi-modal inputs and convert them into structured, verified, and actionable insights that can assist in real-life decision-making. Analyze the following inputs and return a structured JSON response matching the provided schema.`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: contents }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    const response = result.response;
    const outputText = response.text() || "{}";
    const structuredResult = JSON.parse(outputText);
    
    return { result: structuredResult, error: null };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return { result: null, error: error.message };
  }
};

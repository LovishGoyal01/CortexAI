import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const getModel = async (agent) => {
  const groq = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-120b",
  });

  const gemini = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.5-flash",
  });

  switch (agent) {
    case "image":
      return gemini;
    default:
      return groq;
  }
};
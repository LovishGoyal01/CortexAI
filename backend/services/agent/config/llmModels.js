import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter";

export const getModel = async (agent) => {
  const groq = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-120b",
  });

  const gemini = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.5-flash",
  });

  const openrouter = new ChatOpenRouter({
    model: "deepseek/deepseek-chat",
    temperature: 0,
    maxTokens: 2500,
  }); 

  switch (agent) {
    case "image":
      return groq;
    case "coding":
      return openrouter;  
    case "chat":
      return groq; 
    case "search":
      return groq;   
    default:
      return groq;
  }
};
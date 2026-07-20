import fs from "fs";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../config/vectorDb.js";
import { getModel } from "../config/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { checkAgentLimit } from "../config/agentlimit.js";

export const pdfRag = async (state) =>{
   try{
      await checkAgentLimit(state.userId, "pdf")  // Check if the user has exceeded the pdf limit
      const buffer = fs.readFileSync(state.file.path);
      const pdf = new PDFParse({
        data:buffer
      });
      const result = await pdf.getText();
      const text = result.text;

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      })
     
      // creating docs
      const docs = await splitter.createDocuments([text]);
      const collectionName = `pdf-${Date.now()}`;

      // sending in vector store
      const store = await vectorStore(docs, collectionName);

      // doing similarity search
      const relevantDocs = await store.similaritySearch(state.prompt, 5);

      // merging the relevant docs into a single 
      const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");

      const llm = await getModel("pdf-rag");  // we want groq

      const messages = [
        new SystemMessage(`You are CortexAI PDF Assistant.

Rules:

- Answer ONLY from the uploaded PDF.

- Never make up information.

- If the answer is not present in the PDF, reply:

"I couldn't find this information in the uploaded PDF."

- Use Markdown formatting.
`),

      new HumanMessage(`
Context:${context}

Question:${state.prompt}
`)
]; 

      const response = await llm.invoke(messages);
      await deductCredits(state.userId, "pdf");

      return {
        ...state,
        aiResponse: response.content
      }
   }catch(error){
      return {
        ...state,
        aiResponse: error?.data?.message || "❌ Error processing the PDF. Please try again later.",
      }  
   }finally{
      // Clean up the uploaded file after processing
      if (state.file && state.file.path) {
         fs.unlinkSync(state.file.path);
      }
   }  
}
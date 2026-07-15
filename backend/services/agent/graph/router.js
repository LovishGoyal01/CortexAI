import { getModel } from "../config/llmModel.js";

export const router = async(state) => {
    
    if(state.agent && state.agent !== "auto"){
        return {
          ...state,
          agent: state.agent       
        }
    }

    const llm  = await getModel("router") 
    const prompt = `
     You are an agent router.

     Available agents:

     - chat
     - search
     - coding
     - pdf
     - ppt
     - vision

     Rules:

     chat:
     General conversation,
     explanations,
     learning,
     questions.

     search:
     Current events,
     latest information,
     news,
     recent developments,
     internet lookup.

     coding:
     Generate code,
     debug code,
     build projects,
     architecture,
     API design.

     pdf:
     Questions about generate PDFs,
     document context,

     ppt:
     Questions about generate PowerPoint presentations,
     PPT creation,
     slide design,
     presentation context.

     vision:
     Image generation,
     image editing,
     image analysis,
     visual design,
     diagrams,
     logos,
     artwork.

     Return ONLY one word:

     chat
     search
     coding
     pdf
     ppt
     vision

     User Query:${state.prompt}
  `;

 const response = await llm.invoke(prompt)
  return {
    ...state,
    agent: response.content.trim().toLowerCase()  // Convert the response to lowercase to match the agent names
  }
}   
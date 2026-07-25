import { checkAgentLimit } from "../config/agentLimit.js";
import { getModel } from "../config/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";

export const codingAgent = async (state) => {
 try{
  console.log("A. Enter coding agent");
  await checkAgentLimit(state.userId, "coding")  // Check if the user has exceeded the coding limit
  console.log("B. Limit checked");
  const intentllm = await getModel("intent");
  console.log("C. Intent model loaded");
  const llm = await getModel("coding");
  console.log("D. Coding model loaded");
  console.log("E. Before intent classification");
  const intentRes = await intentllm.invoke(`
    You are an intent classifier.

    Return ONLY one of these values.
 
    CODE_GENERATION   
    CODE_REVIEW
    CODE_EXPLANATION
    DEBUGGING
    OPTIMIZATION
    CONVERSION
    DOCUMENTATION

    Definitions:

    User Request:
    ${state.prompt}
  `)
  console.log("F. Intent:", intentRes.content);

  const intent = intentRes.content
  
  if (intent == "CODE_GENERATION") {
    const prompt = `
       You are CortexAI Coding Agent.
   
       Generate the requested project.

       Default stack:
       - HTML
       - CSS
       - JavaScript

       Use React / Next.js / Vue ONLY if explicitly requested.

       Rules:

       - Responsive
       - Modern UI
       - CSS Variables
       - Flexbox/Grid
       - Smooth Scroll
       - Hover Effects
       - Beautiful spacing
       - Single page unless user asks otherwise.

       IMAGES
       ======================
       Always use real Unsplash images.
       Never use placeholders.

       Return ONLY valid JSON.

       Schema:
   
       {
         "files": [
           {
             "name": "index.html",
             "content": "..."
           },
           {
             "name": "style.css",
             "content": "..."
           },
           {
             "name": "script.js",
             "content": "..."
           }
         ]
       }

       Rules:
   
       - Output must start with {
       - Output must end with }
       - No markdown
       - No explanation
       - No extra text
       - No \`\`\`
       - Never mention intent

       User Request:
       ${state.prompt}
    `;
   console.log("G. code generation started");
    const res = await llm.invoke(prompt)
    console.log("H. LLM finished");
    console.log("Response length:", res.content.length);
    console.log("First 500 chars:");
    console.log(res.content.substring(0, 500));
    const data = JSON.parse(res.content)
    console.log("I. JSON parsed");
    
    await deductCredits(state.userId, "coding")  // Deduct credits for the user
    return {
        ...state,
        aiResponse: "Code Generated Successfully",
        artifacts: [
            {
                id: Date.now(),
                type: "Project",
                files: data.files || [],
                title: state.prompt
            }
        ]
    }


  }

  const res = await llm.invoke(`
    The user's request is:

    ${intent}

    Return Markdown only.

    Never generate project files.

    Use headings like:

    # Overview

    ## Explanation

    ## Problems

    ## Improvements

    ## Best Practices

    ## Optimized Code (if needed)

    User Request:

    ${state.prompt}
  `)

  const data = res.content
  await deductCredits(state.userId, "coding")  // Deduct credits for the user
  return {
    ...state,
    aiResponse: data,
    artifacts: []  
  }
 } catch (error) {
    console.error("Coding Agent Error:", error);
  console.error("Response:", error?.response?.data);

    return {
        ...state,
        artifacts: [], 
        aiResponse: error?.data?.message || "❌ Failed to generate code. Please try again later.",
      }  
  }
} 
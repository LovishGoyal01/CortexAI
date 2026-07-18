import { getModel } from "../config/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";

export const codingAgent = async (state) => {

  const intentllm = await getModel("intent");
  const llm = await getModel("coding");

  const intentRes = await intentllm.invoke(`
    You are an intent classifier.

    Return ONLY one of these values.

    PROJECT_GENERATION
    CODE_GENERATION   
    CODE_REVIEW
    CODE_EXPLANATION
    DEBUGGING
    OPTIMIZATION
    CONVERSION
    DOCUMENTATION

    Definitions:

    1. PROJECT_GENERATION
  - The user wants an entire application, website, project, dashboard, API, clone, or folder structure.

  - Examples:
  - Build a Netflix clone
  - Create a React Todo App
  - Build an Express REST API
  - Create a Portfolio Website
  - Build a MERN Chat App

  2. CODE_GENERATION
  - The user wants a standalone code snippet, function, class, algorithm, SQL query, script, or program.

  - Examples:
  - Write BFS in C++
  - Binary Search in Java
  - Python merge sort
  - SQL query for highest salary
  - Java

    User Request:
    ${state.prompt}
  `)

  const intent = intentRes.content
  
  if (intent == "PROJECT_GENERATION") {
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

    const res = await llm.invoke(prompt)
    const data = JSON.parse(res.content)
    
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

  
   if (intent == "CODE_GENERATION") {
    const prompt = `
    Rules:
    - For simple questions, greetings, and short queries, respond naturally in plain text.
    - For technical, educational, coding, or detailed topics, use clean Markdown. 

    Formatting:
    - Use # for titles and ## for sections.
    - Leave a blank line after headings.
    - Use bullet points for lists.
    - Use numbered lists for steps.
    - Use fenced code blocks with language tags for code.
    - Keep paragraphs short and readable.
    - Never write headings and content on the same line.
    - Never generate large walls of text.

       User Request:
       ${state.prompt}
    `;

    const res = await llm.invoke(prompt)
    const data = res.content
    await deductCredits(state.userId, "coding")  // Deduct credits for the user

     return {
      ...state,
      aiResponse: data,
      artifacts: []  
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
}
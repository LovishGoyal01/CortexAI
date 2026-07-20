import { getModel } from "../config/llmModels.js";
import { generatePpt } from "../utils/generatePpt.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentlimit.js";

export const pptAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId, "ppt")  // Check if the user has exceeded the ppt limit
    const llm = await getModel("ppt");

    const prompt = `
You are a professional presentation designer.

Return ONLY valid JSON.

Format:

{
  "title": "",
  "subtitle": "",
  "slides": [
    {
      "title": "",
      "points": [
        "",
        "",
        "",
        ""
      ]
    }
  ]
}

Rules:

- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.

Topic:

${state.prompt}
`;
    const res = await llm.invoke(prompt);
    const data = JSON.parse(res.content);
    const ppt =await generatePpt(data);

    const buffer = await ppt.write({
      outputType: "nodebuffer",
    })

    const fileName = `ppt-${Date.now()}.pptx`;
    await uploadToS3(fileName, buffer, "application/vnd.openxmlformats-officedocument.presentationml.presentation");

    const downloadUrl = await getFromS3(fileName,24*60);
    await deductCredits(state.userId, "ppt")  // Deduct credits for the user

    return {
  ...state,
  aiResponse: `# ✅ Presentation Generated

**${data.title}**

📥 [Download PPT](${downloadUrl})

_Link expires in 10 minutes._
`
}
  } catch (error) {
    
      return {
        ...state,
        aiResponse: error?.data?.message || "❌ Failed to generate PPT. Please try again later.",
      }  
    
  }
};
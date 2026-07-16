import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/momory.js";

export const agent = async (req, res) => {
   try {
      const { prompt, conversationId, agent } = req.body;

      await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
         role: "user",
         content: prompt,
         conversationId
      });

      const result = await graph.invoke({  // this is state
        conversationId,
        prompt,
        agent
      })
      
      await addMessage(conversationId, "user", prompt)  // IN Redis
      await addMessage(conversationId, "assistant", result.aiResponse) // IN Redis

      await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
         role: "assistant",
         content: result?.aiResponse,
         conversationId,
         images: result?.images,
         artifacts: result?.artifacts
      });

      return res.status(200).json({
         answer: result?.aiResponse,
         images:  result?.images,
         Artifacts: result?.artifacts
      });
   } catch (error) {
      console.error("Error saving message:", error);
      res.status(500).json({ message: `agent error: ${error}` });
   }
}   
import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/momory.js";

export const agent = async (req, res) => {
   try {
      const { prompt, conversationId, agent } = req.body;
      const file = req.file;  // Get the uploaded file from the request
      const userId = req.headers["x-user-id"];  // get the user id from the header

      await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
         role: "user",
         content: prompt,
         conversationId
      });

      const result = await graph.invoke({  // this is state
        conversationId,
        prompt,
        agent,
        userId,
         file  // Pass the uploaded file to the graph
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
         artifacts: result?.artifacts
      });
   } catch (error) {
      res.status(500).json({ message: `agent error: ${error}` });
   }
}   
import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/momory.js";

export const agent = async (req, res, next) => {
   try {
      const { prompt, conversationId, agent } = req.body;
      const file = req.file;  // Get the uploaded file from the request
      const userId = req.headers["x-user-id"];  // get the user id from the header

      console.log("1. Request received");

      await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
         role: "user",
         content: prompt,
         conversationId
      });
      console.log("2. User message saved");
      console.log("3. Before graph");

      const result = await graph.invoke({  // this is state
        conversationId,
        prompt,
        agent,
        userId,
         file  // Pass the uploaded file to the graph
      })
      console.log("4. After graph");
      
      await addMessage(conversationId, "user", prompt)  // IN Redis
      await addMessage(conversationId, "assistant", result.aiResponse) // IN Redis

      await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
         role: "assistant",
         content: result?.aiResponse,
         conversationId,
         images: result?.images,
         artifacts: result?.artifacts
      });

      console.log("5. Assistant saved");

      return res.status(200).json({
         answer: result?.aiResponse,
         images:  result?.images,
         artifacts: result?.artifacts
      });
   } catch (error) {
     next(error);  // Pass the error to the error handling middleware
   }
}   
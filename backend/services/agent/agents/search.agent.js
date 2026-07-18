import { searchTool } from "../config/tavily.js";
import { deductCredits } from "../utils/deductCredits.js";


export const searchAgent = async (state) => {

  try {
    const tool = searchTool();         // i created a instance of tavily
    const results = await tool.invoke({
      query: state.prompt,
    });
    
    await deductCredits(state.userId, "search")  // Deduct credits for the user
    return {
      ...state,
      searchResults: results,
      images: results.images,
    };
  } catch (error) {
    return {
      ...state,
      searchResults: [],
      images: [],
    };
  }
};
import { searchTool } from "../config/tavily.js";


export const searchAgent = async (state) => {
  console.log("✅ Search Agent Invoked");

  try {
    const tool = searchTool();         // i created a instance of tavily
    const results = await tool.invoke({
      query: state.prompt,
    });

    return {
      ...state,
      searchResults: results,
      images: results.images,
    };
  } catch (error) {
    console.error("❌ Search Tool Error:");
    console.error(error);
    return {
      ...state,
      searchResults: [],
      images: [],
    };
  }
};
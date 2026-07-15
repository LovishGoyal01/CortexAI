import api from "../../utils/axios";

const getCurrentUser = async () => {
    try {
      const { data } = await api.get("/api/me", { withCredentials: true });
      return data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null; // Return null or handle the error as needed
    }
};

export default getCurrentUser;
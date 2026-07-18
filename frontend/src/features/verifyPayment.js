import api from "../../utils/axios";

export const verifyPayment = async (payload) => {
  try {
    const { data: response } = await api.post("/api/billing/verify", payload);
    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
};
import api from "../../utils/axios";

export const createOrder = async (plan) => {
  try {
    const { data: response } = await api.post("/api/billing/create", { plan });
    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
};
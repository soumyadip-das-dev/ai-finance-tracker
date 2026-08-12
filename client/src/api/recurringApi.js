import API from "./axios";

export const fetchRecurringApi = async () => {
  const { data } = await API.get("/recurring");
  return data;
};

export const addRecurringApi = async (recurringData) => {
  const { data } = await API.post("/recurring", recurringData);
  return data;
};

export const toggleRecurringApi = async (id) => {
  const { data } = await API.patch(`/recurring/${id}/toggle`);
  return data;
};

export const deleteRecurringApi = async (id) => {
  const { data } = await API.delete(`/recurring/${id}`);
  return data;
};

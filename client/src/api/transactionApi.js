import API from "./axios";

export const fetchTransactionsApi = async () => {
  const { data } = await API.get("/transactions");
  return data;
};

export const addTransactionApi = async (transactionData) => {
  const { data } = await API.post("/transactions", transactionData);
  return data;
};

export const updateTransactionApi = async (id, transactionData) => {
  const { data } = await API.put(`/transactions/${id}`, transactionData);
  return data;
};

export const deleteTransactionApi = async (id) => {
  const { data } = await API.delete(`/transactions/${id}`);
  return data;
};

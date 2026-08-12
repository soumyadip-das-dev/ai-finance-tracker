import API from "./axios";

export const fetchBudgetsApi = async (month) => {
  const { data } = await API.get("/budgets", { params: { month } });
  return data;
};

export const setBudgetApi = async (budgetData) => {
  const { data } = await API.post("/budgets", budgetData);
  return data;
};

export const deleteBudgetApi = async (id) => {
  const { data } = await API.delete(`/budgets/${id}`);
  return data;
};

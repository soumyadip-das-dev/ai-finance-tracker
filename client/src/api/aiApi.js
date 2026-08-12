import API from "./axios";

export const fetchAIAnalysisApi = async () => {
  const { data } = await API.get("/ai/analyze");
  return data;
};

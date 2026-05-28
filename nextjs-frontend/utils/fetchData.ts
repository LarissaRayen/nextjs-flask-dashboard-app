import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api";

export async function getData() {
  const response = await axios.get(`${API_URL}/orders`);
  return response.data;
}

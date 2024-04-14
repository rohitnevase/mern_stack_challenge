import axios from "axios";
export const baseUrl = "http://localhost:5454";

export const getAllProducts = async (page, searchText, month) => {
  try {
    const result = await axios.get(
      `${baseUrl}/product/transactions?month=${month}&page=${page}&perPage=10&searchText=${searchText}`
    );
    return result.data;
  } catch (err) {
    return;
  }
};

export const getBarChartValues = async month => {
  try {
    const result = await axios.get(`${baseUrl}/product/bar-chart?month=${month}`);
    return result.data;
  } catch (err) {
    return;
  }
};

export const getPieChartValues = async month => {
  try {
    const result = await axios.get(`${baseUrl}/product/pie-chart?month=${month}`);
    return result.data;
  } catch (err) {
    return;
  }
};

export const getStatistics = async month => {
  try {
    const result = await axios.get(`${baseUrl}/product/statistics?month=${month}`);
    return result.data;
  } catch (err) {
    return;
  }
};

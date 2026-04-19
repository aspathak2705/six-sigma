import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

export const analyzeManual = async (values) => {
  const response = await api.post('/analyze', { values });
  return response.data;
};

export const uploadReport = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData);
  return response.data;
};

export const getParameters = async () => {
  const response = await api.get('/parameters');
  return response.data;
};

export const exportToExcel = async (results) => {
  const response = await api.post('/export', { results }, {
    responseType: 'blob'
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Sigma_Report.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  
  return response.data;
};

import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

/** POST /api/analyze — manual entry */
export const analyzeManual = (values) =>
  api.post('/analyze', { values }).then((r) => r.data)

/** POST /api/upload — file upload with OCR */
export const uploadReport = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)
}

/** GET /api/parameters — list of supported params */
export const getParameters = () =>
  api.get('/parameters').then((r) => r.data.parameters)

/** POST /api/export — download Excel */
export const exportToExcel = async (results) => {
  const response = await api.post('/export', { results }, { responseType: 'blob' })
  const url  = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href  = url
  link.setAttribute('download', 'sigma_analysis.xlsx')
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

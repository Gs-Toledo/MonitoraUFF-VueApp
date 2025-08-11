import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL_MONITORA_BACKEND
})

export class MonitoraAPiService {
  static async downloadGravações(
    cameras: { zoneminderInstanceId: number; cameraId: number }[],
    startDate: string,
    endDate: string
  ) {
    const apiUrl = '/export/zip'
    const body = {
      cameras,
      startDate,
      endDate
    }

    try {
      const response = await axiosInstance.post(apiUrl, body, {
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: 'application/zip' })

      const downloadUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = downloadUrl

      const contentDisposition = response.headers['content-disposition']
      let fileName = `export_${new Date().toISOString().split('T')[0]}.zip` 

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
        if (fileNameMatch && fileNameMatch.length > 1) {
          fileName = fileNameMatch[1]
        }
      }
      link.setAttribute('download', fileName)

      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(downloadUrl)

      return { success: true, fileName }
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error)
      throw error
    }
  }
}

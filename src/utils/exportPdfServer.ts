import { API_CONFIG } from '../constants'
import type { Config } from '../calc/finance'

export async function exportReportToPdfServer(config: Config) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PDF_EXPORT}`

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT * 3), // PDF generation may take longer
    })

    if (!res.ok) {
        const msg = await res.text()
        alert('Error generating PDF: ' + msg)
        return
    }

    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = 'apartment-report.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(blobUrl)
}

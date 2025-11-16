import { API_CONFIG } from '../constants'
import type { Config } from '../calc/finance'

export async function exportSaleSummaryPdfServer(
    config: Config,
    amount: number,
    currency: 'EUR' | 'MDL'
) {
    if (!amount || amount <= 0) {
        alert('Please enter a positive sale price.')
        return
    }

    const url = `${API_CONFIG.BASE_URL}/pdf/sale-summary`

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, amount, currency }),
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT * 3), // PDF generation may take longer
    })

    if (!res.ok) {
        const msg = await res.text()
        alert('Error generating sale summary PDF: ' + msg)
        return
    }

    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = 'sale-summary.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(blobUrl)
}

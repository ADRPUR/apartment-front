export function downloadCsv(
  filename: string,
  rows: (string | number)[][]
) {
  const toCsv = (r: (string | number)[]) =>
    r
      .map(v => {
        const s = String(v ?? '')
        return /[",\n]/.test(s)
          ? `"${s.replace(/"/g, '""')}"`
          : s
      })
      .join(',')

  const csv = rows.map(toCsv).join('\n')
  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;'
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}


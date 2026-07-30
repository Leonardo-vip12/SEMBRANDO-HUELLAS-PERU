type NumberFormatType = 'integer' | 'decimal' | 'compact' | 'percentage'

interface FormatNumberOptions {
  type?: NumberFormatType
  locale?: string
}

export function formatNumber(
  value: number,
  options: FormatNumberOptions = {}
): string {
  const { type = 'integer', locale = 'es' } = options

  switch (type) {
    case 'integer':
      return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value)
    case 'decimal':
      return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
    case 'compact':
      return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value)
    case 'percentage':
      return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(value / 100)
  }
}

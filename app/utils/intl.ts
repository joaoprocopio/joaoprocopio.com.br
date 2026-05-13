const DEFAULT_LOCALE = 'en-US'

const THRESHOLDS = [
  { unit: 'year', ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: 'month', ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: 'week', ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: 'day', ms: 24 * 60 * 60 * 1000 },
  { unit: 'hour', ms: 60 * 60 * 1000 },
  { unit: 'minute', ms: 60 * 1000 },
] as const satisfies { unit: Intl.RelativeTimeFormatUnit; ms: number }[]

export function formatDate(date: Date) {
  const dtf = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    dateStyle: 'medium',
  })

  return dtf.format(date)
}

export function formatRelativeTime(date: Date) {
  const rtf = new Intl.RelativeTimeFormat(DEFAULT_LOCALE, {
    style: 'long',
    numeric: 'auto',
  })

  const diff = date.getTime() - Date.now()
  const abs = Math.abs(diff)

  for (const threshold of THRESHOLDS) {
    if (abs >= threshold.ms) {
      return rtf.format(Math.round(diff / threshold.ms), threshold.unit)
    }
  }

  return rtf.format(Math.round(diff / 1000), 'minute')
}

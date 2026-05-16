/* ── Deterministic PRNG (mulberry32) ─────────────────────────────────────── */
export function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ── Number / currency formatters ────────────────────────────────────────── */
export function fmtUSD(n: number, opts: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    ...opts,
  }).format(n)
}

export function fmtUSDK(n: number) {
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n)
  if (abs >= 1e6) return sign + '$' + (abs / 1e6).toFixed(2) + 'M'
  if (abs >= 1e3) return sign + '$' + (abs / 1e3).toFixed(1) + 'k'
  return fmtUSD(n, { maximumFractionDigits: 0 })
}

export function fmtPct(n: number, digits = 2) {
  return (n >= 0 ? '+' : '') + n.toFixed(digits) + '%'
}

export function fmtDate(d: string | number, opts: Intl.DateTimeFormatOptions = {}) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...opts,
  })
}

/* ── Money math (cents) ───────────────────────────────────────────────────── */
export function centsToDollars(cents: number) {
  return cents / 100
}

export function dollarsToCents(dollars: number) {
  return Math.round(dollars * 100)
}

export function fmtCents(cents: number, opts: Intl.NumberFormatOptions = {}) {
  return fmtUSD(centsToDollars(cents), opts)
}

/* ── Portfolio series generator ──────────────────────────────────────────── */
export interface SeriesPoint {
  ts: number
  date: string
  value: number
}

export function generateSeries(today = new Date('2026-05-16T00:00:00')): SeriesPoint[] {
  const rand = mulberry32(7)
  const start = 348000
  const end = 487294
  const days = 730
  const out: SeriesPoint[] = []
  let v = start

  for (let i = days; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const driftBase = (end - start) / days
    const wave = Math.sin(i / 42) * 1800 + Math.cos(i / 17) * 600
    const noise = (rand() - 0.5) * 2400
    v += driftBase + wave * 0.04 + noise * 0.45
    if (i === 412 || i === 411 || i === 410) v -= 4200
    out.push({ ts: +d, date: d.toISOString().slice(0, 10), value: v })
  }

  const offset = out[out.length - 1].value - end
  return out.map((p, i) => ({ ...p, value: Math.round(p.value - offset * (i / days)) }))
}

/* ── Spark data helper ───────────────────────────────────────────────────── */
export function mkSpark(seed: number, trend: number): { v: number }[] {
  const r = mulberry32(seed)
  const out: { v: number }[] = []
  let v = 100
  for (let i = 0; i < 22; i++) {
    v += (r() - 0.5) * 6 + trend
    out.push({ v })
  }
  return out
}

/* ── Date label helper ───────────────────────────────────────────────────── */
function toLocalDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function dayLabel(dateStr: string, today = new Date('2026-05-16T00:00:00')) {
  const todayStr = toLocalDateStr(today)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const yesterdayStr = toLocalDateStr(yesterday)

  if (dateStr === todayStr) return 'Today'
  if (dateStr === yesterdayStr) return 'Yesterday'
  // Parse the date string as local time to avoid UTC offset issues
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

/* ── Class name merger (minimal, no clsx dep needed) ─────────────────────── */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

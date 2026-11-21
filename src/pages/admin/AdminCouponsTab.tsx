import { useCallback, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import {
  listAdminCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  AdminCoupon,
} from '@/lib/admin/service'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { formatPrice } from '@/data/repository'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/** Aba Cupons do painel: CRUD simples (código, tipo, valor, mínimo). */
export default function AdminCouponsTab() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)

  const [list, setList] = useState<AdminCoupon[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [kind, setKind] = useState<'percent' | 'fixed'>('percent')
  const [value, setValue] = useState('')
  const [minSubtotal, setMinSubtotal] = useState('0')
  const [busy, setBusy] = useState(false)

  const reload = useCallback(async () => {
    try {
      setList(await listAdminCoupons())
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  async function run(id: string | null, action: () => Promise<void>) {
    if (id) setBusyId(id)
    setError(null)
    try {
      await action()
      await reload()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setBusy(true)
          createCoupon({
            code: code.trim(),
            kind,
            value: Number(value) || 0,
            minSubtotal: Number(minSubtotal) || 0,
          })
            .then(() => {
              setCode('')
              setValue('')
              setMinSubtotal('0')
              return reload()
            })
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setBusy(false))
        }}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-border/60 bg-card p-5"
      >
        <div className="min-w-28 space-y-1">
          <Label htmlFor="coup-code" className="text-xs text-muted-foreground">
            {t('admin.couponCode')}
          </Label>
          <Input
            id="coup-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
            className="bg-background uppercase"
          />
        </div>
        <div className="min-w-28 space-y-1">
          <Label htmlFor="coup-kind" className="text-xs text-muted-foreground">
            {t('admin.couponKind')}
          </Label>
          <select
            id="coup-kind"
            value={kind}
            onChange={(e) => setKind(e.target.value as 'percent' | 'fixed')}
            className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
          >
            <option value="percent">{t('admin.couponPercent')}</option>
            <option value="fixed">{t('admin.couponFixed')}</option>
          </select>
        </div>
        <div className="min-w-20 space-y-1">
          <Label htmlFor="coup-value" className="text-xs text-muted-foreground">
            {t('admin.couponValue')}
          </Label>
          <Input
            id="coup-value"
            type="number"
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="w-24 bg-background"
          />
        </div>
        <div className="min-w-20 space-y-1">
          <Label htmlFor="coup-min" className="text-xs text-muted-foreground">
            {t('admin.couponMinSubtotal')}
          </Label>
          <Input
            id="coup-min"
            type="number"
            step="0.01"
            min="0"
            value={minSubtotal}
            onChange={(e) => setMinSubtotal(e.target.value)}
            className="w-24 bg-background"
          />
        </div>
        <Button type="submit" disabled={busy} className="bg-primary hover:bg-primary/90">
          {t('admin.couponNew')}
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {!list && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}

      <ul className="space-y-2">
        {list?.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-card p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="font-serif text-foreground">{c.code}</p>
              <p className="text-[11px] text-muted-foreground">
                {c.kind === 'percent' ? `${c.value}%` : formatPrice(c.value, locale)}
                {' · '}
                {t('admin.couponMinSubtotal')}: {formatPrice(c.minSubtotal, locale)}
              </p>
            </div>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={c.active}
                disabled={busyId === c.id}
                onChange={(e) => run(c.id, () => updateCoupon(c.id, { active: e.target.checked }))}
                className="h-4 w-4 accent-primary"
              />
              {t('admin.productActive')}
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busyId === c.id}
              onClick={() => {
                if (window.confirm(t('admin.couponDeleteConfirm'))) {
                  run(c.id, () => deleteCoupon(c.id))
                }
              }}
              className="text-destructive hover:text-destructive"
            >
              {t('account.delete')}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

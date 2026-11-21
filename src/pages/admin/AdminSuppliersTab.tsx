/**
 * Aba FORNECEDORES do admin — Etapa 5. CRUD da coleção privada `suppliers`
 * (regras API: só administradoras — nada público). Modalidade com as 5
 * opções do briefing e status de homologação. Nenhum dado de fornecedor é
 * inventado: tudo vem do que a administradora preencher.
 */
import { useCallback, useEffect, useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import pb from '@/lib/pocketbase/client'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export interface AdminSupplier {
  id: string
  slug: string
  legalName: string
  tradeName: string
  country: string
  region: string
  contactName: string
  contactEmail: string
  contactPhone: string
  website: string
  categories: string[]
  modality: SupplierModality | ''
  commercialTerms: string
  processingDays: number | null
  deliveryTerms: string
  returnPolicy: string
  taxInfo: string
  homologationStatus: SupplierHomologation
  notes: string
  active: boolean
}

export type SupplierModality =
  | 'national_direct'
  | 'international_direct'
  | 'wholesale_distributor'
  | 'own_brand'
  | 'fulfillment_partner'

export type SupplierHomologation = 'pending' | 'approved' | 'blocked'

const MODALITIES: SupplierModality[] = [
  'national_direct',
  'international_direct',
  'wholesale_distributor',
  'own_brand',
  'fulfillment_partner',
]

const HOMOLOGATIONS: SupplierHomologation[] = ['pending', 'approved', 'blocked']

const EMPTY_FORM = {
  slug: '',
  legalName: '',
  tradeName: '',
  country: '',
  region: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  website: '',
  categoriesText: '',
  modality: 'national_direct' as SupplierModality,
  commercialTerms: '',
  processingDays: '',
  deliveryTerms: '',
  returnPolicy: '',
  taxInfo: '',
  homologationStatus: 'pending' as SupplierHomologation,
  notes: '',
  active: true,
}

type SupplierForm = typeof EMPTY_FORM

export default function AdminSuppliersTab() {
  const { locale } = useLocale()
  const t = (key: string) => shopT(locale, key)
  const [suppliers, setSuppliers] = useState<AdminSupplier[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [editing, setEditing] = useState<AdminSupplier | 'new' | null>(null)
  const [busy, setBusy] = useState(false)

  const reload = useCallback(async () => {
    try {
      const recs = await pb.collection('suppliers').getFullList({ sort: 'legalName' })
      setSuppliers(recs.map(mapSupplier))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  async function handleDelete(id: string) {
    if (!window.confirm(t('admin.suppliers.deleteConfirm'))) return
    setBusy(true)
    setError(null)
    try {
      await pb.collection('suppliers').delete(id)
      await reload()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (error && !suppliers) return <p className="text-sm text-destructive">{error}</p>
  if (!suppliers) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        {t('account.loading')}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-serif text-lg text-foreground">{t('admin.suppliers.title')}</p>
          <p className="text-xs text-muted-foreground">{t('admin.suppliers.hint')}</p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => setEditing('new')}
          className="gap-1.5 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          {t('admin.suppliers.new')}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-xs text-primary">{message}</p>}

      {editing && (
        <SupplierForm
          supplier={editing === 'new' ? null : editing}
          onDone={async (savedMessage) => {
            setEditing(null)
            setMessage(savedMessage ?? null)
            await reload()
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      {!suppliers.length ? (
        <p className="text-sm text-muted-foreground">{t('admin.suppliers.none')}</p>
      ) : (
        <div className="space-y-2">
          {suppliers.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-card px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {s.legalName || s.slug}
                  {s.tradeName ? ` · ${s.tradeName}` : ''}
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.country || '—'}
                  {s.modality ? ` · ${t(`admin.suppliers.modality.${s.modality}`)}` : ''}
                  {` · ${t(`admin.suppliers.homologation.${s.homologationStatus}`)}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    'rounded-full px-2 py-0.5 text-[11px] font-medium ' +
                    (s.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')
                  }
                >
                  {t('admin.suppliers.active')}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(s)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {t('admin.suppliers.edit')}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={busy}
                  onClick={() => handleDelete(s.id)}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  {t('account.delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SupplierForm({
  supplier,
  onDone,
  onCancel,
}: {
  supplier: AdminSupplier | null
  onDone: (savedMessage?: string) => void
  onCancel: () => void
}) {
  const { locale } = useLocale()
  const t = (key: string) => shopT(locale, key)
  const [form, setForm] = useState<SupplierForm>(() =>
    supplier ? formFromSupplier(supplier) : { ...EMPTY_FORM },
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof SupplierForm>(key: K, value: SupplierForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const payload = {
      slug: form.slug.trim(),
      legalName: form.legalName.trim(),
      tradeName: form.tradeName.trim(),
      country: form.country.trim(),
      region: form.region.trim(),
      contactName: form.contactName.trim(),
      contactEmail: form.contactEmail.trim(),
      contactPhone: form.contactPhone.trim(),
      website: form.website.trim(),
      categories: form.categoriesText
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      modality: form.modality,
      commercialTerms: form.commercialTerms.trim(),
      processingDays: form.processingDays === '' ? null : Number(form.processingDays),
      deliveryTerms: form.deliveryTerms.trim(),
      returnPolicy: form.returnPolicy.trim(),
      taxInfo: form.taxInfo.trim(),
      homologationStatus: form.homologationStatus,
      notes: form.notes.trim(),
      active: form.active,
    }
    try {
      if (supplier) {
        await pb.collection('suppliers').update(supplier.id, payload)
        onDone(t('admin.suppliers.saved'))
      } else {
        await pb.collection('suppliers').create(payload)
        onDone(t('admin.suppliers.created'))
      }
    } catch (err) {
      setError(getErrorMessage(err))
      setBusy(false)
    }
  }

  const textField = (
    key: keyof SupplierForm,
    labelKey: string,
    opts?: { required?: boolean; type?: string },
  ) => (
    <div className="space-y-1">
      <Label htmlFor={`supplier-${key}`} className="text-xs text-muted-foreground">
        {t(labelKey)}
      </Label>
      <Input
        id={`supplier-${key}`}
        type={opts?.type ?? 'text'}
        required={opts?.required}
        value={String(form[key] ?? '')}
        onChange={(e) => set(key, e.target.value as SupplierForm[typeof key])}
        className="bg-background"
      />
    </div>
  )

  const textArea = (key: keyof SupplierForm, labelKey: string) => (
    <div className="space-y-1 sm:col-span-2">
      <Label htmlFor={`supplier-${key}`} className="text-xs text-muted-foreground">
        {t(labelKey)}
      </Label>
      <textarea
        id={`supplier-${key}`}
        rows={2}
        value={String(form[key] ?? '')}
        onChange={(e) => set(key, e.target.value as SupplierForm[typeof key])}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  )

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-primary/40 bg-primary/5 p-5"
    >
      <p className="text-sm font-medium text-foreground">
        {supplier ? t('admin.suppliers.edit') : t('admin.suppliers.new')}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {textField('slug', 'admin.slug', { required: true })}
        {textField('legalName', 'admin.suppliers.legalName')}
        {textField('tradeName', 'admin.suppliers.tradeName')}
        {textField('country', 'admin.suppliers.country')}
        {textField('region', 'admin.suppliers.region')}
        {textField('contactName', 'admin.suppliers.contactName')}
        {textField('contactEmail', 'admin.suppliers.contactEmail', { type: 'email' })}
        {textField('contactPhone', 'admin.suppliers.contactPhone')}
        {textField('website', 'admin.suppliers.website')}
        {textField('categoriesText', 'admin.suppliers.categories')}
        {textField('processingDays', 'admin.suppliers.processingDays', { type: 'number' })}
        <div className="space-y-1">
          <Label htmlFor="supplier-modality" className="text-xs text-muted-foreground">
            {t('admin.suppliers.modality')}
          </Label>
          <select
            id="supplier-modality"
            value={form.modality}
            onChange={(e) => set('modality', e.target.value as SupplierModality)}
            className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {MODALITIES.map((m) => (
              <option key={m} value={m}>
                {t(`admin.suppliers.modality.${m}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="supplier-homologation" className="text-xs text-muted-foreground">
            {t('admin.suppliers.homologation')}
          </Label>
          <select
            id="supplier-homologation"
            value={form.homologationStatus}
            onChange={(e) => set('homologationStatus', e.target.value as SupplierHomologation)}
            className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {HOMOLOGATIONS.map((h) => (
              <option key={h} value={h}>
                {t(`admin.suppliers.homologation.${h}`)}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 pt-5 text-sm text-foreground">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => set('active', e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          {t('admin.suppliers.active')}
        </label>
        {textArea('commercialTerms', 'admin.suppliers.commercialTerms')}
        {textArea('deliveryTerms', 'admin.suppliers.deliveryTerms')}
        {textArea('returnPolicy', 'admin.suppliers.returnPolicy')}
        {textArea('taxInfo', 'admin.suppliers.taxInfo')}
        {textArea('notes', 'admin.suppliers.notes')}
      </div>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={busy} className="bg-primary hover:bg-primary/90">
          {t('account.save')}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="text-muted-foreground">
          {t('account.cancel')}
        </Button>
        {busy && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" aria-hidden />}
      </div>
    </form>
  )
}

function formFromSupplier(s: AdminSupplier): SupplierForm {
  return {
    slug: s.slug,
    legalName: s.legalName,
    tradeName: s.tradeName,
    country: s.country,
    region: s.region,
    contactName: s.contactName,
    contactEmail: s.contactEmail,
    contactPhone: s.contactPhone,
    website: s.website,
    categoriesText: s.categories.join(', '),
    modality: s.modality || 'national_direct',
    commercialTerms: s.commercialTerms,
    processingDays: s.processingDays == null ? '' : String(s.processingDays),
    deliveryTerms: s.deliveryTerms,
    returnPolicy: s.returnPolicy,
    taxInfo: s.taxInfo,
    homologationStatus: s.homologationStatus,
    notes: s.notes,
    active: s.active,
  }
}

function mapSupplier(r: Record<string, unknown>): AdminSupplier {
  const modality = String(r.modality ?? '') as SupplierModality | ''
  const homologation = String(r.homologationStatus ?? 'pending') as SupplierHomologation
  return {
    id: String(r.id),
    slug: String(r.slug ?? ''),
    legalName: String(r.legalName ?? ''),
    tradeName: String(r.tradeName ?? ''),
    country: String(r.country ?? ''),
    region: String(r.region ?? ''),
    contactName: String(r.contactName ?? ''),
    contactEmail: String(r.contactEmail ?? ''),
    contactPhone: String(r.contactPhone ?? ''),
    website: String(r.website ?? ''),
    categories: Array.isArray(r.categories) ? r.categories.map(String) : [],
    modality: MODALITIES.includes(modality as SupplierModality) ? modality : '',
    commercialTerms: String(r.commercialTerms ?? ''),
    processingDays: r.processingDays != null ? Number(r.processingDays) : null,
    deliveryTerms: String(r.deliveryTerms ?? ''),
    returnPolicy: String(r.returnPolicy ?? ''),
    taxInfo: String(r.taxInfo ?? ''),
    homologationStatus: HOMOLOGATIONS.includes(homologation) ? homologation : 'pending',
    notes: String(r.notes ?? ''),
    active: Boolean(r.active),
  }
}

/**
 * Aba COLEÇÕES TEMÁTICAS do admin — Etapa 5. Listagem, criação e edição das
 * coleções (nome por idioma, descrição, slug, ativo). Edita a coleção
 * `collections` (leitura pública só para ativas; escrita só admin).
 */
import { useEffect, useState } from 'react'
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import { Locale } from '@/i18n/types'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface AdminCollection {
  id: string
  slug: string
  title: Record<Locale, string>
  description: Record<Locale, string>
  sortOrder: number
  active: boolean
}

interface Draft {
  id: string | null
  slug: string
  title: { 'pt-br': string; es: string; 'en-gb': string }
  description: { 'pt-br': string; es: string; 'en-gb': string }
  sortOrder: number
  active: boolean
}

const LOCALES: Locale[] = ['pt-br', 'es', 'en-gb']

function emptyDraft(): Draft {
  return {
    id: null,
    slug: '',
    title: { 'pt-br': '', es: '', 'en-gb': '' },
    description: { 'pt-br': '', es: '', 'en-gb': '' },
    sortOrder: 0,
    active: true,
  }
}

function fromRecord(rec: AdminCollection): Draft {
  return {
    id: rec.id,
    slug: rec.slug ?? '',
    title: {
      'pt-br': rec.title?.['pt-br'] ?? '',
      es: rec.title?.es ?? '',
      'en-gb': rec.title?.['en-gb'] ?? '',
    },
    description: {
      'pt-br': rec.description?.['pt-br'] ?? '',
      es: rec.description?.es ?? '',
      'en-gb': rec.description?.['en-gb'] ?? '',
    },
    sortOrder: Number(rec.sortOrder ?? 0),
    active: Boolean(rec.active),
  }
}

async function listCollections(): Promise<AdminCollection[]> {
  const client = (await import('@/lib/pocketbase/client')).default
  const recs = await client.collection('collections').getFullList({ sort: 'sortOrder,slug' })
  return recs.map((r) => r as unknown as AdminCollection)
}

export default function AdminCollectionsTab() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)

  const [items, setItems] = useState<AdminCollection[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    listCollections()
      .then(setItems)
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  async function reload() {
    try {
      setItems(await listCollections())
      setError(null)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!draft) return
    setBusy(true)
    setError(null)
    try {
      const client = (await import('@/lib/pocketbase/client')).default
      const payload = {
        slug: draft.slug.trim(),
        title: draft.title,
        description: draft.description,
        sortOrder: draft.sortOrder,
        active: draft.active,
      }
      if (draft.id) {
        await client.collection('collections').update(draft.id, payload)
      } else {
        await client.collection('collections').create(payload)
      }
      setDraft(null)
      await reload()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  async function handleToggleActive(rec: AdminCollection) {
    try {
      const client = (await import('@/lib/pocketbase/client')).default
      await client.collection('collections').update(rec.id, { active: !rec.active })
      await reload()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function handleDelete(rec: AdminCollection) {
    try {
      const client = (await import('@/lib/pocketbase/client')).default
      await client.collection('collections').delete(rec.id)
      await reload()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (error && !items) {
    return <p className="text-sm text-destructive">{error}</p>
  }
  if (!items) {
    return <p className="text-sm text-muted-foreground">{t('account.loading')}</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {shopT(locale, 'admin.collections.count', { n: String(items.length) })}
        </p>
        <Button
          type="button"
          size="sm"
          onClick={() => setDraft(emptyDraft())}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          {t('admin.collections.new')}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      {draft && (
        <form onSubmit={handleSave} className="rounded-lg border border-border/60 bg-card p-5">
          <p className="text-sm font-medium text-foreground">
            {draft.id ? t('admin.collections.edit') : t('admin.collections.new')}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="col-slug" className="text-xs text-muted-foreground">
                {t('admin.collections.slug')}
              </Label>
              <Input
                id="col-slug"
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                required
                pattern="[a-z0-9\-]+"
                className="bg-background"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="col-sort" className="text-xs text-muted-foreground">
                {t('admin.collections.sortOrder')}
              </Label>
              <Input
                id="col-sort"
                type="number"
                min={0}
                value={draft.sortOrder}
                onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) || 0 })}
                className="bg-background"
              />
            </div>
            {LOCALES.map((loc) => (
              <div key={loc} className="space-y-1">
                <Label htmlFor={`col-title-${loc}`} className="text-xs text-muted-foreground">
                  {t('admin.collections.title')} — {loc}
                </Label>
                <Input
                  id={`col-title-${loc}`}
                  value={draft.title[loc]}
                  onChange={(e) =>
                    setDraft({ ...draft, title: { ...draft.title, [loc]: e.target.value } })
                  }
                  required={loc === 'pt-br'}
                  className="bg-background"
                />
              </div>
            ))}
            {LOCALES.map((loc) => (
              <div key={loc} className="space-y-1">
                <Label htmlFor={`col-desc-${loc}`} className="text-xs text-muted-foreground">
                  {t('admin.collections.description')} — {loc}
                </Label>
                <Input
                  id={`col-desc-${loc}`}
                  value={draft.description[loc]}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      description: { ...draft.description, [loc]: e.target.value },
                    })
                  }
                  className="bg-background"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                className="h-4 w-4 accent-[hsl(var(--primary))]"
              />
              {t('admin.collections.active')}
            </label>
            <Button
              type="submit"
              size="sm"
              disabled={busy}
              className="bg-primary hover:bg-primary/90"
            >
              {t('account.save')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDraft(null)}
              className="text-muted-foreground"
            >
              {t('account.cancel')}
            </Button>
            {busy && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" aria-hidden />
            )}
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">{t('admin.collections.slug')}</th>
              <th className="px-4 py-2.5 font-medium">{t('admin.collections.title')}</th>
              <th className="px-4 py-2.5 font-medium">{t('admin.collections.active')}</th>
              <th className="px-4 py-2.5 font-medium text-right">
                {t('admin.collections.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((rec) => (
              <tr key={rec.id} className="border-b border-border/40 last:border-0">
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{rec.slug}</td>
                <td className="px-4 py-2.5 text-foreground">
                  {rec.title?.['pt-br'] || rec.title?.es || rec.title?.['en-gb'] || '—'}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={cn(
                      'rounded px-2 py-0.5 text-xs font-medium',
                      rec.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {rec.active ? t('admin.common.yes') : t('admin.common.no')}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t('admin.collections.edit')}
                      onClick={() => setDraft(fromRecord(rec))}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t('admin.collections.toggle')}
                      onClick={() => handleToggleActive(rec)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      {rec.active ? '○' : '●'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t('admin.collections.delete')}
                      onClick={() => handleDelete(rec)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  {t('admin.collections.empty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

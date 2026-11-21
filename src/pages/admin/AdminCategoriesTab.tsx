import { useCallback, useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Loader2 } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import {
  listAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  AdminCategory,
} from '@/lib/admin/service'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/** Aba Categorias do painel: CRUD + reordenar (sortOrder). */
export default function AdminCategoriesTab() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)

  const [list, setList] = useState<AdminCategory[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [busy, setBusy] = useState(false)

  const reload = useCallback(async () => {
    try {
      setList(await listAdminCategories())
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

  function autoSlug(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const maxOrder = list?.reduce((acc, c) => Math.max(acc, c.sortOrder), 0) ?? 0

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setBusy(true)
          createCategory({
            slug: (slug || autoSlug(name)).slice(0, 60),
            title: name,
            sortOrder: maxOrder + 1,
          })
            .then(() => {
              setName('')
              setSlug('')
              return reload()
            })
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setBusy(false))
        }}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-border/60 bg-card p-5"
      >
        <div className="min-w-40 flex-1 space-y-1">
          <Label htmlFor="cat-name" className="text-xs text-muted-foreground">
            {t('admin.categoryName')}
          </Label>
          <Input
            id="cat-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-background"
          />
        </div>
        <div className="min-w-40 flex-1 space-y-1">
          <Label htmlFor="cat-slug" className="text-xs text-muted-foreground">
            {t('admin.productSlug')}
          </Label>
          <Input
            id="cat-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={autoSlug(name)}
            className="bg-background"
          />
        </div>
        <Button type="submit" disabled={busy} className="bg-primary hover:bg-primary/90">
          {t('admin.categoryNew')}
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {!list && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}

      <ul className="space-y-2">
        {list?.map((c, i) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-card p-4"
          >
            <div className="flex flex-col gap-1">
              <button
                type="button"
                aria-label={t('admin.moveUp')}
                disabled={i === 0 || busyId === c.id}
                onClick={() =>
                  run(c.id, () =>
                    updateCategory(c.id, { sortOrder: list[i - 1].sortOrder }).then(() =>
                      updateCategory(list[i - 1].id, { sortOrder: c.sortOrder }),
                    ),
                  )
                }
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={t('admin.moveDown')}
                disabled={i === list.length - 1 || busyId === c.id}
                onClick={() =>
                  run(c.id, () =>
                    updateCategory(c.id, { sortOrder: list[i + 1].sortOrder }).then(() =>
                      updateCategory(list[i + 1].id, { sortOrder: c.sortOrder }),
                    ),
                  )
                }
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-serif text-foreground">{c.title[locale] ?? c.slug}</p>
              <p className="text-[11px] text-muted-foreground">{c.slug}</p>
            </div>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={c.active}
                disabled={busyId === c.id}
                onChange={(e) =>
                  run(c.id, () => updateCategory(c.id, { active: e.target.checked }))
                }
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
                if (window.confirm(t('admin.categoryDeleteConfirm'))) {
                  run(c.id, () => deleteCategory(c.id))
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

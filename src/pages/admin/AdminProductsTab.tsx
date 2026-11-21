import { useCallback, useEffect, useState } from 'react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import { listAdminProducts, updateProduct, createProduct, AdminProduct } from '@/lib/admin/service'
import { listAdminCategories, AdminCategory } from '@/lib/admin/service'
import { catalogRepository, formatPrice } from '@/data/repository'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

/** Aba Produtos do painel: listar, editar (preço/estoque/destaque) e criar. */
export default function AdminProductsTab() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)

  const [products, setProducts] = useState<AdminProduct[] | null>(null)
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const reload = useCallback(async () => {
    try {
      const [prods, cats] = await Promise.all([listAdminProducts(), listAdminCategories()])
      setProducts(prods)
      setCategories(cats)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  async function patch(id: string, values: Partial<AdminProduct>) {
    setBusyId(id)
    setError(null)
    try {
      await updateProduct(id, values)
      await reload()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  if (error && !products) return <p className="text-sm text-destructive">{error}</p>
  if (!products) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {t('admin.productsCount', { count: String(products.length) })}
        </p>
        <Button type="button" variant="outline" onClick={() => setShowForm((v) => !v)}>
          {showForm ? t('account.cancel') : t('admin.productNew')}
        </Button>
      </div>

      {showForm && (
        <AdminProductForm
          categories={categories}
          onDone={() => {
            setShowForm(false)
            reload()
          }}
        />
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-card/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">{t('admin.productName')}</th>
              <th className="px-4 py-3 font-medium">{t('admin.productCategory')}</th>
              <th className="px-4 py-3 font-medium">{t('admin.productPrice')}</th>
              <th className="px-4 py-3 font-medium">{t('admin.productStock')}</th>
              <th className="px-4 py-3 font-medium">{t('admin.productFeatured')}</th>
              <th className="px-4 py-3 font-medium">{t('admin.productActive')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {products.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                categories={categories}
                busy={busyId === p.id}
                onPatch={(v) => patch(p.id, v)}
                locale={locale}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProductRow({
  product,
  categories,
  busy,
  onPatch,
  locale,
}: {
  product: AdminProduct
  categories: AdminCategory[]
  busy: boolean
  onPatch: (v: Partial<AdminProduct>) => void
  locale: string
}) {
  const t = (key: string) => shopT(locale, key)
  const cat = catalogRepository.getCategory(product.categoryId)
  const catTitle = cat?.title[locale] ?? cat?.title['pt-br'] ?? product.categoryId

  return (
    <tr className={busy ? 'opacity-50' : undefined}>
      <td className="px-4 py-3">
        <p className="font-serif text-foreground">{product.name[locale] ?? product.slug}</p>
        <p className="text-[11px] text-muted-foreground">{product.slug}</p>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{catTitle}</td>
      <td className="px-4 py-3">
        <Input
          type="number"
          step="0.01"
          min="0"
          defaultValue={product.price}
          onBlur={(e) => {
            const v = Number(e.target.value)
            if (v !== product.price && !Number.isNaN(v)) onPatch({ price: v })
          }}
          className="h-8 w-24 bg-background text-xs"
          aria-label={t('admin.productPrice')}
        />
      </td>
      <td className="px-4 py-3">
        <Input
          type="number"
          min="0"
          defaultValue={product.stock}
          onBlur={(e) => {
            const v = Number(e.target.value)
            if (v !== product.stock && !Number.isNaN(v)) onPatch({ stock: v })
          }}
          className="h-8 w-20 bg-background text-xs"
          aria-label={t('admin.productStock')}
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={product.featured}
          onChange={(e) => onPatch({ featured: e.target.checked })}
          className="h-4 w-4 accent-primary"
          aria-label={t('admin.productFeatured')}
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={product.active}
          onChange={(e) => onPatch({ active: e.target.checked })}
          className="h-4 w-4 accent-primary"
          aria-label={t('admin.productActive')}
        />
      </td>
    </tr>
  )
}

function AdminProductForm({
  categories,
  onDone,
}: {
  categories: AdminCategory[]
  onDone: () => void
}) {
  const { locale } = useLocale()
  const t = (key: string) => shopT(locale, key)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('0')
  const [featured, setFeatured] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // slug automático a partir do nome quando o admin não digitar um
  function autoSlug(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await createProduct({
        slug: (slug || autoSlug(name)).slice(0, 60),
        categoryId,
        name: { 'pt-br': name, es: name, 'en-gb': name },
        shortDescription: { 'pt-br': '', es: '', 'en-gb': '' },
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        active: true,
        featured,
      })
      onDone()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-primary/30 bg-card p-5"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="prod-name" className="text-xs text-muted-foreground">
            {t('admin.productName')}
          </Label>
          <Input
            id="prod-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-background"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="prod-slug" className="text-xs text-muted-foreground">
            {t('admin.productSlug')}
          </Label>
          <Input
            id="prod-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={autoSlug(name)}
            className="bg-background"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="prod-cat" className="text-xs text-muted-foreground">
            {t('admin.productCategory')}
          </Label>
          <select
            id="prod-cat"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title[locale] ?? c.slug}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="prod-price" className="text-xs text-muted-foreground">
              {t('admin.productPrice')}
            </Label>
            <Input
              id="prod-price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="prod-stock" className="text-xs text-muted-foreground">
              {t('admin.productStock')}
            </Label>
            <Input
              id="prod-stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        {t('admin.productFeatured')}
      </label>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy} className="bg-primary hover:bg-primary/90">
        {t('account.save')}
      </Button>
      <span className="ml-3 text-[11px] italic text-muted-foreground/70">
        {t('admin.priceHint')}
        {formatPrice(0, locale) === '' ? '' : ''}
      </span>
    </form>
  )
}

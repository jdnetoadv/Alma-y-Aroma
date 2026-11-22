import { useCallback, useEffect, useState } from 'react'
import { useLocale } from '@/i18n/LocaleContext'
import { Locale } from '@/i18n/types'
import { CurrencyCode, ProductCategory } from '@/data/types'
import { shopT } from '@/i18n/shopStrings'
import {
  listAdminProducts,
  updateProduct,
  createProduct,
  updateProductFull,
  refreshCatalog,
  AdminProduct,
} from '@/lib/admin/service'
import { listAdminCategories, AdminCategory } from '@/lib/admin/service'
import { catalogRepository, formatPrice } from '@/data/repository'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { AdminProductGallery, GalleryState, saveGalleryState } from '@/lib/admin/gallery'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

const CURRENCIES: CurrencyCode[] = ['BRL', 'EUR', 'GBP']

/** Aba Produtos do painel: listar, edição rápida (preço/estoque/destaque),
 * edição completa (mesmo formulário da criação) e criar. */
export default function AdminProductsTab() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)

  const [products, setProducts] = useState<AdminProduct[] | null>(null)
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  /** Produto em edição completa (mesmo formulário da criação). */
  const [editing, setEditing] = useState<AdminProduct | null>(null)

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
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setEditing(null)
            setShowForm((v) => !v)
          }}
        >
          {showForm ? t('account.cancel') : t('admin.productNew')}
        </Button>
        {editing && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setEditing(null)}
            className="text-muted-foreground"
          >
            {t('admin.cancelEdit')}
          </Button>
        )}
      </div>

      {(showForm || editing) && (
        <AdminProductForm
          key={editing?.id ?? 'new'}
          categories={categories}
          product={editing ?? undefined}
          onDone={() => {
            setShowForm(false)
            setEditing(null)
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
                onEdit={() => {
                  setShowForm(false)
                  setEditing(p)
                }}
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
  onEdit,
  locale,
}: {
  product: AdminProduct
  categories: AdminCategory[]
  busy: boolean
  onEdit: () => void
  onPatch: (v: Partial<AdminProduct>) => void
  locale: Locale
}) {
  const t = (key: string) => shopT(locale, key)
  const cat = catalogRepository.getCategory(product.categoryId as ProductCategory)
  const catTitle = cat?.title[locale] ?? cat?.title['pt-br'] ?? product.categoryId

  return (
    <tr className={busy ? 'opacity-50' : undefined}>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={onEdit}
          title={t('admin.productEdit')}
          className="font-serif text-foreground underline-offset-2 hover:text-primary hover:underline"
        >
          {product.name[locale] ?? product.slug}
        </button>
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
        <Input
          type="number"
          step="0.01"
          min="0"
          defaultValue={product.compareAtPrice ?? ''}
          placeholder="—"
          onBlur={(e) => {
            const raw = e.target.value.trim()
            const v = raw === '' ? null : Number(raw)
            const prev = product.compareAtPrice
            if (v !== prev && (v === null || !Number.isNaN(v))) onPatch({ compareAtPrice: v })
          }}
          className="mt-1 h-8 w-24 bg-background text-xs"
          aria-label={t('admin.productCompareAtPrice')}
          title={t('admin.productCompareAtPrice')}
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
        <Input
          type="number"
          min="0"
          defaultValue={product.weightGrams ?? ''}
          placeholder="g"
          onBlur={(e) => {
            const raw = e.target.value.trim()
            const v = raw === '' ? null : Number(raw)
            const prev = product.weightGrams
            if (v !== prev && (v === null || !Number.isNaN(v))) onPatch({ weightGrams: v })
          }}
          className="mt-1 h-8 w-20 bg-background text-xs"
          aria-label={t('admin.productWeight')}
          title={t('admin.productWeight')}
        />
        <div className="mt-1 flex gap-1">
          {(['lengthCm', 'widthCm', 'heightCm'] as const).map((dim) => (
            <Input
              key={dim}
              type="number"
              step="0.1"
              min="0"
              defaultValue={product[dim] ?? ''}
              placeholder={dim === 'lengthCm' ? 'C' : dim === 'widthCm' ? 'L' : 'A'}
              onBlur={(e) => {
                const raw = e.target.value.trim()
                const v = raw === '' ? null : Number(raw)
                const prev = product[dim]
                if (v !== prev && (v === null || !Number.isNaN(v))) onPatch({ [dim]: v })
              }}
              className="h-8 w-14 bg-background text-xs"
              aria-label={t('admin.productDimensions')}
              title={t('admin.productDimensions')}
            />
          ))}
        </div>
        <select
          value={product.currency}
          onChange={(e) => onPatch({ currency: e.target.value as CurrencyCode })}
          className="mt-1 h-8 w-20 rounded-md border border-border bg-background px-1 text-xs text-foreground"
          aria-label={t('admin.productCurrency')}
          title={t('admin.productCurrency')}
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
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
      <td className="px-4 py-3">
        <Button type="button" variant="outline" size="sm" onClick={onEdit}>
          {t('admin.productEdit')}
        </Button>
      </td>
    </tr>
  )
}

function AdminProductForm({
  categories,
  product,
  onDone,
}: {
  categories: AdminCategory[]
  /** Presente = edição completa de um produto existente; ausente = criação. */
  product?: AdminProduct
  onDone: () => void
}) {
  const { locale } = useLocale()
  const t = (key: string) => shopT(locale, key)
  const [name, setName] = useState(product?.name['pt-br'] ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? '')
  const [price, setPrice] = useState(product ? String(product.price ?? '') : '')
  const [stock, setStock] = useState(product ? String(product.stock ?? 0) : '0')
  const [featured, setFeatured] = useState(product?.featured ?? false)
  const [active, setActive] = useState(product?.active ?? true)
  const [shortDesc, setShortDesc] = useState(product?.shortDescription['pt-br'] ?? '')
  const [longDesc, setLongDesc] = useState(product?.longDescription['pt-br'] ?? '')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  // Galeria de fotos (migração 0008): sequência definida no painel.
  const [gallery, setGallery] = useState<GalleryState>({
    files: [],
    keptNames: [],
    markers: [],
  })
  const [galleryNotice, setGalleryNotice] = useState<string | null>(null)

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
      // Criação: primeiro o produto, depois a galeria — a sequência
      // (marcadores file:/URLs no campo images) precisa do id do registro.
      const id = await createProduct({
        slug: (slug || autoSlug(name)).slice(0, 60),
        ...commonWrite(),
      })
      if (gallery.markers.length > 0) {
        await saveGalleryState(id, gallery)
      } else {
        await refreshCatalog()
      }
      onDone()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  /** Campos compartilhados entre criação e edição completa. */
  function commonWrite() {
    return {
      categoryId,
      name: { 'pt-br': name, es: name, 'en-gb': name },
      shortDescription: { 'pt-br': shortDesc, es: shortDesc, 'en-gb': shortDesc },
      longDescription: { 'pt-br': longDesc, es: longDesc, 'en-gb': longDesc },
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      active,
      featured,
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return
    setBusy(true)
    setError(null)
    try {
      // Update no registro existente — nunca cria produto novo. A galeria
      // (arquivos + sequência no campo images) é gravada em seguida, com o
      // refresh do catálogo já embutido em saveGalleryState.
      await updateProductFull(product.id, { ...commonWrite(), slug: product.slug })
      await saveGalleryState(product.id, gallery)
      onDone()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={product ? handleEditSubmit : handleSubmit}
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
            disabled={!!product}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={product ? undefined : autoSlug(name)}
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
      <div className="space-y-1">
        <Label htmlFor="prod-short" className="text-xs text-muted-foreground">
          {t('admin.shortDescription')}
        </Label>
        <Input
          id="prod-short"
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          className="bg-background"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="prod-long" className="text-xs text-muted-foreground">
          {t('admin.longDescription')}
        </Label>
        <Textarea
          id="prod-long"
          value={longDesc}
          onChange={(e) => setLongDesc(e.target.value)}
          rows={5}
          className="bg-background"
        />
      </div>
      <AdminProductGallery product={product} onChange={setGallery} onNotify={setGalleryNotice} />
      {galleryNotice && (
        <p className="text-xs text-amber-600" role="status">
          {galleryNotice}
        </p>
      )}
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        {t('admin.productActive')}
      </label>
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
        {product ? t('account.save') : t('admin.productCreate')}
      </Button>
      <span className="ml-3 text-[11px] italic text-muted-foreground/70">
        {t('admin.priceHint')}
      </span>
    </form>
  )
}

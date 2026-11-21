import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { CatalogCategory } from '@/data/types'
import { cn } from '@/lib/utils'

interface CatalogBreadcrumbProps {
  items: { label: string; to?: string }[]
  className?: string
}

/** Breadcrumb discreto compartilhado por loja, categorias e produtos. */
export function CatalogBreadcrumb({ items, className }: CatalogBreadcrumbProps) {
  const { t } = useLocale()
  return (
    <nav
      aria-label="breadcrumb"
      className={cn('flex flex-wrap items-center gap-1 text-sm text-muted-foreground', className)}
    >
      <Link to=".." className="transition-colors hover:text-foreground">
        {t('breadcrumb.home')}
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
          {item.to ? (
            <Link to={item.to} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

/** Cabeçalho comum às páginas de coleção (loja, categoria, sensação, kits). */
export function CollectionHeader({
  badge,
  title,
  description,
  category,
}: {
  badge: string
  title: string
  description: string
  category?: CatalogCategory
}) {
  return (
    <header className="relative overflow-hidden">
      {category && (
        <div className="absolute inset-0 -z-10">
          <img
            src={category.heroImage}
            alt={category.title['pt-br']}
            className="h-full w-full object-cover opacity-25"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        </div>
      )}
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-primary/80">
          {badge}
        </p>
        <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      </div>
    </header>
  )
}

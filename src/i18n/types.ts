export type Locale = 'pt-br' | 'es' | 'en-gb'

export interface LocaleMeta {
  code: Locale
  label: string
  flag: string
  htmlLang: string
}

export const LOCALES: Record<Locale, LocaleMeta> = {
  'pt-br': {
    code: 'pt-br',
    label: 'Português (Brasil)',
    flag: '🇧🇷',
    htmlLang: 'pt-BR',
  },
  es: {
    code: 'es',
    label: 'Español (España)',
    flag: '🇪🇸',
    htmlLang: 'es-ES',
  },
  'en-gb': {
    code: 'en-gb',
    label: 'English (United Kingdom)',
    flag: '🇬🇧',
    htmlLang: 'en-GB',
  },
}

export const DEFAULT_LOCALE: Locale = 'pt-br'

export interface TranslationDictionary {
  // Navigation
  'menu.home': string
  'menu.incense': string
  'menu.candles': string
  'menu.aromas': string
  'menu.rituals': string
  'menu.kits': string
  'menu.essence': string

  // Hero
  'hero.title': string
  'hero.subtitle': string
  'hero.cta': string
  'hero.scroll': string

  // Collections
  'collections.title': string
  'collections.subtitle': string
  'collections.viewCollection': string
  'col.1.title': string
  'col.1.desc': string
  'col.2.title': string
  'col.2.desc': string
  'col.3.title': string
  'col.3.desc': string
  'col.4.title': string
  'col.4.desc': string
  'col.5.title': string
  'col.5.desc': string
  'col.6.title': string
  'col.6.desc': string
  'collections.modal.soon': string
  'collections.modal.close': string

  // Nossa Essência
  'essence.title': string
  'essence.p1': string
  'essence.p2': string
  'essence.badge': string

  // Rituals
  'ritual.title': string
  'ritual.subtitle': string
  'ritual.relax': string
  'ritual.relax.desc': string
  'ritual.relax.notes': string
  'ritual.meditate': string
  'ritual.meditate.desc': string
  'ritual.meditate.notes': string
  'ritual.renew': string
  'ritual.renew.desc': string
  'ritual.renew.notes': string
  'ritual.nest': string
  'ritual.nest.desc': string
  'ritual.nest.notes': string
  'ritual.gift': string
  'ritual.gift.desc': string
  'ritual.gift.notes': string
  'ritual.modal.atmosphere': string
  'ritual.modal.related': string
  'ritual.modal.close': string

  // Editorial Moment
  'moment.title': string
  'moment.phrase': string
  'moment.subphrase': string

  // Audio Experience
  'audio.invite': string
  'audio.button': string
  'audio.pending': string
  'audio.title': string
  'audio.playing': string
  'audio.paused': string
  'audio.close': string

  // Cart & Search
  'cart.soon': string
  'cart.message': string
  'search.placeholder': string
  'search.hint': string
  'search.results': string
  'search.noResults': string
  'search.viewAll': string
  'search.quickLinks': string
  'search.close': string

  // Newsletter
  'newsletter.title': string
  'newsletter.subtitle': string
  'newsletter.placeholder': string
  'newsletter.button': string
  'newsletter.subscribing': string
  'newsletter.success': string
  'newsletter.duplicate': string
  'newsletter.invalidEmail': string
  'newsletter.error': string

  // Footer & Brand
  'footer.tagline': string
  'footer.rights': string
  'footer.crafted': string
  'footer.institutional': string
  'footer.policies': string
  'footer.privacy': string
  'footer.terms': string
  'footer.returns': string
  'footer.shipping': string
  'footer.contact': string
  'footer.comingSoonBadge': string
  'footer.selectLanguage': string

  // 404
  'notfound.title': string
  'notfound.message': string
  'notfound.backHome': string

  // ─── Etapa 2: Catálogo ───────────────────────────────────────────────
  // Shop
  'shop.title': string
  'shop.subtitle': string
  'shop.heroBadge': string
  'shop.count': string
  'shop.searchResultsFor': string
  'shop.filters': string
  'shop.filtersOpen': string
  'shop.filtersClose': string
  'shop.clearFilters': string
  'shop.filterCategory': string
  'shop.filterType': string
  'shop.filterScent': string
  'shop.filterPrice': string
  'shop.filterPurpose': string
  'shop.sortLabel': string
  'shop.sort.name': string
  'shop.sort.priceAsc': string
  'shop.sort.priceDesc': string
  'shop.sort.newest': string
  'shop.sort.featured': string
  'shop.priceRange.all': string
  'shop.priceRange.under50': string
  'shop.priceRange.50to100': string
  'shop.priceRange.100to150': string
  'shop.priceRange.over150': string
  'shop.emptyTitle': string
  'shop.emptyMessage': string
  'shop.allCategories': string

  // Product card & listing
  'product.viewDetails': string
  'product.addToCart': string
  'product.cartSoon': string
  'product.demoBadge': string
  'product.related': string
  'product.relatedKits': string
  'product.quantity': string
  'product.variations': string
  'product.availability': string
  'variation.aroma': string
  'variation.tamanho': string
  'variation.formato': string
  'variation.kit': string
  'product.availableDemo': string
  'product.shippingInfo': string
  'product.technicalInfo': string
  'product.technical.demoNote': string
  'product.tech.brand': string
  'product.tech.composition': string
  'product.tech.weight': string
  'product.tech.dimensions': string
  'product.tech.contents': string
  'product.tech.origin': string
  'product.tech.usage': string
  'product.tech.care': string
  'product.tech.sku': string
  'product.backToCategory': string
  'product.backToShop': string
  'product.detailTitle': string

  // Categories
  'category.heroBadge': string
  'category.productsCount': string
  'category.exploreAll': string

  // Sensações
  'sensation.title': string
  'sensation.subtitle': string
  'sensation.relax': string
  'sensation.meditate': string
  'sensation.renew': string
  'sensation.acolher': string
  'sensation.presentear': string
  'sensation.relax.desc': string
  'sensation.meditate.desc': string
  'sensation.renew.desc': string
  'sensation.acolher.desc': string
  'sensation.presentear.desc': string
  'sensation.backToSensations': string

  // Kits pages
  'kits.title': string
  'kits.subtitle': string
  'kits.experienceTitle': string
  'kits.compositionTitle': string
  'kits.compositionNote': string
  'kits.priceNote': string
  'kits.viewKit': string
  'kits.backToKits': string

  // Breadcrumb
  'breadcrumb.home': string
  'breadcrumb.shop': string
  'breadcrumb.kits': string
  'breadcrumb.sensations': string
}

import type { ReactElement } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LocaleProvider, useLocale } from './i18n/LocaleContext'
import { AmbientAudioProvider } from './components/audio/AmbientAudioProvider'
import Layout from './components/Layout'
import Index from './pages/Index'
import ShopPage from './pages/ShopPage'
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/ProductPage'
import KitsPage from './pages/KitsPage'
import KitDetailPage from './pages/KitDetailPage'
import SensationPage from './pages/SensationPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AccountPage from './pages/AccountPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import { ComplianceScreen } from './pages/compliance/ComplianceScreen'
import type { CompliancePageKey } from './pages/compliance/content'
import NotFound from './pages/NotFound'
import { RootRedirect } from './components/routing/RootRedirect'

/**
 * Slug segmentos compartilhados por todos os idiomas (identificadores
 * estáveis). A tradução vive no conteúdo, não na URL — assim trocar de
 * idioma mantém a mesma página de produto/categoria.
 */
const LOCALE_PREFIX = ['pt-br', 'es', 'en-gb']

/**
 * React Router 7 não aceita vários caminhos numa única string: cada idioma
 * vira um <Route> próprio, todos com o mesmo elemento.
 */
const localizedRoutes = (suffix: string, element: ReactElement) =>
  LOCALE_PREFIX.map((l) => (
    <Route key={`${l}${suffix}`} path={`/${l}${suffix}`} element={element} />
  ))

const App = () => (
  <BrowserRouter>
    <LocaleProvider>
      <AmbientAudioProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Root redirects to the visitor's preferred or default locale (/pt-br/) */}
            <Route path="/" element={<RootRedirect />} />

            {/* Localized routes sharing the global Layout */}
            <Route element={<Layout />}>
              <Route path="/pt-br" element={<Index />} />
              <Route path="/pt-br/" element={<Index />} />
              <Route path="/es" element={<Index />} />
              <Route path="/es/" element={<Index />} />
              <Route path="/en-gb" element={<Index />} />
              <Route path="/en-gb/" element={<Index />} />

              {/* ─── Etapa 2: catálogo ─── */}
              {localizedRoutes('/loja', <ShopPage />)}
              {localizedRoutes('/kits', <KitsPage />)}
              {localizedRoutes('/kits/:slug', <KitDetailPage />)}
              {localizedRoutes('/sensacoes/:purpose', <SensationPage />)}
              {localizedRoutes('/categoria/:slug', <CategoryPage />)}
              {localizedRoutes('/produto/:slug', <ProductPage />)}

              {/* ─── Etapa 3: carrinho e checkout (sem pagamento real) ─── */}
              {localizedRoutes('/carrinho', <CartPage />)}
              {localizedRoutes('/checkout', <CheckoutPage />)}

              {/* ─── Etapa 4: conta do cliente e painel admin ─── */}
              {localizedRoutes('/conta', <AccountPage />)}
              {localizedRoutes('/admin', <AdminDashboard />)}

              {/* ─── Etapa 4: conformidade (minutas, 3 idiomas) ─── */}
              {localizedRoutes('/privacidade', <ComplianceRoute pageKey="privacidade" />)}
              {localizedRoutes('/cookies', <ComplianceRoute pageKey="cookies" />)}
              {localizedRoutes('/termos', <ComplianceRoute pageKey="termos" />)}
              {localizedRoutes('/trocas', <ComplianceRoute pageKey="trocas" />)}
              {localizedRoutes('/entrega', <ComplianceRoute pageKey="entrega" />)}
              {localizedRoutes('/contato', <ComplianceRoute pageKey="contato" />)}
            </Route>

            {/* Contemplative 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AmbientAudioProvider>
    </LocaleProvider>
  </BrowserRouter>
)

/**
 * ComplianceScreen precisa do locale do contexto, que só existe dentro de
 * LocaleProvider — daí este envoltório em vez de passar locale nas rotas.
 */
function ComplianceRoute({ pageKey }: { pageKey: CompliancePageKey }) {
  const { locale } = useLocale()
  return <ComplianceScreen locale={locale} pageKey={pageKey} />
}

export default App

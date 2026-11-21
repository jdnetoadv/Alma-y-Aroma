import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LocaleProvider } from './i18n/LocaleContext'
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
import NotFound from './pages/NotFound'
import { RootRedirect } from './components/routing/RootRedirect'

/**
 * Slug segmentos compartilhados por todos os idiomas (identificadores
 * estáveis). A tradução vive no conteúdo, não na URL — assim trocar de
 * idioma mantém a mesma página de produto/categoria.
 */
const LOCALE_PREFIX = ['pt-br', 'es', 'en-gb']
const localePath = (suffix: string) => LOCALE_PREFIX.map((l) => `/${l}${suffix}`).join(' ')

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
              <Route path={localePath('/loja')} element={<ShopPage />} />
              <Route path={localePath('/kits')} element={<KitsPage />} />
              <Route path={localePath('/kits/:slug')} element={<KitDetailPage />} />
              <Route path={localePath('/sensacoes/:purpose')} element={<SensationPage />} />
              <Route path={localePath('/categoria/:slug')} element={<CategoryPage />} />
              <Route path={localePath('/produto/:slug')} element={<ProductPage />} />

              {/* ─── Etapa 3: carrinho e checkout (sem pagamento real) ─── */}
              <Route path={localePath('/carrinho')} element={<CartPage />} />
              <Route path={localePath('/checkout')} element={<CheckoutPage />} />

              {/* ─── Etapa 4: conta do cliente e painel admin ─── */}
              <Route path={localePath('/conta')} element={<AccountPage />} />
              <Route path={localePath('/admin')} element={<AdminDashboard />} />
            </Route>

            {/* Contemplative 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AmbientAudioProvider>
    </LocaleProvider>
  </BrowserRouter>
)

export default App

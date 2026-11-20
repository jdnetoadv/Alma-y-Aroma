import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LocaleProvider } from './i18n/LocaleContext'
import { AmbientAudioProvider } from './components/audio/AmbientAudioProvider'
import Layout from './components/Layout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import { RootRedirect } from './components/routing/RootRedirect'

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

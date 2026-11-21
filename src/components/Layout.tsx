import { Outlet } from 'react-router-dom'
import { Header } from './layout/Header'
import { Footer } from './layout/Footer'
import { AudioInvitePill, AudioPendingModal } from './audio/AudioComponents'
import { ConsentBanner } from './compliance/ConsentBanner'
import { useLocale } from '@/i18n/LocaleContext'

export default function Layout() {
  const { locale } = useLocale()

  return (
    <div className="flex flex-col min-h-screen bg-cream text-espresso antialiased selection:bg-clay selection:text-wine-deep">
      {/* Fixed Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Discreet Ambient Audio Invite & Notices */}
      <AudioInvitePill />
      <AudioPendingModal />

      {/* LGPD/GDPR consent — shows once, records the visitor's choice */}
      <ConsentBanner locale={locale} />

      {/* Footer */}
      <Footer />
    </div>
  )
}

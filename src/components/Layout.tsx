import { Outlet } from 'react-router-dom'
import { Header } from './layout/Header'
import { Footer } from './layout/Footer'
import { AudioInvitePill, AudioPendingModal } from './audio/AudioComponents'

export default function Layout() {
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

      {/* Footer */}
      <Footer />
    </div>
  )
}

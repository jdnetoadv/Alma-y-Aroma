import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BrandEmblem } from '@/components/brand/BrandEmblem'
import { useLocale } from '@/i18n/LocaleContext'

interface LogoProps {
  variant?: 'light' | 'dark'
  className?: string
  /** Sem efeito: a arte oficial já traz o wordmark gravado. */
  showTagline?: boolean
}

/**
 * Logomarca ALMA Y AROMA — LOGO OFICIAL da cliente (PNG transparente
 * importado como ativo estático: emblema + wordmark em uma única arte).
 * No topbar marfim aparece SEM retângulo preto e sem ícone de imagem
 * quebrada. A mesma arte oficial é usada no rodapé, favicon, conta e
 * checkout.
 */
export function Logo({ className = '', showTagline: _showTagline }: LogoProps) {
  const { locale } = useLocale()
  const location = useLocation()
  const navigate = useNavigate()

  const homePath = `/${locale}/`

  const handleClick = (e: React.MouseEvent) => {
    // Do homepage: apenas rola suavemente para o topo (sem recarregar).
    if (location.pathname === homePath || location.pathname === `/${locale}`) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    // De qualquer outra página (loja, produto, carrinho, conta, admin…):
    // navega à homepage do idioma atual e garante o topo ao chegar.
    e.preventDefault()
    navigate(homePath, { state: { scrollToTop: true } })
  }

  return (
    <Link
      to={homePath}
      onClick={handleClick}
      className={`group flex items-center gap-3 select-none outline-none ${className}`}
      aria-label="Alma y Aroma — início"
    >
      {/* Arte oficial completa: emblema + wordmark "ALMA Y AROMA" gravados */}
      <BrandEmblem className="h-11 object-contain max-w-[11.5rem] flex-shrink-0" />
    </Link>
  )
}

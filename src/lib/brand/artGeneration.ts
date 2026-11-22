/**
 * Ponto de geração das artes da marca ALMA Y AROMA. Este módulo NÃO roda em
 * runtime: ele existe para o DEV SERVER / BUILD gerar as artes oficiais
 * (public/brand/) a partir do PNG oficial da cliente, com remoção de fundo
 * por chave de luminância. O arquivo é importado por src/main.tsx — a
 * importação em si não executa nada; a geração acontece via plugin do Vite
 * instanciado abaixo (o Vite chama buildStart antes de qualquer transform).
 *
 * Este arquivo NÃO é importado pelo bundle do navegador — o Vite o elimina
 * porque nada é exportado para runtime (side-effect only, sem uso).
 */
import almaAromaLogoPlugin from './imageOps.js'

const almaAromaLogo = almaAromaLogoPlugin()
export default almaAromaLogo

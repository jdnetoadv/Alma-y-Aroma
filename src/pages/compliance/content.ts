import { Locale } from '@/i18n/types'
import { LocalizedText } from '@/data/types'

/**
 * Conteúdo das páginas de conformidade (Etapa 4).
 * TODOS os textos são MINUTAS pendentes de revisão jurídica — cada página
 * exibe o aviso de minuta (chave i18n `compliance.draftNotice`).
 * Dados de contato/empresa são placeholders claramente marcados "[a definir]":
 * nada de CNPJ, endereço ou e-mail reais inventados aqui.
 */

export type CompliancePageKey =
  | 'privacidade'
  | 'cookies'
  | 'termos'
  | 'trocas'
  | 'entrega'
  | 'contato'

export interface ComplianceSection {
  heading: LocalizedText
  body: LocalizedText[]
}

export interface ComplianceContent {
  title: LocalizedText
  intro: LocalizedText
  sections: ComplianceSection[]
}

const L = (pt: string, es: string, en: string): LocalizedText => ({
  'pt-br': pt,
  es,
  'en-gb': en,
})

export const COMPLIANCE_PAGES: CompliancePageKey[] = [
  'privacidade',
  'cookies',
  'termos',
  'trocas',
  'entrega',
  'contato',
]

/**
 * Placeholder de moeda/preço exibido nas minutas até que os valores oficiais
 * da loja sejam definidos (nada de valores inventados).
 */
export const SHOP_CURRENCY_PLACEHOLDER = '[a definir]' as const

/** Rótulo de moeda das minutas, por idioma — a moeda oficial ainda será definida. */
export function shopCurrencyLabel(locale: Locale): string {
  switch (locale) {
    case 'es':
      return 'moneda: [a definir]'
    case 'en-gb':
      return 'currency: [to be defined]'
    default:
      return 'moeda: [a definir]'
  }
}

export const complianceContent: Record<CompliancePageKey, ComplianceContent> = {
  privacidade: {
    title: L('Política de Privacidade', 'Política de Privacidad', 'Privacy Policy'),
    intro: L(
      'Esta minuta descreve, em linguagem simples, como a Alma y Aroma coleta, usa e protege os dados pessoais de clientes e visitantes, em conformidade com a LGPD (Lei 13.709/2018) e, quando aplicável, com o GDPR.',
      'Esta minuta describe, en lenguaje sencillo, cómo Alma y Aroma recopila, usa y protege los datos personales de clientes y visitantes, en conformidad con la LGPD (Ley 13.709/2018) y, cuando aplique, con el RGPD.',
      'This draft describes, in plain language, how Alma y Aroma collects, uses and protects the personal data of customers and visitors, in line with the LGPD (Law 13.709/2018) and, where applicable, the GDPR.',
    ),
    sections: [
      {
        heading: L('Dados que coletamos', 'Datos que recopilamos', 'Data we collect'),
        body: [
          L(
            'Nome, e-mail, telefone e endereço de entrega, informados por você ao criar conta, finalizar um pedido ou assinar a newsletter. Também registramos preferências declaradas (idioma, favoritos) e o consentimento de cookies.',
            'Nombre, correo electrónico, teléfono y dirección de entrega, informados por ti al crear cuenta, finalizar un pedido o suscribirte a la newsletter. También registramos preferencias declaradas (idioma, favoritos) y el consentimiento de cookies.',
            'Name, e-mail address, phone number and delivery address, provided by you when creating an account, placing an order or subscribing to the newsletter. We also record stated preferences (language, favourites) and cookie consent.',
          ),
        ],
      },
      {
        heading: L('Para que usamos', 'Para qué usamos', 'How we use it'),
        body: [
          L(
            'Exclusivamente para processar pedidos, prestar atendimento, enviar comunicações que você autorizou e melhorar a loja. Não vendemos nem compartilhamos dados pessoais com terceiros para publicidade.',
            'Exclusivamente para procesar pedidos, ofrecer atención, enviar comunicaciones que hayas autorizado y mejorar la tienda. No vendemos ni compartimos datos personales con terceros con fines publicitarios.',
            'Solely to process orders, provide customer care, send communications you have authorised and improve the shop. We do not sell or share personal data with third parties for advertising.',
          ),
        ],
      },
      {
        heading: L('Compartilhamento', 'Compartición', 'Sharing'),
        body: [
          L(
            'Os dados são armazenados em infraestrutura de nuvem contratada pela loja. Provedores de logística ou pagamento — quando existirem — receberão apenas o mínimo necessário. Nomes dos provedores: [a definir].',
            'Los datos se almacenan en infraestructura de nube contratada por la tienda. Los proveedores de logística o pago — cuando existan — recibirán solo lo mínimo necesario. Nombres de los proveedores: [a definir].',
            'Data is stored on cloud infrastructure contracted by the shop. Logistics or payment providers — once they exist — will receive only the minimum necessary. Provider names: [to be defined].',
          ),
        ],
      },
      {
        heading: L('Seus direitos', 'Tus derechos', 'Your rights'),
        body: [
          L(
            'Você pode acessar, corrigir, exportar ou excluir seus dados a qualquer momento na área "Minha conta", ou escrever para o canal de privacidade: [a definir]. Pedidos de exclusão removem a conta e seus dados associados.',
            'Puedes acceder, corregir, exportar o eliminar tus datos en cualquier momento en el área "Mi cuenta", o escribir al canal de privacidad: [a definir]. Las solicitudes de eliminación borran la cuenta y sus datos asociados.',
            'You can access, correct, export or delete your data at any time in the "My account" area, or write to the privacy channel: [to be defined]. Deletion requests remove the account and its associated data.',
          ),
        ],
      },
      {
        heading: L('Retenção e segurança', 'Retención y seguridad', 'Retention and security'),
        body: [
          L(
            'Mantemos os dados apenas pelo tempo necessário para fins fiscais e de atendimento. A política definitiva de prazos será: [a definir]. Senhas são armazenadas apenas como hashes; nenhum dado de cartão transita por esta loja.',
            'Conservamos los datos solo por el tiempo necesario para fines fiscales y de atención. La política definitiva de plazos será: [a definir]. Las contraseñas se almacenan solo como hashes; ningún dato de tarjeta pasa por esta tienda.',
            'We keep data only as long as necessary for tax and support purposes. The final retention schedule will be: [to be defined]. Passwords are stored only as hashes; no card data passes through this shop.',
          ),
        ],
      },
    ],
  },

  cookies: {
    title: L('Política de Cookies', 'Política de Cookies', 'Cookie Policy'),
    intro: L(
      'Esta minuta explica quais cookies e armazenamentos locais a loja utiliza, com que finalidade e como você pode controlar suas preferências no banner de consentimento.',
      'Esta minuta explica qué cookies y almacenamientos locales utiliza la tienda, con qué finalidad y cómo controlar tus preferencias en el banner de consentimiento.',
      'This draft explains which cookies and local storage the shop uses, for what purpose, and how you can control your preferences in the consent banner.',
    ),
    sections: [
      {
        heading: L('O que utilizamos', 'Qué utilizamos', 'What we use'),
        body: [
          L(
            'A loja é enxuta: usamos apenas armazenamento local essencial no seu navegador — idioma escolhido, carrinho, sessão de login e sua decisão sobre o banner de consentimento. Nenhum cookie de publicidade.',
            'La tienda es austera: usamos solo almacenamiento local esencial en tu navegador — idioma elegido, carrito, sesión de inicio y tu decisión sobre el banner de consentimiento. Ninguna cookie de publicidad.',
            'The shop is lean: we use only essential local storage in your browser — chosen language, cart, sign-in session and your decision about the consent banner. No advertising cookies.',
          ),
        ],
      },
      {
        heading: L('Essenciais', 'Esenciales', 'Essential'),
        body: [
          L(
            'Idioma ("alma_y_aroma_locale"), carrinho e sessão. São necessários para a loja funcionar e não exigem consentimento, conforme a legislação de cookies.',
            'Idioma ("alma_y_aroma_locale"), carrito y sesión. Son necesarios para que la tienda funcione y no requieren consentimiento, conforme la legislación de cookies.',
            'Language ("alma_y_aroma_locale"), cart and session. These are required for the shop to work and do not require consent under cookie law.',
          ),
        ],
      },
      {
        heading: L('Analítica e terceiros', 'Analítica y terceros', 'Analytics and third parties'),
        body: [
          L(
            'Ferramentas de análise ou de terceiros (por exemplo, Google Analytics) ainda não estão instaladas. Se forem adicionadas no futuro, só serão ativadas após o seu consentimento, registrado nesta loja.',
            'Las herramientas de analítica o de terceros (por ejemplo, Google Analytics) aún no están instaladas. Si se añaden en el futuro, solo se activarán tras tu consentimiento, registrado en esta tienda.',
            'Analytics or third-party tools (e.g. Google Analytics) are not installed yet. If any are added in the future, they will only be activated after your consent, recorded in this shop.',
          ),
        ],
      },
      {
        heading: L('Como alterar sua escolha', 'Cómo cambiar tu elección', 'Changing your choice'),
        body: [
          L(
            'Você pode reabrir o banner de consentimento limpando os dados do site nas configurações do navegador, ou escrever para [a definir]. Sua escolha fica gravada localmente e pode ser revogada a qualquer momento.',
            'Puedes reabrir el banner de consentimiento borrando los datos del sitio en la configuración del navegador, o escribir a [a definir]. Tu elección queda guardada localmente y puede revocarse en cualquier momento.',
            'You can reopen the consent banner by clearing this site’s data in your browser settings, or write to [to be defined]. Your choice is stored locally and can be revoked at any time.',
          ),
        ],
      },
    ],
  },

  termos: {
    title: L('Termos de Uso', 'Términos de Uso', 'Terms of Use'),
    intro: L(
      'Estas minutas regulam o uso da loja virtual Alma y Aroma. Ao navegar, criar conta ou concluir um pedido de demonstração, você concorda com os termos abaixo — ainda sujeitos a revisão jurídica.',
      'Estas minutas regulan el uso de la tienda virtual Alma y Aroma. Al navegar, crear cuenta o concluir un pedido de demostración, aceptas los términos siguientes — aún sujetos a revisión jurídica.',
      'These drafts govern the use of the Alma y Aroma online shop. By browsing, creating an account or completing a demonstration order, you agree to the terms below — still subject to legal review.',
    ),
    sections: [
      {
        heading: L('Natureza demonstrativa', 'Naturaleza demostrativa', 'Demonstrative nature'),
        body: [
          L(
            'Durante a fase atual, os pedidos são de DEMONSTRAÇÃO: nenhuma cobrança real é efetuada, nenhum valor é devido e nenhum produto é fisicamente enviado. Preços e prazos são ilustrativos.',
            'Durante la fase actual, los pedidos son de DEMOSTRACIÓN: no se efectúa ningún cobro real, no se debe ningún valor y no se envía físicamente ningún producto. Precios y plazos son ilustrativos.',
            'During the current phase, orders are for DEMONSTRATION: no real charge is made, no amount is due and no product is physically shipped. Prices and timelines are illustrative.',
          ),
        ],
      },
      {
        heading: L('Conta do cliente', 'Cuenta del cliente', 'Customer account'),
        body: [
          L(
            'Você é responsável pela veracidade dos dados cadastrais e pela confidencialidade da sua senha. A loja pode suspender contas usadas de má-fé ou em fraude.',
            'Eres responsable de la veracidad de tus datos y de la confidencialidad de tu contraseña. La tienda puede suspender cuentas usadas de mala fe o en fraude.',
            'You are responsible for the accuracy of your details and the confidentiality of your password. The shop may suspend accounts used in bad faith or for fraud.',
          ),
        ],
      },
      {
        heading: L('Propriedade intelectual', 'Propiedad intelectual', 'Intellectual property'),
        body: [
          L(
            'Textos, imagens, identidade visual e conteúdo do catálogo pertencem à Alma y Aroma ([a definir — titularidade/formalização]) e não podem ser copiados para uso comercial sem autorização.',
            'Textos, imágenes, identidad visual y contenido del catálogo pertenecen a Alma y Aroma ([a definir — titularidad/formalización]) y no pueden copiarse para uso comercial sin autorización.',
            'Texts, images, visual identity and catalogue content belong to Alma y Aroma ([to be defined — ownership/formalisation]) and may not be copied for commercial use without permission.',
          ),
        ],
      },
      {
        heading: L(
          'Limitação de responsabilidade',
          'Limitación de responsabilidad',
          'Limitation of liability',
        ),
        body: [
          L(
            'A loja é oferecida "no estado em que se encontra". Na fase demonstrativa não nos responsabilizamos por perdas e danos decorrentes de uso dos dados de exibição. O texto definitivo de responsabilidade será: [a definir].',
            'La tienda se ofrece "tal cual". En la fase demostrativa no respondemos por pérdidas y daños derivados del uso de los datos de exhibición. El texto definitivo de responsabilidad será: [a definir].',
            'The shop is offered "as is". In the demonstrative phase we are not liable for losses arising from the use of displayed data. The final liability wording will be: [to be defined].',
          ),
        ],
      },
      {
        heading: L('Legislação aplicável', 'Legislación aplicable', 'Applicable law'),
        body: [
          L(
            'Foro e legislação aplicáveis: [a definir] — provavelmente o consumidor brasileiro (CDC) para vendas no Brasil, com cláusulas próprias para mercados europeus.',
            'Foro y legislación aplicables: [a definir] — probablemente el consumidor brasileño (CDC) para ventas en Brasil, con cláusulas propias para los mercados europeos.',
            'Venue and applicable law: [to be defined] — likely Brazilian consumer law (CDC) for sales in Brazil, with specific clauses for European markets.',
          ),
        ],
      },
    ],
  },

  trocas: {
    title: L('Trocas e Devoluções', 'Cambios y Devoluciones', 'Returns & Exchanges'),
    intro: L(
      'Minuta da política de trocas e devoluções, alinhada ao direito de arrependimento de 7 dias do art. 49 do CDC e às regras europeias de 14 dias. Sujeita a revisão jurídica.',
      'Minuta de la política de cambios y devoluciones, alineada al derecho de arrepentimiento de 7 días del art. 49 del CDC y a las reglas europeas de 14 días. Sujeta a revisión jurídica.',
      'Draft of the returns and exchanges policy, aligned with the 7-day right of withdrawal of art. 49 of the Brazilian CDC and the 14-day European rules. Subject to legal review.',
    ),
    sections: [
      {
        heading: L('Prazo para desistir', 'Plazo para desistir', 'Withdrawal period'),
        body: [
          L(
            'Você pode desistir da compra em até 7 dias corridos após o recebimento (CDC, art. 49) — e em 14 dias para pedidos com entrega na União Europeia/Reino Unido, quando essa operação existir.',
            'Puedes desistir de la compra en hasta 7 días corridos tras la recepción (CDC, art. 49) — y en 14 días para pedidos con entrega en la Unión Europea/Reino Unido, cuando esa operación exista.',
            'You may withdraw from the purchase within 7 consecutive days of delivery (CDC, art. 49) — and within 14 days for orders delivered in the EU/UK, once that operation exists.',
          ),
        ],
      },
      {
        heading: L('Como solicitar', 'Cómo solicitarlo', 'How to request'),
        body: [
          L(
            'Escreva para o canal de atendimento ([a definir]) com o código do pedido e o motivo. Em pedidos de demonstração, não há devolução de valores — a política vale para a operação comercial futura.',
            'Escribe al canal de atención ([a definir]) con el código del pedido y el motivo. En pedidos de demostración no hay devolución de valores — la política vale para la futura operación comercial.',
            'Write to the customer care channel ([to be defined]) with the order code and the reason. For demonstration orders there is no refund — the policy applies to the future commercial operation.',
          ),
        ],
      },
      {
        heading: L('Condições do produto', 'Condiciones del producto', 'Product condition'),
        body: [
          L(
            'Produtos lacrados (velas, aromas, difusores) só podem ser devolvidos com o lacre intacto. Produtos com defeito de fabricação serão trocados ou reembolsados, com frete por nossa conta.',
            'Los productos sellados (velas, aromas, difusores) solo pueden devolverse con el sello intacto. Los productos con defecto de fabricación se cambiarán o reembolsarán, con envío por nuestra cuenta.',
            'Sealed products (candles, aromas, diffusers) can only be returned with the seal intact. Products with manufacturing defects will be exchanged or refunded, with shipping on us.',
          ),
        ],
      },
      {
        heading: L('Reembolso', 'Reembolso', 'Refund'),
        body: [
          L(
            'Após a aprovação da devolução, o reembolso ocorre pelo mesmo meio de pagamento em até [a definir] dias úteis. Descontos e cupons aplicados são recalculados conforme a regra final: [a definir].',
            'Tras la aprobación de la devolución, el reembolso se realiza por el mismo medio de pago en hasta [a definir] días hábiles. Descuentos y cupones aplicados se recalculan según la regla final: [a definir].',
            'Once the return is approved, the refund is issued via the original payment method within [to be defined] business days. Applied discounts and coupons are recalculated under the final rule: [to be defined].',
          ),
        ],
      },
    ],
  },

  entrega: {
    title: L('Frete e Entrega', 'Envíos y Entregas', 'Shipping & Delivery'),
    intro: L(
      'Minuta da política de frete e entrega. Todos os prazos abaixo são ILUSTRATIVOS da fase demonstrativa — não constituem promessa de entrega.',
      'Minuta de la política de envíos y entregas. Todos los plazos siguientes son ILUSTRATIVOS de la fase demostrativa — no constituyen promesa de entrega.',
      'Draft of the shipping and delivery policy. All timelines below are ILLUSTRATIVE of the demonstrative phase — they do not constitute a delivery promise.',
    ),
    sections: [
      {
        heading: L('Cobertura', 'Cobertura', 'Coverage'),
        body: [
          L(
            'Operação inicial: Brasil ([a definir — regiões atendidas]). Mercados da União Europeia e Reino Unido estão planejados para a etapa comercial, com preços configurados por moeda no painel da loja.',
            'Operación inicial: Brasil ([a definir — regiones atendidas]). Los mercados de la Unión Europea y Reino Unido están previstos para la etapa comercial, con precios configurados por moneda en el panel de la tienda.',
            'Initial operation: Brazil ([to be defined — served regions]). EU and UK markets are planned for the commercial phase, with prices configured per currency in the shop panel.',
          ),
        ],
      },
      {
        heading: L('Prazos ilustrativos', 'Plazos ilustrativos', 'Illustrative timelines'),
        body: [
          L(
            'Capitais e regiões metropolitanas: 3 a 7 dias úteis. Demais localidades: 5 a 12 dias úteis. Esses intervalos são demonstrativos e serão recalculados com transportadoras reais: [a definir].',
            'Capitales y regiones metropolitanas: 3 a 7 días hábiles. Demás localidades: 5 a 12 días hábiles. Estos intervalos son demostrativos y se recalcularán con transportadoras reales: [a definir].',
            'Capital cities and metro areas: 3–7 business days. Other locations: 5–12 business days. These ranges are demonstrative and will be recalculated with real carriers: [to be defined].',
          ),
        ],
      },
      {
        heading: L('Custos de frete', 'Costos de envío', 'Shipping costs'),
        body: [
          L(
            'A estimativa exibida no carrinho é calculada localmente para demonstração. A regra comercial definitiva (transportadora, frete grátis por valor, retirada) será: [a definir].',
            'La estimación mostrada en el carrito se calcula localmente para demostración. La regla comercial definitiva (transportadora, envío gratis por valor, retiro) será: [a definir].',
            'The estimate shown in the cart is calculated locally for demonstration. The final commercial rule (carrier, free shipping threshold, pickup) will be: [to be defined].',
          ),
        ],
      },
      {
        heading: L('Rastreamento', 'Seguimiento', 'Tracking'),
        body: [
          L(
            'Pedidos confirmados receberão código de rastreamento por e-mail quando a operação real começar. Na fase demonstrativa, o código é fictício e serve apenas para testar o fluxo.',
            'Los pedidos confirmados recibirán código de seguimiento por correo cuando comience la operación real. En la fase demostrativa, el código es ficticio y sirve solo para probar el flujo.',
            'Confirmed orders will receive a tracking code by e-mail once the real operation starts. In the demonstrative phase the code is fictional and exists only to test the flow.',
          ),
        ],
      },
    ],
  },

  contato: {
    title: L('Atendimento e Contato', 'Atención y Contacto', 'Customer Care & Contact'),
    intro: L(
      'Canais de atendimento da Alma y Aroma. Alguns canais ainda estão sendo preparados e aparecem marcados como "em breve" — nenhum formulário desta página envia mensagens ainda.',
      'Canales de atención de Alma y Aroma. Algunos canales aún se están preparando y aparecen marcados como "próximamente" — ningún formulario de esta página envía mensajes todavía.',
      'Alma y Aroma customer care channels. Some channels are still being prepared and appear marked as "coming soon" — no form on this page sends messages yet.',
    ),
    sections: [
      {
        heading: L('E-mail', 'Correo electrónico', 'E-mail'),
        body: [
          L(
            'Endereço de atendimento: [a definir]. Quando ativo, respondemos em até [a definir] dias úteis.',
            'Correo de atención: [a definir]. Cuando esté activo, respondemos en hasta [a definir] días hábiles.',
            'Customer care e-mail: [to be defined]. Once active, we reply within [to be defined] business days.',
          ),
        ],
      },
      {
        heading: L('WhatsApp', 'WhatsApp', 'WhatsApp'),
        body: [
          L(
            'Atendimento por WhatsApp: em breve. O número será publicado aqui quando o canal entrar no ar.',
            'Atención por WhatsApp: próximamente. El número se publicará aquí cuando el canal entre al aire.',
            'WhatsApp support: coming soon. The number will be published here once the channel goes live.',
          ),
        ],
      },
      {
        heading: L('Horário de atendimento', 'Horario de atención', 'Support hours'),
        body: [
          L(
            'Horário planejado: segundas a sextas, das [a definir] às [a definir] (fuso de Brasília). Sujeito a ajuste na etapa comercial.',
            'Horario previsto: lunes a viernes, de [a definir] a [a definir] (hora de Brasilia). Sujeto a ajuste en la etapa comercial.',
            'Planned hours: Mondays to Fridays, from [to be defined] to [to be defined] (Brasília time). Subject to change in the commercial phase.',
          ),
        ],
      },
      {
        heading: L('Razão social e endereço', 'Razón social y dirección', 'Legal name and address'),
        body: [
          L(
            'Razão social: [a definir]. CNPJ: [a definir]. Endereço: [a definir]. Estes dados legais serão publicados quando a formalização da empresa estiver concluída.',
            'Razón social: [a definir]. NIF/CIF: [a definir]. Dirección: [a definir]. Estos datos legales se publicarán cuando la formalización de la empresa esté concluida.',
            'Legal name: [to be defined]. Company number: [to be defined]. Address: [to be defined]. These legal details will be published once the company formalisation is complete.',
          ),
        ],
      },
      {
        heading: L('Privacidade e dados', 'Privacidad y datos', 'Privacy and data'),
        body: [
          L(
            'Pedidos sobre dados pessoais (acesso, correção, exclusão) podem ser feitos pelo canal de privacidade descrito na Política de Privacidade.',
            'Las solicitudes sobre datos personales (acceso, corrección, eliminación) pueden hacerse por el canal de privacidad descrito en la Política de Privacidad.',
            'Requests about personal data (access, correction, deletion) can be made through the privacy channel described in the Privacy Policy.',
          ),
        ],
      },
    ],
  },
}

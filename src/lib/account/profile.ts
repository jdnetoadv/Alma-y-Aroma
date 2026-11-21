import pb from '@/lib/pocketbase/client'

/**
 * Perfil — Etapa 4. Campos extras (telefone, CPF, consentimento LGPD) moram
 * em `profiles` (1:1 com `users` via campo `user`). Migração 0004 permite
 * que o próprio usuário atualize e remova seu perfil.
 */

export interface ProfileData {
  phone: string
  cpf: string
  marketingOptIn: boolean
  lgpdConsentAt: string | null
}

export async function fetchProfile(): Promise<ProfileData | null> {
  if (!pb.authStore.isValid) return null
  try {
    const rec = await pb
      .collection('profiles')
      .getFirstListItem(`user="${pb.authStore.record?.id}"`)
    return {
      phone: String(rec.phone ?? ''),
      cpf: String(rec.cpf ?? ''),
      marketingOptIn: Boolean(rec.marketingOptIn),
      lgpdConsentAt: (rec.lgpdConsentAt as string) ?? null,
    }
  } catch {
    return null
  }
}

/** Cria ou atualiza o perfil do usuário autenticado (upsert). */
export async function saveProfile(data: Omit<ProfileData, 'lgpdConsentAt'>): Promise<void> {
  const userId = pb.authStore.record?.id
  if (!userId) throw new Error('not authenticated')
  const payload = {
    user: userId,
    phone: data.phone || '',
    cpf: data.cpf || '',
    marketingOptIn: data.marketingOptIn,
  }
  const existing = await fetchProfile()
  if (existing) {
    const rec = await pb.collection('profiles').getFirstListItem(`user="${userId}"`)
    await pb.collection('profiles').update(rec.id, payload)
  } else {
    await pb.collection('profiles').create({
      ...payload,
      lgpdConsentAt: data.marketingOptIn ? new Date().toISOString() : '',
    })
  }
}

/** Atualiza nome/e-mail na coleção `users` (regra: id = @request.auth.id). */
export async function updateAccount(name: string): Promise<void> {
  await pb.collection('users').update(pb.authStore.record?.id ?? '', { name })
}

/** Troca de senha com verificação da senha atual (área do cliente). */
export async function changeOwnPassword(current: string, next: string): Promise<void> {
  await pb.collection('users').update(pb.authStore.record?.id ?? '', {
    password: next,
    passwordConfirm: next,
    oldPassword: current,
  })
}

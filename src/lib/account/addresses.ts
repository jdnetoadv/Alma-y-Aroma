import pb from '@/lib/pocketbase/client'
import { Locale } from '@/i18n/types'
import { AddressInput } from '@/lib/shipping'

/**
 * Endereços — Etapa 4. CRUD na coleção `addresses` (regra: user =
 * @request.auth.id; atualização própria habilitada pela migração 0004).
 */

export interface SavedAddress {
  id: string
  label: string
  postcode: string
  street: string
  number: string
  complement: string
  district: string
  city: string
  state: string
  country: string
  isDefault: boolean
}

export type NewAddress = Omit<SavedAddress, 'id' | 'country'> & { country?: string }

export async function listAddresses(): Promise<SavedAddress[]> {
  if (!pb.authStore.isValid) return []
  const recs = await pb.collection('addresses').getFullList({ sort: '-isDefault,-created' })
  return recs.map(mapAddress)
}

export async function createAddress(input: NewAddress): Promise<SavedAddress> {
  const rec = await pb.collection('addresses').create(serialize(input))
  return mapAddress(rec)
}

export async function updateAddress(id: string, input: NewAddress): Promise<SavedAddress> {
  const rec = await pb.collection('addresses').update(id, serialize(input))
  return mapAddress(rec)
}

export async function deleteAddress(id: string): Promise<void> {
  await pb.collection('addresses').delete(id)
}

/** Define um endereço como padrão desmarcando os outros do usuário. */
export async function setDefaultAddress(id: string): Promise<void> {
  const all = await listAddresses()
  await Promise.all(
    all.map((a) =>
      a.id === id
        ? pb.collection('addresses').update(a.id, { isDefault: true })
        : a.isDefault
          ? pb.collection('addresses').update(a.id, { isDefault: false })
          : Promise.resolve(),
    ),
  )
}

/** Endereço padrão como AddressInput do checkout (null se não houver). */
export function toAddressInput(a: SavedAddress): AddressInput {
  return {
    postcode: a.postcode,
    street: a.street,
    number: a.number,
    complement: a.complement || undefined,
    district: a.district,
    city: a.city,
    state: a.state,
    country: a.country || 'BR',
  }
}

function serialize(input: NewAddress) {
  return {
    label: input.label || '',
    postcode: input.postcode,
    street: input.street,
    number: input.number,
    complement: input.complement || '',
    district: input.district || '',
    city: input.city,
    state: input.state,
    country: input.country || 'BR',
    isDefault: Boolean(input.isDefault),
  }
}

function mapAddress(r: Record<string, unknown>): SavedAddress {
  return {
    id: String(r.id),
    label: String(r.label ?? ''),
    postcode: String(r.postcode ?? ''),
    street: String(r.street ?? ''),
    number: String(r.number ?? ''),
    complement: String(r.complement ?? ''),
    district: String(r.district ?? ''),
    city: String(r.city ?? ''),
    state: String(r.state ?? ''),
    country: String(r.country ?? 'BR'),
    isDefault: Boolean(r.isDefault),
  }
}

export type { Locale }

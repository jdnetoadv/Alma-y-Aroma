import pb from '@/lib/pocketbase/client'
import { Locale } from '@/i18n/types'

export interface NewsletterSubscriberInput {
  email: string
  locale: Locale
}

export interface NewsletterSubscribeResult {
  success: boolean
  isDuplicate?: boolean
  error?: string
}

export async function subscribeNewsletter({
  email,
  locale,
}: NewsletterSubscriberInput): Promise<NewsletterSubscribeResult> {
  const cleanEmail = email.trim().toLowerCase()

  try {
    await pb.collection('newsletter_subscribers').create({
      email: cleanEmail,
      locale,
    })
    return { success: true }
  } catch (err: unknown) {
    const errorObj = err as { status?: number; data?: Record<string, unknown>; message?: string }

    // PocketBase throws 400 when unique constraint idx_newsletter_subscribers_email fails
    const isUniqueViolation =
      errorObj?.status === 400 &&
      (JSON.stringify(errorObj?.data || {}).includes('unique') ||
        errorObj?.message?.toLowerCase().includes('unique') ||
        errorObj?.message?.toLowerCase().includes('already exists') ||
        JSON.stringify(errorObj?.data || {}).includes('validation_not_unique'))

    if (isUniqueViolation) {
      return { success: false, isDuplicate: true }
    }

    return {
      success: false,
      error: errorObj?.message || 'Falha ao processar assinatura',
    }
  }
}

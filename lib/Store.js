import { GoTrueClient } from 'mfa-supabase-test'

export const auth = new GoTrueClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
)

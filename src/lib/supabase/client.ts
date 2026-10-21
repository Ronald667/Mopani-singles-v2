import { createClient } from '@supabase/supabase-js'

const getEnv = (key: string, viteKey: string): string => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string
    }
  } catch {}

  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
      // @ts-ignore
      return import.meta.env[viteKey] as string
    }
  } catch {}

  return ''
}

const supabaseUrl =
  getEnv('NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL') ||
  'https://fmsnansclqsrupufalhz.supabase.co'

const supabaseAnonKey =
  getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY') ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtc25hbnNjbHFzcnVwdWZhbGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjQ2MzAsImV4cCI6MjA1ODE0MDYzMH0.placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection to public.profiles
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1)
    if (error) {
      console.warn('Supabase profiles connection test notice:', error.message)
      return { success: false, error: error.message }
    }
    console.log('Supabase connection to public.profiles successful:', data)
    return { success: true, data }
  } catch (err: any) {
    console.warn('Supabase connection test exception:', err.message)
    return { success: false, error: err.message }
  }
}

// Importiere Supabase von CDN
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://fxkuwxqhryeifpwadsio.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4a3V3eHFocnllaWZwd2Fkc2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4Mzg5MTUsImV4cCI6MjA1MjQxNDkxNX0.iYtuUZqZrxR8jXuiMhoi_Y8x-BeZMdaHKV5uFF4XktU'

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: window.localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
}) 
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qmlzpqzylaopakciilep.supabase.co'
const supabaseKey = 'sb_publishable_tLYElyZY4JzOc2PjLCjv9A_hJLosrMZ'

export const supabase = createClient(supabaseUrl, supabaseKey)
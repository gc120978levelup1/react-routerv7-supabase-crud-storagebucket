import { createClient } from '@supabase/supabase-js'
const headers = new Headers();
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!);
export { supabase, headers };
// npm install @supabase/supabase-js
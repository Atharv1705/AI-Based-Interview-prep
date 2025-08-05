// Re-export the properly configured supabase client
export { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}
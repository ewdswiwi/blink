import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "BURAYA_PROJECT_URL",
  "BURAYA_PUBLISHABLE_KEY"
);

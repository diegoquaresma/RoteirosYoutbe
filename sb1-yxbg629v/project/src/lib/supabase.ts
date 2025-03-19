import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Create Supabase client with error handling
export const supabase = createClient(
  supabaseUrl || 'http://placeholder-url.com',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Add error handling for auth operations
const originalGetUser = supabase.auth.getUser.bind(supabase.auth);
supabase.auth.getUser = async () => {
  if (!isSupabaseConfigured()) {
    return { data: { user: null }, error: new Error('Supabase not configured') };
  }
  return originalGetUser();
};

const originalSignIn = supabase.auth.signInWithPassword.bind(supabase.auth);
supabase.auth.signInWithPassword = async (credentials) => {
  if (!isSupabaseConfigured()) {
    return { data: { user: null }, error: new Error('Supabase not configured') };
  }
  return originalSignIn(credentials);
};

const originalSignUp = supabase.auth.signUp.bind(supabase.auth);
supabase.auth.signUp = async (credentials) => {
  if (!isSupabaseConfigured()) {
    return { data: { user: null }, error: new Error('Supabase not configured') };
  }
  return originalSignUp(credentials);
};

const originalSignOut = supabase.auth.signOut.bind(supabase.auth);
supabase.auth.signOut = async () => {
  if (!isSupabaseConfigured()) {
    return { error: new Error('Supabase not configured') };
  }
  return originalSignOut();
};
// Supabase Configuration
const SUPABASE_CONFIG = {
    URL: 'https://jaykercqfzzwjivuzkpj.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpheWtlcmNxZnp6d2ppdnV6a3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDUyMDgsImV4cCI6MjA1ODQyMTIwOH0.FEw7uHf0zia6NTW4Npy6JA1o3b8lrBbVc70CRLRBuA4'
};

// Initialize Supabase Client
const supabase = window.supabase.createClient(
    SUPABASE_CONFIG.URL, 
    SUPABASE_CONFIG.ANON_KEY
);

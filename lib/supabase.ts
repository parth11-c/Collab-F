import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dptgjmxknurkrctkesft.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwdGdqbXhrbnVya3JjdGtlc2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NTI0NzQsImV4cCI6MjA3MjEyODQ3NH0.6gkiKPizcATN4RDGpxbOTkJw6gkc6K9LdvV2WLoSClU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

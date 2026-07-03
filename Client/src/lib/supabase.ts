import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lwcpyzvmgxhdpzjzbsbm.supabase.co'; 
const supabaseAnonKey = 'EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3Y3B5enZtZ3hoZHB6anpic2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMDIyNjEsImV4cCI6MjA5ODY3ODI2MX0.lpWQdWa17ylU6ZBm-vRQV73ej99RqU-83atDfLEJvFs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lwcpyzvmgxhdpzjzbsbm.supabase.co'; 
const supabaseAnonKey = 'EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3Y3B5enZtZ3hoZHB6anpic2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMDIyNjEsImV4cCI6MjA5ODY3ODI2MX0.lpWQdWa17ylU6ZBm-vRQV73ej99RqU-83atDfLEJvFs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to verify a student login
export const loginStudent = async (admissionNo: string, password: string) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('admission_no', admissionNo)
    .eq('portal_password', password)
    .single();

  if (error) {
    return { success: false, error: 'Invalid Admission Number or Password' };
  }

  return { success: true, student: data };
};

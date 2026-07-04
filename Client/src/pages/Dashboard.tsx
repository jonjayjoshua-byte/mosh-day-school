import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BookOpen, 
  LogOut, 
  User, 
  Award, 
  CheckCircle,
  MessageSquare,
  Loader2,
  Printer
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [student, setStudent] = useState<any>(null);
  const [reportCard, setReportCard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    setLocation("/");
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const rawAdmissionNo = params.get("admissionNo");

        if (!rawAdmissionNo) {
          setLocation("/");
          return;
        }

        const admissionNo = decodeURIComponent(rawAdmissionNo);

        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("*")
          .ilike("admission_no", admissionNo)
          .single();

        if (studentError) throw studentError;
        setStudent(studentData);

        const { data: gradesData, error: gradesError } = await supabase
          .from("grades")
          .select("*")
          .ilike("admission_no", admissionNo)
          .order("subject", { ascending: true });

        if (gradesError) throw gradesError;
        setReportCard(gradesData || []);

      } catch (err) {
        console.error("Error loading dashboard data:", err);
        alert("Session expired or profile record not found.");
        setLocation("/");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-bold tracking-wide uppercase">Securing Profile Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 text-foreground antialiased selection:bg-primary/10 print-bg-fix">
      
      {/* APP HEADER - HIDDEN ON PRINT */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-xs px-4 py-3.5 no-print">
        <div className="container mx-auto max-w-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-sm font-black tracking-tight text-primary uppercase">Portal</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <Button 
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="text-primary border-primary/20 hover:bg-primary/5 text-xs font-bold gap-1.5 px-2.5 rounded-xl h-8"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Report
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-destructive text-xs font-bold gap-1.5 px-2.5 rounded-xl h-8"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </Button>
          </div>
        </div>
      </header>

      {/* --- PRESTIGIOUS BLUE-THEMED PRINT ONLY HEADER --- */}
      <div className="print-only-header hidden text-center space-y-1 pt-2 mb-3 border-b-2 border-primary pb-2">
        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center mx-auto mb-1 shadow-xs">
          <BookOpen className="w-5 h-5" />
        </div>
        <h1 className="text-lg font-black text-primary tracking-tight uppercase leading-none">MOSH DAY SCHOOL</h1>
        <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Nursery &amp; Primary Education &bull; "Best Grooming"</p>
        <div className="pt-1.5">
          <span className="bg-primary text-white font-black px-3 py-0.5 text-[9px] rounded-full uppercase tracking-wider">
            Official Academic Evaluation Terminal Report
          </span>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="container mx-auto px-4 py-6 max-w-md space-y-4 print-container">
        
        {/* STUDENT METADATA SECTION */}
        <Card className="p-4 rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/90 text-white shadow-md relative overflow-hidden print-flat-profile">
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 no-print">
            <BookOpen className="w-40 h-40" />
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 overflow-hidden shrink-0 flex items-center justify-center print-avatar">
              {student?.student_image_url ? (
                <img src={student.student_image_url} alt="Student avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-white/60 print:text-slate-400" />
              )}
            </div>
            <div className="space-y-0.5 flex-1">
              <span className="text-[9px] uppercase tracking-widest text-white/70 font-bold bg-white/10 px-2 py-0.5 rounded-md no-print">Verified Profile</span>
              <h2 className="text-sm font-black tracking-tight leading-tight print:text-primary">{student?.full_name}</h2>
              <p className="text-[10px] text-white/85 font-semibold font-mono print:text-slate-700">{student?.admission_no}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-center relative z-10 print:border-slate-200">
            <div className="bg-white/5 rounded-xl py-1 px-2 border border-white/5 print-box">
              <p className="text-[8px] text-white/70 font-bold uppercase tracking-wider print:text-slate-500">Class</p>
              <p className="text-xs font-black mt-0.5 print:text-slate-900">{student?.class}</p>
            </div>
            <div className="bg-white/5 rounded-xl py-1 px-2 border border-white/5 print-box">
              <p className="text-[8px] text-white/70 font-bold uppercase tracking-wider print:text-slate-500">Active Term</p>
              <p className="text-xs font-black mt-0.5 print:text-slate-900">{student?.term}</p>
            </div>
          </div>
        </Card>

        {/* RESULTS TABLE */}
        <Card className="rounded-3xl border border-border shadow-xs bg-white overflow-hidden print-table-card">
          <div className="px-4 pt-3 pb-1 border-b border-border/50 flex items-center justify-between no-print">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase text-primary tracking-wide">Academic Results</h3>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-100">Released</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left print:text-[11px]">
              <thead>
                <tr className="bg-muted/40 border-b border-border/60 print:bg-primary/10 print:border-slate-300">
                  <th className="py-2 px-3 text-[10px] font-black text-muted-foreground uppercase tracking-wider print:text-primary">Subject</th>
                  <th className="py-2 px-1 text-[10px] font-black text-muted-foreground uppercase tracking-wider text-center print:text-slate-700">CA (40)</th>
                  <th className="py-2 px-1 text-[10px] font-black text-muted-foreground uppercase tracking-wider text-center print:text-slate-700">Exam (60)</th>
                  <th className="py-2 px-1 text-[10px] font-black text-muted-foreground uppercase tracking-wider text-center print:text-primary">Total</th>
                  <th className="py-2 px-3 text-[10px] font-black text-muted-foreground uppercase tracking-wider text-right print:text-primary">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs font-medium print:divide-slate-200">
                {reportCard.length > 0 ? (
                  reportCard.map((row, idx) => {
                    const totalScore = (row.ca || 0) + (row.exam || 0);
                    return (
                      <tr key={idx} className="hover:bg-muted/10 transition-colors print:hover:bg-transparent">
                        <td className="py-1.5 px-3 font-bold text-foreground print:text-slate-900 max-w-[140px] truncate">{row.subject}</td>
                        <td className="py-1.5 px-1 text-center text-muted-foreground font-semibold print:text-slate-700">{row.ca}</td>
                        <td className="py-1.5 px-1 text-center text-muted-foreground font-semibold print:text-slate-700">{row.exam}</td>
                        <td className="py-1.5 px-1 text-center text-primary font-black print:text-slate-900">{totalScore}</td>
                        <td className="py-1.5 px-3 text-right">
                          <span className={`inline-block text-[9px] font-black w-4.5 h-4.5 leading-4.5 text-center rounded-md ${
                            row.grade?.startsWith('A') 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 print:bg-emerald-100 print:text-emerald-800 print:border-emerald-300' 
                              : 'bg-amber-50 text-amber-600 border border-amber-100 print:bg-amber-100 print:text-amber-800 print:border-amber-300'
                          }`}>
                            {row.grade || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-xs text-muted-foreground font-bold tracking-wide uppercase">
                      No subject results uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* TEACHER REMARK SECTION */}
        <Card className="p-3 rounded-3xl border border-border shadow-xs bg-white space-y-2 print:border-slate-200 print:p-2.5 print:shadow-none print:bg-white">
          <div className="flex items-center gap-2 border-b border-border/50 pb-1 no-print">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-black uppercase text-primary tracking-wide">Teacher's Remark</h3>
          </div>
          
          <div className="p-2 bg-muted/40 rounded-2xl border border-border/60 print:bg-transparent print:border-none print:p-0">
            <p className="text-xs text-foreground/80 italic font-semibold print:text-slate-800">
              {reportCard.length > 0 
                ? `"${reportCard[0]?.remark || 'Keep up the brilliant momentum!'}"` 
                : '"Profile registered. Performance assessment matrix pending academic department configuration cycle."'}
            </p>
            <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-1.5 text-[10px] no-print">
              <div>
                <span className="font-bold block text-foreground">Mrs. F. Adegoke</span>
                <span className="text-muted-foreground font-semibold">Class Teacher Assessment</span>
              </div>
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
          </div>
        </Card>

        {/* --- COMPACT OFFICIAL SIGNATURE SIGNOFF STRIP --- */}
        <div className="print-signoff hidden pt-4 grid grid-cols-2 gap-8 text-center text-[10px] font-bold text-slate-900">
          <div className="space-y-4">
            <div className="border-b border-slate-400 w-32 mx-auto h-3"></div>
            <p className="uppercase text-[8px] tracking-wider text-slate-700">Mrs. F. Adegoke <br/><span className="text-[7px] font-medium text-slate-500 lowercase">Class Teacher Signature</span></p>
          </div>
          <div className="space-y-4">
            <div className="border-b border-slate-400 w-32 mx-auto h-3"></div>
            <p className="uppercase text-[8px] tracking-wider text-slate-700">School Principal <br/><span className="text-[7px] font-medium text-slate-500 lowercase">Sign &amp; Official Seal</span></p>
          </div>
        </div>

      </main>

      {/* DASHBOARD FOOTER */}
      <footer className="py-3 text-center text-[9px] text-muted-foreground font-medium print:mt-4 print:border-t print:border-slate-200 print:text-slate-400">
        <p>Mosh Day School Portal Ecosystem &bull; &copy; 2026 All Rights Reserved.</p>
      </footer>

      {/* ENHANCED CSS PRINT SINGLE PAGE INJECTION ENGINE */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: letter portrait;
            margin: 0.2in 0.3in 0.2in 0.3in;
          }
          html, body {
            background: #f1f5f9 !important;
            background-color: #f1f5f9 !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            height: 100%;
            overflow: hidden;
          }
          .print-bg-fix {
            background: #f1f5f9 !important;
            background-color: #f1f5f9 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only-header {
            display: block !important;
          }
          .print-signoff {
            display: grid !important;
          }
          .print-container {
            max-w-full !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 auto !important;
          }
          .print-flat-profile {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #0f172a !important;
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            border-radius: 12px !important;
            padding: 0.65rem !important;
          }
          .print-avatar {
            border: 1px solid #e2e8f0 !important;
            background: #f8fafc !important;
          }
          .print-box {
            background: #f8fafc !important;
            background-color: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
          }
          .print-table-card {
            border: 1px solid #cbd5e1 !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
            box-shadow: none !important;
            border-radius: 12px !important;
          }
          th {
            padding: 0.35rem 0.5rem !important;
          }
          td {
            padding: 0.35rem 0.5rem !important;
            border-bottom: 1px solid #e2e8f0 !important;
          }
        }
      `}} />

    </div>
  );
}

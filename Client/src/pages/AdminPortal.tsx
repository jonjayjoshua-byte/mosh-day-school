import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Plus, User, Award, Loader2, RefreshCw, Lock, Eye, EyeOff } from "lucide-react";

export default function AdminPortal() {
  // Gate Security States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Core Admin States
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states for adding a student
  const [fullName, setFullName] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [className, setClassName] = useState("");
  const [term, setTerm] = useState("Third Term");

  // Form states for uploading grades
  const [selectedAdmNo, setSelectedAdmNo] = useState("");
  const [subject, setSubject] = useState("");
  const [caScore, setCaScore] = useState("");
  const [examScore, setExamScore] = useState("");
  const [grade, setGrade] = useState("");
  const [teacherRemark, setTeacherRemark] = useState(""); // 1. Added remark tracking state

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("full_name", { ascending: true });
      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStudents();
    }
  }, [isAuthenticated]);

  // Handle Admin Gate Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "moshadmin2026") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid Admin Gateway Passkey!");
      setAdminPassword("");
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !admissionNo || !className) return alert("Fill all fields");

    try {
      const { error } = await supabase.from("students").insert([
        { 
          full_name: fullName, 
          admission_no: admissionNo.trim(), 
          class: className, 
          term 
        }
      ]);
      if (error) throw error;
      
      alert("Student Profile Registered successfully!");
      setFullName("");
      setAdmissionNo("");
      setClassName("");
      fetchStudents();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUploadGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    // 2. Added verification check to ensure remark isn't left blank
    if (!selectedAdmNo || !subject || !caScore || !examScore || !grade || !teacherRemark) {
      return alert("Fill all grade parameters, including the teacher remark!");
    }

    try {
      const { error } = await supabase.from("grades").insert([
        {
          admission_no: selectedAdmNo,
          subject,
          ca: parseInt(caScore),
          exam: parseInt(examScore),
          grade: grade.toUpperCase(),
          remark: teacherRemark // 3. Replaced static text with your custom state value
        }
      ]);
      if (error) throw error;

      alert(`Grade and custom remark added successfully for ${selectedAdmNo}!`);
      setSubject("");
      setCaScore("");
      setExamScore("");
      setGrade("");
      setTeacherRemark(""); // 4. Clear comment line out on successful post
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 1. RENDER GATEWAY LOCK SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4 text-foreground font-sans antialiased">
        <Card className="w-full max-w-md p-6 rounded-3xl border bg-white space-y-5 shadow-sm text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-primary tracking-tight uppercase">Admin Gate Lock</h1>
            <p className="text-xs text-muted-foreground font-semibold px-2 mt-1">
              This area is restricted to authorized school administrators. Enter the system control passkey to unlock.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-3 text-left">
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter Staff Admin Password" 
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="rounded-xl text-xs h-11 pr-10 font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button type="submit" className="w-full rounded-xl text-xs font-bold h-11">
              Verify & Unlock Panel
            </Button>
          </form>

          <a href="/" className="inline-block text-[10px] font-bold text-muted-foreground hover:text-primary transition uppercase tracking-wider underline">
            &larr; Back to Student Portal Login
          </a>
        </Card>
      </div>
    );
  }

  // 2. RENDER FULL MANAGEMENT PANEL IF AUTHENTICATED
  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8 text-foreground font-sans antialiased">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <header className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-xl font-black text-primary tracking-tight uppercase">Mosh Day School</h1>
            <p className="text-xs text-muted-foreground font-semibold">Centralized Academic Administration Dashboard</p>
          </div>
          <Button onClick={fetchStudents} size="sm" variant="outline" className="rounded-xl h-9 gap-1 text-xs font-bold">
            <RefreshCw className="w-3.5 h-3.5" /> Reload Data
          </Button>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* SECTION 1: ADD NEW STUDENT */}
          <Card className="p-5 rounded-3xl border bg-white space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b pb-2">
              <User className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-black uppercase text-primary tracking-wide">Register Student Profile</h2>
            </div>
            <form onSubmit={handleCreateStudent} className="space-y-3">
              <Input placeholder="Full Name (e.g. John Doe)" value={fullName} onChange={e => setFullName(e.target.value)} className="rounded-xl text-xs h-10" />
              <Input placeholder="Admission Number (e.g. MDS/2026/26)" value={admissionNo} onChange={e => setAdmissionNo(e.target.value)} className="rounded-xl text-xs h-10" />
              <Input placeholder="Class (e.g. Primary 5)" value={className} onChange={e => setClassName(e.target.value)} className="rounded-xl text-xs h-10" />
              <Button type="submit" className="w-full rounded-xl text-xs font-bold h-10 gap-1.5">
                <Plus className="w-4 h-4" /> Add Student Record
              </Button>
            </form>
          </Card>

          {/* SECTION 2: UPLOAD GRADES */}
          <Card className="p-5 rounded-3xl border bg-white space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b pb-2">
              <Award className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-black uppercase text-primary tracking-wide">Upload Academic Scores</h2>
            </div>
            <form onSubmit={handleUploadGrade} className="space-y-3">
              <select 
                value={selectedAdmNo} 
                onChange={e => setSelectedAdmNo(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 h-10 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">-- Select Target Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.admission_no}>{s.full_name} ({s.admission_no})</option>
                ))}
              </select>
              <Input placeholder="Subject Name (e.g. Database Management)" value={subject} onChange={e => setSubject(e.target.value)} className="rounded-xl text-xs h-10" />
              <div className="grid grid-cols-3 gap-2">
                <Input type="number" placeholder="CA" value={caScore} onChange={e => setCaScore(e.target.value)} className="rounded-xl text-xs h-10 text-center" />
                <Input type="number" placeholder="Exam" value={examScore} onChange={e => setExamScore(e.target.value)} className="rounded-xl text-xs h-10 text-center" />
                <Input placeholder="Grade" value={grade} onChange={e => setGrade(e.target.value)} className="rounded-xl text-xs h-10 text-center" />
              </div>
              
              {/* 5. BRAND NEW INPUT BOX FOR REMARKS */}
              <Input 
                placeholder="Teacher's Remark (e.g. Excellent progress this term!)" 
                value={teacherRemark} 
                onChange={e => setTeacherRemark(e.target.value)} 
                className="rounded-xl text-xs h-10" 
              />

              <Button type="submit" variant="default" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold h-10 gap-1.5">
                Publish Subject Result
              </Button>
            </form>
          </Card>
        </div>

        {/* SECTION 3: SYSTEM DIRECTORY */}
        <Card className="p-5 rounded-3xl border bg-white shadow-xs">
          <h2 className="text-xs font-black uppercase text-primary tracking-wide mb-3">Live System Directory</h2>
          {loading ? (
            <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
          ) : (
            <div className="divide-y text-xs font-medium max-h-60 overflow-y-auto">
              {students.map(s => (
                <div key={s.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-foreground">{s.full_name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.admission_no} &bull; {s.class}</p>
                  </div>
                  <a href={`/dashboard?admissionNo=${encodeURIComponent(s.admission_no)}`} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm" className="text-[10px] font-bold h-7 rounded-lg">View Portal</Button>
                  </a>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}

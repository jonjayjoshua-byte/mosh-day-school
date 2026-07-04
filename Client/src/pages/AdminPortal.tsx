import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Plus, User, Award, Loader2, RefreshCw, Lock, Trash2 } from "lucide-react";

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [fullName, setFullName] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [className, setClassName] = useState("");
  const [term, setTerm] = useState("Third Term");

  const [selectedAdmNo, setSelectedAdmNo] = useState("");
  const [subject, setSubject] = useState("");
  const [caScore, setCaScore] = useState("");
  const [examScore, setExamScore] = useState("");
  const [grade, setGrade] = useState("");
  const [teacherRemark, setTeacherRemark] = useState("");
  const [teacherName, setTeacherName] = useState("");

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
          full_name: fullName.trim(), 
          admission_no: admissionNo.trim(), 
          class: className.trim(), 
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
    if (!selectedAdmNo || !subject || !caScore || !examScore || !grade || !teacherRemark || !teacherName) {
      return alert("Fill all fields, including the teacher's name and remark!");
    }

    try {
      const { error } = await supabase.from("grades").insert([
        {
          admission_no: selectedAdmNo.trim(),
          subject: subject.trim(),
          ca: parseInt(caScore),
          exam: parseInt(examScore),
          grade: grade.trim().toUpperCase(),
          remark: teacherRemark.trim(),
          teacher_name: teacherName.trim()
        }
      ]);
      if (error) throw error;

      alert(`Grade added successfully for ${selectedAdmNo}!`);
      setSubject("");
      setCaScore("");
      setExamScore("");
      setGrade("");
      setTeacherRemark("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleClearScores = async (admNo: string) => {
    if (!confirm(`Are you sure you want to completely wipe out all grades for student ${admNo}? This cannot be undone.`)) return;
    
    try {
      const { error } = await supabase
        .from("grades")
        .delete()
        .eq("admission_no", admNo.trim());
        
      if (error) throw error;
      alert(`All previous grades wiped successfully for ${admNo}!`);
      await fetchStudents(); // Re-fetch data instantly without kicking you out
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- FIXED: REPLACES HARD RELOAD WITH STATE RE-FETCH TO KEEP YOU LOGGED IN ---
  const handlePromoteOrChange = async (admNo: string, currentClass: string, currentTerm: string) => {
    const newClass = prompt("Enter new Class (Leave blank to keep current):", currentClass);
    const newTerm = prompt("Enter new Term (Leave blank to keep current):", currentTerm);
    
    if (newClass === null && newTerm === null) return;

    try {
      const updates: any = {};
      if (newClass && newClass.trim() !== "") updates.class = newClass.trim();
      if (newTerm && newTerm.trim() !== "") updates.term = newTerm.trim();

      if (Object.keys(updates).length === 0) return;

      const targetAdmissionNo = admNo.trim();

      const { error } = await supabase
        .from("students")
        .update(updates)
        .eq("admission_no", targetAdmissionNo);

      if (error) throw error;
      
      alert("Student profile metadata records synchronized!");
      await fetchStudents(); // Updates the UI state smoothly without requiring re-login
      
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- NEW FEATURE: DELETE STUDENT RECORD COMPLETELY ---
  const handleDeleteStudent = async (admNo: string, name: string) => {
    if (!confirm(`CRITICAL WARNING: Are you sure you want to completely delete ${name} (${admNo}) from the system? This removes their profile permanently.`)) return;
    
    try {
      // First wipe any scores associated with them to prevent reference leaks
      await supabase.from("grades").delete().eq("admission_no", admNo.trim());

      // Delete student profile row
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("admission_no", admNo.trim());

      if (error) throw error;

      alert("Student profile permanently deleted from registry.");
      await fetchStudents();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4 text-foreground font-sans antialiased">
        <Card className="w-full max-w-md p-6 rounded-3xl border bg-white space-y-5 shadow-sm text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-primary tracking-tight uppercase">Admin Gate Lock</h1>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-3 text-left">
            <Input 
              type="password" 
              placeholder="Enter Staff Admin Password" 
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              className="rounded-xl text-xs h-11 font-medium"
              required
            />
            <Button type="submit" className="w-full rounded-xl text-xs font-bold h-11">
              Verify & Unlock Panel
            </Button>
          </form>
        </Card>
      </div>
    );
  }

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
          {/* REGISTER STUDENT */}
          <Card className="p-5 rounded-3xl border bg-white space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b pb-2">
              <User className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-black uppercase text-primary tracking-wide">Register Student Profile</h2>
            </div>
            <form onSubmit={handleCreateStudent} className="space-y-3">
              <Input placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className="rounded-xl text-xs h-10" />
              <Input placeholder="Admission Number" value={admissionNo} onChange={e => setAdmissionNo(e.target.value)} className="rounded-xl text-xs h-10" />
              <Input placeholder="Class (e.g. Primary 5)" value={className} onChange={e => setClassName(e.target.value)} className="rounded-xl text-xs h-10" />
              <select value={term} onChange={e => setTerm(e.target.value)} className="w-full rounded-xl border border-input h-10 px-3 text-xs">
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
              <Button type="submit" className="w-full rounded-xl text-xs font-bold h-10 gap-1.5">
                <Plus className="w-4 h-4" /> Add Student Record
              </Button>
            </form>
          </Card>

          {/* UPLOAD GRADES */}
          <Card className="p-5 rounded-3xl border bg-white space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b pb-2">
              <Award className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-black uppercase text-primary tracking-wide">Upload Academic Scores</h2>
            </div>
            <form onSubmit={handleUploadGrade} className="space-y-3">
              <select 
                value={selectedAdmNo} 
                onChange={e => setSelectedAdmNo(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 h-10 text-xs font-medium"
              >
                <option value="">-- Select Target Student --</option>
                {students.map((s, index) => (
                  <option key={`${s.admission_no}-${index}`} value={s.admission_no}>{s.full_name}</option>
                ))}
              </select>
              <Input placeholder="Subject Name" value={subject} onChange={e => setSubject(e.target.value)} className="rounded-xl text-xs h-10" />
              <div className="grid grid-cols-3 gap-2">
                <Input type="number" placeholder="CA" value={caScore} onChange={e => setCaScore(e.target.value)} className="rounded-xl text-xs h-10 text-center" />
                <Input type="number" placeholder="Exam" value={examScore} onChange={e => setExamScore(e.target.value)} className="rounded-xl text-xs h-10 text-center" />
                <Input placeholder="Grade" value={grade} onChange={e => setGrade(e.target.value)} className="rounded-xl text-xs h-10 text-center" />
              </div>
              
              <Input placeholder="Teacher's Name (e.g. Mr. S. Okafor)" value={teacherName} onChange={e => setTeacherName(e.target.value)} className="rounded-xl text-xs h-10" />
              <Input placeholder="Teacher's Remark" value={teacherRemark} onChange={e => setTeacherRemark(e.target.value)} className="rounded-xl text-xs h-10" />

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold h-10">
                Publish Subject Result
              </Button>
            </form>
          </Card>
        </div>

        {/* SYSTEM DIRECTORY */}
        <Card className="p-5 rounded-3xl border bg-white shadow-xs">
          <h2 className="text-xs font-black uppercase text-primary tracking-wide mb-3">Live System Directory</h2>
          {loading ? (
            <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
          ) : (
            <div className="divide-y text-xs font-medium max-h-60 overflow-y-auto">
              {students.map((s, index) => (
                <div key={`${s.admission_no}-${index}`} className="py-3 flex justify-between items-center gap-2">
                  <div>
                    <p className="font-bold text-foreground">{s.full_name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {s.admission_no} &bull;{" "}
                      <span className="text-primary font-bold">
                        {s.class} ({s.term})
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button 
                      onClick={() => handlePromoteOrChange(s.admission_no, s.class, s.term)}
                      variant="outline" size="sm" className="text-[10px] font-bold h-7 rounded-lg border-amber-200 text-amber-700 hover:bg-amber-50"
                    >
                      Edit Class/Term
                    </Button>
                    <Button 
                      onClick={() => handleClearScores(s.admission_no)}
                      variant="outline" size="sm" className="text-[10px] font-bold h-7 rounded-lg border-destructive/20 text-destructive hover:bg-destructive/5"
                    >
                      Wipe Scores
                    </Button>
                    <Button 
                      onClick={() => handleDeleteStudent(s.admission_no, s.full_name)}
                      variant="destructive" size="sm" className="h-7 w-7 rounded-lg p-0 flex items-center justify-center"
                      title="Delete Student Record Completely"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}

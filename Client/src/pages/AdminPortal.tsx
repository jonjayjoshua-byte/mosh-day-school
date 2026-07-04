import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Plus, User, Award, Loader2, RefreshCw, Lock, Trash2, KeyRound, Save } from "lucide-react";

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Registration and Grade states
  const [fullName, setFullName] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [className, setClassName] = useState("");
  const [term, setTerm] = useState("Third Term");
  const [parentPhone, setParentPhone] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  const [selectedAdmNo, setSelectedAdmNo] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [gradeRows, setGradeRows] = useState([{ subject: "", ca: "", exam: "", grade: "", remark: "" }]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("students").select("*").order("full_name", { ascending: true });
      if (error) throw error;
      setStudents(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (isAuthenticated) fetchStudents(); }, [isAuthenticated]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "moshadmin2026") setIsAuthenticated(true);
    else { alert("Invalid Passkey!"); setAdminPassword(""); }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("students").insert([{ 
        full_name: fullName.trim(), admission_no: admissionNo.trim(), class: className.trim(), 
        term, parent_phone: parentPhone.trim(), portal_password: studentPassword.trim(), student_password: studentPassword.trim() 
      }]);
      if (error) throw error;
      alert("Student Registered!");
      setFullName(""); setAdmissionNo(""); setClassName(""); setParentPhone(""); setStudentPassword("");
      fetchStudents();
    } catch (err: any) { alert(err.message); }
  };

  // --- BULK GRADE LOGIC ---
  const addRow = () => setGradeRows([...gradeRows, { subject: "", ca: "", exam: "", grade: "", remark: "" }]);
  
  const updateRow = (index: number, field: string, value: string) => {
    const updated = [...gradeRows];
    updated[index][field as keyof typeof updated[0]] = value;
    setGradeRows(updated);
  };

  const handlePublishAll = async () => {
    if (!selectedAdmNo || !teacherName) return alert("Select student and enter teacher name!");
    
    const payload = gradeRows
      .filter(r => r.subject !== "")
      .map(r => ({
        admission_no: selectedAdmNo,
        subject: r.subject,
        ca: parseInt(r.ca) || 0,
        exam: parseInt(r.exam) || 0,
        grade: r.grade.toUpperCase(),
        remark: r.remark,
        teacher_name: teacherName
      }));

    const { error } = await supabase.from("grades").insert(payload);
    if (error) alert(error.message);
    else {
      alert("All subjects published successfully!");
      setGradeRows([{ subject: "", ca: "", exam: "", grade: "", remark: "" }]);
    }
  };

  // --- EXISTING UTILS ---
  const handleResetPassword = async (admNo: string, name: string) => {
    const newPassword = prompt(`New password for ${name}:`);
    if (newPassword) {
      await supabase.from("students").update({ portal_password: newPassword, student_password: newPassword }).eq("admission_no", admNo);
      fetchStudents();
    }
  };

  const handleDeleteStudent = async (admNo: string) => {
    if (confirm("Delete student?")) {
      await supabase.from("grades").delete().eq("admission_no", admNo);
      await supabase.from("students").delete().eq("admission_no", admNo);
      fetchStudents();
    }
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6 rounded-3xl text-center">
        <Lock className="w-10 h-10 mx-auto text-primary mb-4" />
        <Input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Admin Passkey" className="mb-3" />
        <Button onClick={handleAdminLogin} className="w-full">Unlock Panel</Button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center pb-4 border-b">
          <h1 className="text-xl font-black text-primary uppercase">Admin Portal</h1>
          <Button onClick={fetchStudents} variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" /> Reload</Button>
        </header>

        {/* BULK UPLOAD CARD */}
        <Card className="p-5 rounded-3xl border bg-white space-y-4">
          <h2 className="text-xs font-black uppercase text-primary border-b pb-2 flex items-center gap-2">
            <Award className="w-4 h-4" /> Bulk Subject Upload
          </h2>
          <select value={selectedAdmNo} onChange={e => setSelectedAdmNo(e.target.value)} className="w-full border rounded-xl p-2 text-xs">
            <option value="">-- Select Student --</option>
            {students.map(s => <option key={s.admission_no} value={s.admission_no}>{s.full_name}</option>)}
          </select>
          <Input placeholder="Teacher Name" value={teacherName} onChange={e => setTeacherName(e.target.value)} />
          
          <div className="space-y-2">
            {gradeRows.map((row, i) => (
              <div key={i} className="grid grid-cols-5 gap-2">
                <Input placeholder="Subj" value={row.subject} onChange={e => updateRow(i, "subject", e.target.value)} className="col-span-2 text-[10px]" />
                <Input placeholder="CA" value={row.ca} onChange={e => updateRow(i, "ca", e.target.value)} className="text-[10px]" />
                <Input placeholder="Ex" value={row.exam} onChange={e => updateRow(i, "exam", e.target.value)} className="text-[10px]" />
                <Input placeholder="Gr" value={row.grade} onChange={e => updateRow(i, "grade", e.target.value)} className="text-[10px]" />
              </div>
            ))}
            <Button onClick={addRow} variant="outline" size="sm" className="w-full text-xs">+ Add Row</Button>
          </div>
          <Button onClick={handlePublishAll} className="w-full bg-emerald-600"><Save className="w-4 h-4 mr-2" /> Publish All Subjects</Button>
        </Card>

        {/* DIRECTORY */}
        <Card className="p-5 rounded-3xl border bg-white">
          <h2 className="text-xs font-black uppercase text-primary mb-3">System Directory</h2>
          {students.map(s => (
            <div key={s.admission_no} className="py-2 flex justify-between items-center border-b text-xs">
              <div><p className="font-bold">{s.full_name}</p><p className="text-[10px] text-muted-foreground">{s.admission_no} • Pass: {s.portal_password}</p></div>
              <div className="flex gap-1">
                <Button onClick={() => handleResetPassword(s.admission_no, s.full_name)} size="sm" variant="ghost"><KeyRound className="w-4 h-4 text-blue-600" /></Button>
                <Button onClick={() => handleDeleteStudent(s.admission_no)} size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

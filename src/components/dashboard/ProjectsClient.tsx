"use client";

import { useState, useEffect } from "react";
import { createProject, updateProject, deleteProject } from "@/app/actions/projects";
import { Plus, MoreVertical, Search, AlignLeft, Calendar } from "lucide-react";
import { toggleTask } from "@/app/actions/projects";
import { TEAM_WORKFLOWS } from "@/lib/workflows";
import { LockKey, CheckCircle, Sparkle, ShieldCheck, X, Crown } from "@phosphor-icons/react";

const STATUSES = ["Planning", "In Progress", "Review", "Completed"];

export function ProjectsClient({ initialProjects, teamId, userId }: { initialProjects: any[], teamId: string, userId: string }) {
  const [projects, setProjects] = useState(initialProjects);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string>("anggota");

  // Attempt to read role from cookies/session for gatekeeper checking.
  // Since we don't have direct access to session here without extra props, 
  // we can read the god_mode_role or assume passed in from parent.
  // Wait, the parent component doesn't pass role right now.
  // We can pass userRole from parent. Let's add it to props later if needed, 
  // or read from cookie for god mode.

  
  useEffect(() => {
    // Basic way to determine if user has manager/direktur powers via God Mode cookie
    const match = document.cookie.match(/(^| )god_mode_role=([^;]+)/);
    if (match && match[2] !== "none") {
      setUserRole(match[2]);
    } else {
      // Fetch role from somewhere or pass as prop? 
      // For now we'll assume 'anggota' unless they use God Mode, or we update the layout.
      setUserRole("anggota"); // Default fallback
    }
  }, []);

  async function handleToggleTask(projectId: string, taskId: string, isCompleted: boolean) {
    try {
      const res = await toggleTask(projectId, taskId, isCompleted);
      setProjects(p => p.map(proj => proj.id === projectId ? { ...proj, completedTasks: JSON.stringify(res.completedTasks) } : proj));
      if (selectedProject?.id === projectId) {
        setSelectedProject({ ...selectedProject, completedTasks: JSON.stringify(res.completedTasks) });
      }
    } catch (e: any) {
      alert(`Error toggling task: ${e.message}`);
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const isBigProject = formData.get("isBigProject") === "true";

    try {
      await createProject({ title, isBigProject, teamId, creatorId: userId });
      // In a real scenario, we should fetch the created project or reload.
      // For now, reload window to get fresh data from server.
      window.location.reload();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
    setLoading(false);
  }

  async function moveProject(id: string, newStatus: string) {
    try {
      await updateProject(id, { status: newStatus });
      setProjects(p => p.map(proj => proj.id === id ? { ...proj, status: newStatus } : proj));
    } catch (e: any) {
      alert(`Error moving project: ${e.message}`);
    }
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header controls */}
      <div className="flex justify-between items-center bg-surface-variant p-4 rounded-2xl border border-border">
        <div className="relative group w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40 group-focus-within:text-primary"><Search size={16} /></div>
          <input type="text" placeholder="Cari project..." className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none" />
        </div>
        
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Project Baru
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x">
        {STATUSES.map(status => {
          const colProjects = projects.filter(p => p.status === status);
          
          return (
            <div key={status} className="snap-center min-w-[300px] w-[300px] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm tracking-wide">{status}</h3>
                <span className="text-[10px] font-bold bg-surface-variant px-2 py-0.5 rounded-full">{colProjects.length}</span>
              </div>
              
              <div className="flex-1 glass p-3 rounded-2xl flex flex-col gap-3 overflow-y-auto min-h-[150px]">
                {colProjects.length === 0 && (
                  <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-xl text-foreground/40 text-xs font-bold">
                    Kosong
                  </div>
                )}
                {colProjects.map(p => {
                  const wf = TEAM_WORKFLOWS[p.teamId] || TEAM_WORKFLOWS["admin"]; // fallback
                  const totalTasks = wf ? wf.steps.reduce((acc, step) => acc + step.tasks.length, 0) : 0;
                  const completedCount = JSON.parse(p.completedTasks || "[]").length;
                  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

                  return (
                    <div 
                      key={p.id} 
                      onClick={() => setSelectedProject({ ...p, workflow: wf })}
                      className="bg-surface border border-border p-4 rounded-xl shadow-sm cursor-pointer hover:border-primary/30 hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${p.isBigProject ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                          {p.isBigProject ? 'Big Project' : 'Standar'}
                        </div>
                        <button className="text-foreground/40 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                      
                      <h4 className="font-bold text-sm mb-3 leading-snug">{p.title}</h4>
                      
                      <div className="flex items-center justify-between text-xs font-bold text-foreground/50 mb-2">
                        <div className="flex items-center gap-1"><AlignLeft size={12}/> {completedCount}/{totalTasks} Task</div>
                        <div className="text-[10px]">{Math.round(progress)}%</div>
                      </div>
                      
                      <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass p-6 md:p-8 rounded-[2rem] w-full max-w-md border border-border shadow-2xl animate-scale-in">
            <h3 className="text-xl font-bold mb-6">Buat Project Baru</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/70 mb-1.5">Judul Project</label>
                <input type="text" name="title" required className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" placeholder="Misal: Video TikTok Edukasi..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/70 mb-1.5">Skala Project</label>
                <select name="isBigProject" className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors">
                  <option value="false">Standar (Harian/Mingguan)</option>
                  <option value="true">Big Project</option>
                </select>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 text-sm font-bold bg-surface-variant hover:bg-surface border border-border rounded-xl transition-colors">Batal</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
                  {loading ? "Menyimpan..." : "Buat Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Detail / Checklist Modal */}
      {selectedProject && selectedProject.workflow && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
          <div className="glass w-full max-w-3xl rounded-[2rem] border border-border shadow-2xl relative my-auto animate-scale-in flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-border flex justify-between items-start sticky top-0 bg-background/50 backdrop-blur-md z-10 rounded-t-[2rem]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${selectedProject.isBigProject ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {selectedProject.isBigProject ? 'Big Project' : 'Standar'}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-surface-variant text-foreground/60">
                    {selectedProject.workflow.name}
                  </span>
                </div>
                <h2 className="text-2xl font-black font-heading leading-tight">{selectedProject.title}</h2>
              </div>
              <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-surface-variant rounded-full transition-colors text-foreground/50 hover:text-foreground">
                <X size={24} weight="bold" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              <div className="bg-sky-500/10 border border-sky-500/20 p-4 rounded-2xl flex items-start gap-4">
                <div className="mt-1 text-sky-500"><ShieldCheck size={24} weight="duotone" /></div>
                <div>
                  <h4 className="font-bold text-sky-600 dark:text-sky-400 text-sm">Sistem Quality Control Berlapis</h4>
                  <p className="text-xs text-foreground/70 mt-1 leading-relaxed">
                    Setiap tugas terkunci secara <strong>Sequential</strong> (berurutan). Langkah Gatekeeper (Ke-4) dan Final (Ke-5) membutuhkan <strong>Supervisor Approval</strong>.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {selectedProject.workflow.steps.map((step: any, stepIndex: number) => {
                  const completedTasksArr = JSON.parse(selectedProject.completedTasks || "[]");
                  
                  // A step is accessible if all tasks in ALL previous steps are completed
                  let isAccessible = true;
                  for (let i = 0; i < stepIndex; i++) {
                    const prevStep = selectedProject.workflow.steps[i];
                    for (let j = 0; j < prevStep.tasks.length; j++) {
                      if (!completedTasksArr.includes(`${prevStep.id}_${j}`)) {
                        isAccessible = false;
                      }
                    }
                  }

                  // A step is a gatekeeper if marked, or if it's step 4 or 5 according to business rules
                  const isGatekeeper = step.isGatekeeper || stepIndex >= 3;
                  const hasGatekeeperAccess = userRole === "direktur" || userRole === "manager";
                  const canInteract = isAccessible && (!isGatekeeper || hasGatekeeperAccess);
                  
                  const isStepCompleted = step.tasks.every((_: any, i: number) => completedTasksArr.includes(`${step.id}_${i}`));

                  return (
                    <div key={step.id} className={`relative p-5 rounded-2xl border transition-all duration-300 ${isStepCompleted ? 'bg-emerald-500/5 border-emerald-500/20' : isAccessible ? 'bg-surface border-border shadow-sm' : 'bg-surface-variant/50 border-border/30 opacity-70 grayscale-[0.5]'}`}>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${isStepCompleted ? 'bg-emerald-500 text-white' : isAccessible ? 'bg-primary/20 text-primary' : 'bg-surface-variant text-foreground/30'}`}>
                            {stepIndex + 1}
                          </div>
                          <div>
                            <h4 className={`font-bold ${isStepCompleted ? 'text-emerald-600 dark:text-emerald-400' : isAccessible ? '' : 'text-foreground/50'}`}>
                              {step.name}
                            </h4>
                            <span className="text-[10px] uppercase font-bold text-foreground/40 tracking-wider">{step.type}</span>
                          </div>
                        </div>

                        {isGatekeeper && (
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${hasGatekeeperAccess ? 'bg-sky-500/10 text-sky-500 border-sky-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                            {hasGatekeeperAccess ? <Crown size={14} weight="fill" /> : <LockKey size={14} weight="fill" />}
                            {hasGatekeeperAccess ? 'Gatekeeper Access' : 'Butuh Approval'}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 ml-11">
                        {step.tasks.map((taskInfo: any, taskIndex: number) => {
                          const taskId = `${step.id}_${taskIndex}`;
                          const isTaskCompleted = completedTasksArr.includes(taskId);
                          
                          // Sequential logic INSIDE the step
                          let isTaskAccessible = canInteract;
                          if (canInteract) {
                            for (let k = 0; k < taskIndex; k++) {
                              if (!completedTasksArr.includes(`${step.id}_${k}`)) isTaskAccessible = false;
                            }
                          }

                          return (
                            <label key={taskId} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${isTaskCompleted ? 'bg-emerald-500/10 border-emerald-500/20' : isTaskAccessible ? 'bg-background hover:border-primary/50 cursor-pointer border-border' : 'bg-transparent border-transparent opacity-50 cursor-not-allowed'}`}>
                              <div className="pt-0.5">
                                <input 
                                  type="checkbox" 
                                  checked={isTaskCompleted}
                                  disabled={!isTaskAccessible}
                                  onChange={(e) => handleToggleTask(selectedProject.id, taskId, e.target.checked)}
                                  className={`w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-colors ${!isTaskAccessible ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                />
                              </div>
                              <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                                <span className={`text-sm font-medium ${isTaskCompleted ? 'line-through text-emerald-600/70 dark:text-emerald-400/70' : 'text-foreground'}`}>
                                  {taskInfo.task}
                                </span>
                                {taskInfo.isAi && (
                                  <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold uppercase shrink-0">
                                    <Sparkle size={12} weight="fill" /> AI Assist
                                  </span>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-border bg-background/50 backdrop-blur-md rounded-b-[2rem] flex justify-between items-center">
              <div className="flex gap-2">
                {STATUSES.map(status => (
                  <button 
                    key={status}
                    onClick={() => {
                      moveProject(selectedProject.id, status);
                      setSelectedProject({...selectedProject, status});
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${selectedProject.status === status ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface text-foreground/60 border-border hover:bg-surface-variant'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <button onClick={() => setSelectedProject(null)} className="px-6 py-2.5 bg-foreground text-background rounded-xl font-bold text-sm hover:opacity-90">
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

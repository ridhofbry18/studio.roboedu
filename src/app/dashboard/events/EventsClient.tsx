"use client";

import { useState } from "react";
import { CalendarStar, Plus, Trash, PencilSimple, X, Link as LinkIcon, CheckCircle, Clock, Users } from "@phosphor-icons/react";
import { createEvent, updateEvent, deleteEvent } from "@/app/actions/events";
import Link from "next/link";

export function EventsClient({ initialEvents, teams, user }: { initialEvents: any[], teams: any[], user: any }) {
  const [events, setEvents] = useState(initialEvents);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const isAdminOrSpv = user.role === "admin" || user.role === "direktur" || user.role === "manager" || user.role === "supervisor";
  const canManageEvents = user.role === "admin" || user.role === "direktur" || user.role === "manager" || user.role === "supervisor";

  async function handleEventSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData);
      } else {
        await createEvent(formData);
      }
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    }
    setLoading(false);
  }

  async function handleDeleteEvent(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Hapus event ini? Semua data di dalamnya akan terhapus.")) return;
    try {
      await deleteEvent(id);
      setEvents(events.filter(e => e.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">Event Insidental</h2>
          <p className="text-sm text-foreground/60 mt-1">
            Daftar event di luar sekolah rutin yang ditugaskan kepada tim.
          </p>
        </div>
        {canManageEvents && (
          <button 
            onClick={() => { setEditingEvent(null); setIsEventModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl font-bold shadow-md hover:shadow-pink-500/20 active:scale-95 transition-all"
          >
            <Plus weight="bold" /> Buat Event
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => {
          return (
            <Link 
              key={event.id} 
              href={`/dashboard/events/${event.id}`}
              className="p-5 bg-surface-variant rounded-[1.5rem] border border-border flex flex-col hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 transform hover:-translate-y-1 relative group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                  <CalendarStar size={20} weight="duotone" />
                </div>
                {canManageEvents && (
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingEvent(event); setIsEventModalOpen(true); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:bg-sky-500/10 hover:text-sky-500 transition-colors z-10">
                      <PencilSimple weight="bold" />
                    </button>
                    <button onClick={(e) => handleDeleteEvent(e, event.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:bg-rose-500/10 hover:text-rose-500 transition-colors z-10">
                      <Trash weight="bold" />
                    </button>
                  </div>
                )}
              </div>
              
              <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{event.name}</h3>
              <p className="text-xs text-foreground/60 line-clamp-2 mb-4">{event.description || "Tidak ada deskripsi."}</p>

              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-foreground/50">
                {event.eventDate && <span className="bg-background px-2 py-1 rounded-md border border-border">{event.eventDate}</span>}
                {event.eventTime && <span className="bg-background px-2 py-1 rounded-md border border-border">{event.eventTime}</span>}
              </div>

              <div className="mt-auto pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-foreground/40 tracking-widest flex items-center gap-1">
                    <Users size={12} weight="bold" /> Tim Ditugaskan
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {event.assignedTeams?.length === 0 ? (
                    <span className="text-xs text-foreground/40 italic">Belum ada tim.</span>
                  ) : (
                    event.assignedTeams?.map((a: any) => (
                      <span key={a.assignmentId} className="px-2 py-1 bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[10px] font-bold rounded-lg border border-pink-500/20">
                        {a.teamName}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </Link>
          );
        })}
        {events.length === 0 && (
          <div className="col-span-full p-12 text-center text-foreground/50 bg-surface-variant/50 rounded-[1.5rem] border border-dashed border-border">
            <CalendarStar size={48} weight="duotone" className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-lg">Tidak Ada Event</p>
            <p className="text-sm mt-1">Tim Anda belum ditugaskan ke event manapun.</p>
          </div>
        )}
      </div>
      </div>

      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">{editingEvent ? "Edit Event" : "Buat Event Baru"}</h3>
              <button onClick={() => !loading && setIsEventModalOpen(false)} className="text-foreground/40 hover:text-foreground">
                <X size={20} weight="bold" />
              </button>
            </div>
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/60 mb-1.5">Nama Event</label>
                <input name="name" defaultValue={editingEvent?.name} required className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-pink-500 transition-colors" placeholder="Cth: Lomba Kemerdekaan" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 mb-1.5">Tanggal</label>
                  <input type="date" name="eventDate" defaultValue={editingEvent?.eventDate} required className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-pink-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 mb-1.5">Jam</label>
                  <input type="time" name="eventTime" defaultValue={editingEvent?.eventTime} required className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-pink-500 transition-colors" />
                </div>
              </div>
              
              {!editingEvent && (
                <div>
                  <label className="block text-xs font-bold text-foreground/60 mb-1.5">Tugaskan Tim</label>
                  <select name="teamId" required className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-pink-500 transition-colors appearance-none">
                    <option value="">-- Pilih Tim --</option>
                    {teams.map((t: any) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-foreground/60 mb-1.5">Deskripsi / Detail</label>
                <textarea name="description" defaultValue={editingEvent?.description} rows={3} className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-pink-500 transition-colors resize-none" placeholder="Instruksi untuk tim..."></textarea>
              </div>
              
              <button disabled={loading} type="submit" className="w-full py-3 bg-gradient-to-r from-pink-400 to-rose-500 text-white font-bold rounded-xl mt-2 hover:opacity-90 transition-opacity">
                {loading ? "Menyimpan..." : "Simpan Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

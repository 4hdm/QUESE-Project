import { useCallback, useEffect, useState } from "react";
import { AlertCircle, ArrowRight, Check, CheckCircle2, Clock3, MonitorPlay, Radio, RefreshCw, Send, Sparkles, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { createQueue, getQueue } from "../services/api";
import QueueTable from "../components/QueueTable";
import StatusBadge from "../components/StatusBadge";

export default function StudentPage() {
  const [form, setForm] = useState({ nama: "", nim: "", keperluan: "Konsultasi Akademik" });
  const [rows, setRows] = useState([]);
  const [myTicket, setMyTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refresh = useCallback(async () => {
    try {
      const data = await getQueue();
      setRows(data);
      setLastUpdated(new Date());
      if (myTicket) {
        const updated = data.find((item) => item.id === myTicket.id);
        if (updated) setMyTicket(updated);
      }
    } catch {
      setError("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
    }
  }, [myTicket?.id]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 5000);
    return () => clearInterval(timer);
  }, [refresh]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const ticket = await createQueue(form);
      setMyTicket(ticket);
      setForm({ nama: "", nim: "", keperluan: "Konsultasi Akademik" });
      await refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil antrean.");
    } finally {
      setLoading(false);
    }
  };

  const waiting = rows.filter((row) => row.status === "waiting").length;
  const current = rows.find((row) => row.status === "called");

  return (
    <div className="space-y-8 pb-4">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#10264f] text-white shadow-xl shadow-blue-950/10">
        <div className="pointer-events-none absolute -right-20 -top-32 -z-10 h-96 w-96 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 left-1/3 -z-10 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="grid gap-8 px-6 py-8 sm:px-9 sm:py-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:px-12 lg:py-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/20 bg-blue-200/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-100">
              <Sparkles size={14} /> Layanan akademik kampus
            </span>
            <h2 className="mt-5 max-w-2xl text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl">
              Waktumu berharga. <span className="text-blue-300">Antre lebih mudah.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100/80 sm:text-base">
              Ambil nomor dari mana saja, lalu pantau panggilan antrean secara langsung tanpa harus berdiri lama.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#ambil-antrean" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50">
                Ambil antrean <ArrowRight size={17} />
              </a>
              <Link to="/tv" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                <MonitorPlay size={17} /> Lihat antrean live
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-blue-100/80">
              <span className="inline-flex items-center gap-2"><Clock3 size={16} className="text-blue-300" /> <strong className="text-white">{waiting}</strong> antrean menunggu</span>
              <span className="inline-flex items-center gap-2"><RefreshCw size={15} className="text-blue-300" /> Update otomatis 5 detik</span>
            </div>
          </div>

          <div className="relative rounded-[1.75rem] border border-white/15 bg-white/[0.08] p-5 backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-100"><Radio size={16} /> Sedang dipanggil</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
            </div>
            <p className="mt-7 text-center text-7xl font-black tracking-[0.08em] text-white sm:text-8xl">{current?.ticket || "---"}</p>
            <p className="mt-3 text-center text-base font-semibold text-white">{current?.keperluan || "Belum ada panggilan"}</p>
            <p className="mt-2 text-center text-xs text-blue-100/70">
              {current ? "Silakan menuju loket pelayanan" : "Nomor yang dipanggil akan muncul di sini"}
            </p>
            <Link to="/tv" className="mt-6 flex items-center justify-center gap-2 border-t border-white/10 pt-4 text-sm font-semibold text-blue-100 transition hover:text-white">
              Buka layar antrean live <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {error && <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} />{error}</div>}

      <div className="grid items-start gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <section id="ambil-antrean" className="scroll-mt-6 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-2xl bg-blue-50 p-3.5 text-blue-700"><Ticket size={22} /></span>
            <div><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Mulai di sini</p><h3 className="mt-1 text-xl font-extrabold text-slate-900">Ambil nomor antrean</h3></div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="student-name" className="mb-1.5 block text-sm font-semibold text-slate-700">Nama mahasiswa</label>
              <input id="student-name" required maxLength="100" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Contoh: Fiky Anggara" className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" />
            </div>
            <div>
              <label htmlFor="student-nim" className="mb-1.5 block text-sm font-semibold text-slate-700">NIM</label>
              <input id="student-nim" required maxLength="20" value={form.nim} onChange={(e) => setForm({ ...form, nim: e.target.value })} placeholder="Masukkan NIM" className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" />
            </div>
            <div>
              <label htmlFor="queue-service" className="mb-1.5 block text-sm font-semibold text-slate-700">Keperluan</label>
              <select id="queue-service" value={form.keperluan} onChange={(e) => setForm({ ...form, keperluan: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100">
                <option>Konsultasi Akademik</option>
                <option>Surat Aktif Kuliah</option>
                <option>Legalisir Dokumen</option>
                <option>Pengajuan Cuti</option>
                <option>Lainnya</option>
              </select>
            </div>
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-md shadow-blue-600/15 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <RefreshCw size={17} className="animate-spin" /> : <Send size={17} />}
              {loading ? "Memproses nomor..." : "Ambil nomor antrean"}
            </button>
            <p className="text-center text-xs text-slate-400">Nomor antrean dibuat otomatis sesuai keperluan Anda.</p>
          </form>

          {myTicket && (
            <div aria-live="polite" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-800"><CheckCircle2 size={18} /> Antrean berhasil dibuat</div>
              <p className="my-2 text-5xl font-black tracking-wider text-emerald-700">{myTicket.ticket}</p>
              <div className="flex items-center justify-between gap-3 text-sm text-emerald-900">
                <span>{myTicket.nama}</span><StatusBadge status={myTicket.status} />
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700"><Check size={14} /> Simpan nomor ini dan pantau layar live.</p>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <h3 className="text-lg font-extrabold text-slate-900">Antrean hari ini</h3>
              </div>
              <p className="mt-1.5 text-sm text-slate-500">Pantau perkembangan layanan secara real-time.</p>
            </div>
            <span className="rounded-xl bg-blue-50 px-3.5 py-2 text-sm font-bold text-blue-700">{rows.length} antrean</span>
          </div>
          <QueueTable rows={rows} />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-7">
            <span className="text-xs text-slate-400">Diperbarui {lastUpdated.toLocaleTimeString("id-ID")}</span>
            <Link to="/tv" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900">
              <MonitorPlay size={16} /> Buka layar TV <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

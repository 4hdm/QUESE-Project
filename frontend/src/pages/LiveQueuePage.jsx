import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, Clock3, Monitor, Radio, RefreshCw, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { getQueue } from "../services/api";

export default function LiveQueuePage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [now, setNow] = useState(new Date());
  const [fullscreen, setFullscreen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setRows(await getQueue());
      setError("");
    } catch {
      setError("Koneksi terputus. Layar akan mencoba memperbarui kembali.");
    }
  }, []);

  useEffect(() => {
    refresh();
    const queueTimer = setInterval(refresh, 5000);
    const clockTimer = setInterval(() => setNow(new Date()), 1000);
    const handleFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      clearInterval(queueTimer);
      clearInterval(clockTimer);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [refresh]);

  const current = rows.find((row) => row.status === "called");
  const upcoming = rows.filter((row) => row.status === "waiting").slice(0, 6);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      setError("Mode layar penuh tidak tersedia di browser ini.");
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#071225] px-4 py-5 text-white sm:px-7 sm:py-7 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1600px] flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-blue-500 p-3 text-white shadow-lg shadow-blue-950/40"><Ticket size={24} /></span>
            <div>
              <p className="text-xl font-extrabold tracking-tight">QueueEase</p>
              <p className="text-sm text-slate-400">Layar informasi antrean</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              LIVE
            </span>
            <button onClick={toggleFullscreen} className="hidden items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 sm:inline-flex">
              <Monitor size={16} /> {fullscreen ? "Keluar layar penuh" : "Layar penuh"}
            </button>
            <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/15">
              Beranda <ArrowUpRight size={16} />
            </Link>
          </div>
        </header>

        <div className="flex flex-1 flex-col justify-center py-7">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-300">Pelayanan akademik</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Informasi antrean hari ini</h1>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold tabular-nums sm:text-4xl">{now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</p>
              <p className="mt-1 text-sm capitalize text-slate-400">{now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          </div>

          {error && <div role="status" className="mb-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-200">{error}</div>}

          <div className="grid flex-1 gap-5 lg:grid-cols-[1.55fr_0.85fr]">
            <section className="relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-blue-300/15 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-7 text-center shadow-2xl shadow-blue-950/30 sm:min-h-[470px] sm:p-12">
              <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-cyan-300/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-36 -left-20 h-80 w-80 rounded-full bg-indigo-300/15 blur-2xl" />
              <div className="relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.2em] text-blue-100 sm:text-sm">
                <Radio size={16} /> SEDANG DIPANGGIL
              </div>
              <p className="relative mt-5 text-7xl font-black tracking-[0.08em] drop-shadow sm:mt-7 sm:text-9xl">
                {current?.ticket || "---"}
              </p>
              {current ? (
                <div className="relative mt-4">
                  <p className="text-xl font-bold sm:text-2xl">{current.keperluan}</p>
                  <p className="mt-2 text-sm text-blue-100/80">Silakan menuju loket pelayanan</p>
                </div>
              ) : (
                <p className="relative mt-5 text-base text-blue-100/90 sm:text-lg">Belum ada antrean yang dipanggil</p>
              )}
              <div className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950/20 px-4 py-2 text-sm text-blue-100">
                <RefreshCw size={15} /> Diperbarui otomatis setiap 5 detik
              </div>
            </section>

            <section className="flex flex-col rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 sm:p-7">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-5">
                <div>
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-200"><Clock3 size={17} className="text-cyan-300" /> BERIKUTNYA</div>
                  <h2 className="mt-2 text-2xl font-extrabold">Siapkan antrean Anda</h2>
                </div>
                <span className="rounded-xl bg-blue-400/10 px-3 py-2 text-sm font-bold text-blue-200">{upcoming.length} menunggu</span>
              </div>

              {upcoming.length ? (
                <ol className="mt-3 divide-y divide-white/10">
                  {upcoming.map((row, index) => (
                    <li key={row.id} className="flex items-center gap-4 py-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-slate-300">{index + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-2xl font-black tracking-wide text-white sm:text-3xl">{row.ticket}</span>
                        <span className="mt-0.5 block truncate text-sm text-slate-400">{row.keperluan}</span>
                      </span>
                      <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-200">Menunggu</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                  <span className="rounded-2xl bg-white/5 p-4 text-slate-400"><Ticket size={28} /></span>
                  <p className="mt-4 font-semibold text-slate-200">Belum ada antrean menunggu</p>
                  <p className="mt-1 text-sm text-slate-400">Nomor baru akan muncul di sini.</p>
                </div>
              )}
            </section>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs text-slate-500">
          <span>QueueEase · Sistem Antrean Digital Kampus</span>
          <span className="inline-flex items-center gap-1.5"><RefreshCw size={12} /> Live update aktif</span>
        </footer>
      </div>
    </main>
  );
}

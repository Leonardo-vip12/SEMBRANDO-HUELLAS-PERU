import { useState } from 'react';
import { Award, Loader2, CheckCircle, XCircle, Search, ExternalLink } from 'lucide-react';
import { EisService } from '@/services/eis';

export default function CertificatesPage() {
  const [mode, setMode] = useState<'generate' | 'verify' | 'list'>('generate');
  const [form, setForm] = useState({ recipientName: '', recipientEmail: '', certificateType: 'voluntariado', programName: '', hours: '', eventDate: '' });
  const [result, setResult] = useState<any>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    if (!form.recipientName || !form.programName) { setError('Nombre y programa son requeridos'); return; }
    setLoading(true); setError('');
    try {
      const res = await EisService.generateCertificate(form);
      setResult(res);
    } catch { setError('Error al generar certificado'); }
    setLoading(false);
  }

  async function handleVerify() {
    if (!verifyCode.trim()) { setError('Código de verificación requerido'); return; }
    setLoading(true); setError(''); setVerifyResult(null);
    try {
      const res = await EisService.verifyCertificate(verifyCode);
      setVerifyResult(res);
    } catch { setError('Error al verificar certificado'); }
    setLoading(false);
  }

  async function loadCertificates() {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        EisService.listCertificates(),
        EisService.certificatesStats(),
      ]);
      setCertificates((listRes as any).data || []);
      setStats(statsRes);
    } catch { setError('Error al cargar'); }
    setLoading(false);
  }

  const CERT_TYPES = [
    { value: 'voluntariado', label: 'Voluntariado' },
    { value: 'participacion', label: 'Participación' },
    { value: 'logro', label: 'Logro' },
    { value: 'culminacion', label: 'Culminación' },
    { value: 'reconocimiento', label: 'Reconocimiento' },
    { value: 'taller', label: 'Taller' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-lg">
          <Award size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Certificados</h1>
          <p className="text-sm text-neutral-500">Generación y verificación de certificados personalizados</p>
        </div>
      </div>

      <div className="mb-6 flex gap-2 border-b border-neutral-200 dark:border-neutral-700">
        {([
          { k: 'generate', l: 'Generar', i: Award },
          { k: 'verify', l: 'Verificar', i: Search },
          { k: 'list', l: 'Listado', i: ExternalLink },
        ] as const).map(t => (
          <button key={t.k} onClick={() => { setMode(t.k as typeof mode); if (t.k === 'list') loadCertificates(); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${mode === t.k ? 'border-b-2 border-amber-500 text-amber-600' : 'text-neutral-500 hover:text-neutral-700'}`}>
            <t.i size={16} /> {t.l}
          </button>
        ))}
      </div>

      {mode === 'generate' && (
        <div className="mx-auto max-w-lg space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Generar Certificado</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="mb-1 block text-xs text-neutral-400">Destinatario</label>
                  <input value={form.recipientName} onChange={e => setForm({ ...form, recipientName: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" /></div>
                <div><label className="mb-1 block text-xs text-neutral-400">Email</label>
                  <input type="email" value={form.recipientEmail} onChange={e => setForm({ ...form, recipientEmail: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="mb-1 block text-xs text-neutral-400">Tipo</label>
                  <select value={form.certificateType} onChange={e => setForm({ ...form, certificateType: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                    {CERT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div><label className="mb-1 block text-xs text-neutral-400">Programa</label>
                  <input value={form.programName} onChange={e => setForm({ ...form, programName: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Nombre del programa" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="mb-1 block text-xs text-neutral-400">Horas</label>
                  <input value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Ej: 40" /></div>
                <div><label className="mb-1 block text-xs text-neutral-400">Fecha</label>
                  <input type="date" value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" /></div>
              </div>
              <button onClick={handleGenerate} disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Award size={16} />}
                Generar Certificado
              </button>
            </div>
          </div>

          {result && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle size={20} /> <span className="font-medium">Certificado generado exitosamente</span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                <p><strong>Código:</strong> {result.verificationCode}</p>
                <p><strong>URL:</strong> <a href={result.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">{result.verificationUrl}</a></p>
              </div>
              {result.qrDataUrl && (
                <div className="mt-4">
                  <img src={result.qrDataUrl} alt="QR Code" className="h-32 w-32 rounded-lg border border-green-200 dark:border-green-800" />
                </div>
              )}
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}

      {mode === 'verify' && (
        <div className="mx-auto max-w-lg space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Verificar Certificado</h2>
            <div className="flex gap-2">
              <input value={verifyCode} onChange={e => setVerifyCode(e.target.value)}
                placeholder="Ingrese código de verificación"
                className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
              <button onClick={handleVerify} disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Verificar
              </button>
            </div>
          </div>

          {verifyResult && (
            <div className={`rounded-xl border p-6 ${verifyResult.valid ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'}`}>
              <div className="flex items-center gap-2">
                {verifyResult.valid ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <XCircle size={20} className="text-red-600" />
                )}
                <span className={`font-medium ${verifyResult.valid ? 'text-green-700' : 'text-red-700'}`}>
                  {verifyResult.valid ? 'Certificado Válido' : 'Certificado No Válido'}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{verifyResult.message}</p>
              {verifyResult.certificate && (
                <div className="mt-4 space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
                  <p><strong>Destinatario:</strong> {verifyResult.certificate.recipientName}</p>
                  <p><strong>Tipo:</strong> {verifyResult.certificate.certificateType}</p>
                  <p><strong>Programa:</strong> {verifyResult.certificate.programName}</p>
                  <p><strong>Emisión:</strong> {new Date(verifyResult.certificate.issuedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}

      {mode === 'list' && (
        <div className="space-y-4">
          {stats && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
                <p className="text-3xl font-bold text-amber-500">{stats.total || 0}</p>
                <p className="text-xs text-neutral-400">Total Emitidos</p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
                <p className="text-3xl font-bold text-green-500">{stats.active || 0}</p>
                <p className="text-xs text-neutral-400">Activos</p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
                <p className="text-3xl font-bold text-red-500">{stats.revoked || 0}</p>
                <p className="text-xs text-neutral-400">Revocados</p>
              </div>
            </div>
          )}

          {loading && <div className="text-center text-neutral-400"><Loader2 size={20} className="mx-auto animate-spin" /></div>}
          {certificates.map((c: any) => (
            <div key={c.id} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{c.recipientName}</p>
                  <p className="text-xs text-neutral-400">{c.certificateType} • {c.programName} • {c.verificationCode}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs ${c.revokedAt ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {c.revokedAt ? 'Revocado' : 'Activo'}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-400">Emitido: {new Date(c.issuedAt).toLocaleDateString()}</p>
            </div>
          ))}
          {!loading && certificates.length === 0 && <p className="text-center text-sm text-neutral-400">No hay certificados emitidos</p>}
        </div>
      )}
    </div>
  );
}

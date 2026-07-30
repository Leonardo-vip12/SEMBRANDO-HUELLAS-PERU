import { useState, useRef } from 'react';
import { Camera, Upload, Search, Loader2, AlertTriangle, BookOpen } from 'lucide-react';
import { EisService } from '@/services/eis';

export default function SpeciesV2Page() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setImage(URL.createObjectURL(f));
    setResult(null);
    setError('');
  }

  async function handleIdentify() {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await EisService.identifySpecies(fd);
      setResult(res);
    } catch {
      setError('Error al identificar la especie. Intenta con otra imagen.');
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 text-white shadow-lg">
          <Camera size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Identificador Avanzado de Especies</h1>
          <p className="text-sm text-neutral-500">Taxonomía completa, estado de conservación y datos ecológicos</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Sube una imagen</h2>
          <div onClick={() => fileRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 p-8 transition-colors hover:border-emerald-400 dark:border-neutral-600">
            {image ? (
              <img src={image} alt="Preview" className="max-h-64 rounded-lg object-contain" />
            ) : (
              <>
                <Upload size={40} className="mb-2 text-neutral-300" />
                <p className="text-sm text-neutral-400">Haz clic para subir una foto</p>
                <p className="text-xs text-neutral-300">JPG, PNG, WEBP</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          {image && (
            <button onClick={handleIdentify} disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              {loading ? 'Identificando...' : 'Identificar Especie'}
            </button>
          )}
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        <div className="space-y-4">
          {result && (
            <>
              <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{result.commonName || 'No identificado'}</h2>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${result.confidence > 0.8 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {Math.round((result.confidence || 0) * 100)}% confianza
                  </span>
                </div>
                <p className="mb-4 text-sm italic text-neutral-500">{result.scientificName}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-neutral-50 p-2 dark:bg-neutral-700/50"><span className="text-neutral-400">Reino:</span> <span className="font-medium">{result.kingdom || '-'}</span></div>
                  <div className="rounded-lg bg-neutral-50 p-2 dark:bg-neutral-700/50"><span className="text-neutral-400">Filo:</span> <span className="font-medium">{result.phylum || '-'}</span></div>
                  <div className="rounded-lg bg-neutral-50 p-2 dark:bg-neutral-700/50"><span className="text-neutral-400">Clase:</span> <span className="font-medium">{result.class || '-'}</span></div>
                  <div className="rounded-lg bg-neutral-50 p-2 dark:bg-neutral-700/50"><span className="text-neutral-400">Orden:</span> <span className="font-medium">{result.order || '-'}</span></div>
                  <div className="rounded-lg bg-neutral-50 p-2 dark:bg-neutral-700/50"><span className="text-neutral-400">Familia:</span> <span className="font-medium">{result.family || '-'}</span></div>
                  <div className="rounded-lg bg-neutral-50 p-2 dark:bg-neutral-700/50"><span className="text-neutral-400">Género:</span> <span className="font-medium">{result.genus || '-'}</span></div>
                </div>
              </div>

              {result.conservationStatus && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                  <AlertTriangle size={18} className="text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Estado de Conservación: {result.conservationStatus}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">{result.habitat || ''}</p>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Descripción</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">{result.description || 'No disponible'}</p>
              </div>

              {result.curiosities && result.curiosities.length > 0 && (
                <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100"><BookOpen size={16} /> Curiosidades</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
                    {result.curiosities.map((c: string, i: number) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}

              {result.threats && result.threats.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <h3 className="mb-2 text-sm font-semibold text-red-700 dark:text-red-300">Amenazas</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-red-600 dark:text-red-400">
                    {result.threats.map((t: string, i: number) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              )}

              {result.bibliography && result.bibliography.length > 0 && (
                <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                  <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Referencias</h3>
                  {result.bibliography.map((b: any, i: number) => (
                    <p key={i} className="text-xs text-neutral-500">{b.title}</p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

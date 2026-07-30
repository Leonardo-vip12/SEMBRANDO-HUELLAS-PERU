import { useState, useRef, useEffect } from 'react';
import { Send, User, GraduationCap, Loader2 } from 'lucide-react';
import { EisService } from '@/services/eis';

const LEVELS = [
  { value: 'primaria', label: 'Primaria' },
  { value: 'secundaria', label: 'Secundaria' },
  { value: 'universidad', label: 'Universidad' },
  { value: 'docente', label: 'Docente' },
  { value: 'investigador', label: 'Investigador' },
  { value: 'voluntario', label: 'Voluntario' },
  { value: 'empresa', label: 'Empresa' },
  { value: 'general', label: 'General' },
];

export default function TutorPage() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [level, setLevel] = useState('general');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const q = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const res = await EisService.tutorAsk(q, level);
      setMessages(prev => [...prev, { role: 'assistant', content: (res as any).response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, no pude procesar tu consulta.' }]);
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Tutor Adaptativo IA</h1>
          <p className="text-sm text-neutral-500">Aprendizaje personalizado para cada nivel educativo</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {LEVELS.map(l => (
          <button key={l.value} onClick={() => setLevel(l.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${level === l.value ? 'bg-emerald-500 text-white' : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'}`}>
            {l.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex-1 space-y-4 overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800" style={{ minHeight: 400, maxHeight: 500 }}>
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            Selecciona un nivel y escribe tu pregunta para comenzar
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                <GraduationCap size={16} />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <GraduationCap size={16} />
            </div>
            <div className="rounded-2xl bg-neutral-100 px-4 py-3 dark:bg-neutral-700">
              <Loader2 size={16} className="animate-spin text-neutral-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu pregunta educativa..." disabled={loading}
          className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
        <button onClick={handleSend} disabled={loading || !input.trim()}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-white transition-colors hover:bg-primary-600 disabled:opacity-50">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
}

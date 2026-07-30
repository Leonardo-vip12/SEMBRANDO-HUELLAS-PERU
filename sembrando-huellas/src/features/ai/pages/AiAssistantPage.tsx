import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { AiService } from '@/services/ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

const QUICK_ACTIONS = [
  '¿Qué especies viven en Ucayali?',
  '¿Cómo puedo reducir el uso de plástico?',
  '¿Qué actividades educativas recomiendas?',
  '¿Cómo participar como voluntario?',
  '¿Por qué es importante la Amazonía?',
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy el asistente inteligente de Sembrando Huellas Perú. Puedo ayudarte con información sobre la Amazonía, educación ambiental, flora, fauna, cambio climático, conservación y nuestros programas. ¿En qué puedo ayudarte hoy?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID?.() || Math.random().toString(36));
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function handleSend(query: string) {
    if (!query.trim() || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setLoading(true);

    try {
      const response = await AiService.askAssistant({ query, sessionId });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.response,
        suggestions: response.suggestions,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, no pude procesar tu consulta en este momento. Por favor intenta de nuevo más tarde.',
      }]);
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg">
          <Bot size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Asistente IA</h1>
          <p className="text-sm text-neutral-500">Asesor especializado en medio ambiente y conservación</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {QUICK_ACTIONS.map(action => (
          <button
            key={action}
            onClick={() => handleSend(action)}
            disabled={loading}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
          >
            <Sparkles size={12} className="mr-1 inline" />
            {action}
          </button>
        ))}
      </div>

      <div className="mb-4 flex-1 space-y-4 overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800" style={{ minHeight: 400, maxHeight: 500 }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
                <Bot size={16} />
              </div>
            )}
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : ''}`}>
              <div className={`rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {msg.suggestions.map((s, j) => (
                    <button
                      key={j}
                      onClick={() => handleSend(s)}
                      disabled={loading}
                      className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
              <Bot size={16} />
            </div>
            <div className="rounded-2xl bg-neutral-100 px-4 py-3 dark:bg-neutral-700">
              <Loader2 size={16} className="animate-spin text-neutral-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend(input)}
          placeholder="Escribe tu pregunta aquí..."
          disabled={loading}
          className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        />
        <button
          onClick={() => handleSend(input)}
          disabled={loading || !input.trim()}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
}

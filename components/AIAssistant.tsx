import React, { useState } from 'react';
import { Sparkles, Loader2, X } from 'lucide-react';
import { generateInvoiceItemDescription } from '../services/geminiService';

interface AIAssistantProps {
  onSuccess: (title: string, description: string) => void;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onSuccess, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateInvoiceItemDescription(prompt);
      onSuccess(result.title, result.description);
      onClose();
    } catch (err) {
      setError('خطایی در ارتباط با هوش مصنوعی رخ داد. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-lg">دستیار هوشمند جمینای</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            شرح مختصری از خدمات خود را بنویسید (مثلاً: "طراحی سایت فروشگاهی با ری‌اکت"). هوش مصنوعی عنوانی حرفه‌ای و توضیحات فنی کامل را برای فاکتور شما آماده می‌کند.
          </p>
          
          <form onSubmit={handleSubmit}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="مثال: پیاده‌سازی درگاه پرداخت زرین‌پال و پنل ادمین..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-32 resize-none mb-4"
              autoFocus
            />
            
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال تفکر...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تولید متن حرفه‌ای</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

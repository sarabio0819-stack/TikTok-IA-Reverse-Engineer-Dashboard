import { useState } from 'react';
import Head from 'next/head';
import { Search, Film, Copy, Image, FileText, Check, Layout, ExternalLink } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [copiedText, setCopiedText] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      const response = await fetch('/api/process-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: url }),
      });
      const result = await response.json();
      if (response.ok) {
        setData(result);
      } else {
        alert(result.error || 'Erro ao processar o vídeo.');
      }
    } catch (err) {
      alert('Erro ao conectar ao servidor de processamento.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <Head>
        <title>TikTok AI Video Deconstructor</title>
        <meta name="description" content="Análise e Engenharia Reversa de Vídeos de IA do TikTok" />
      </Head>

      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-3 pt-6">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-400 text-sm font-medium">
            <Film className="w-4 h-4" /> Mapeador de Vídeos IA TikTok
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
            Engenharia Reversa de Vídeos com IA
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
            Cole o link de um vídeo do TikTok para o servidor extrair as imagens âncoras reais, sugestões de prompts, transcrição e dados de contexto.
          </p>
        </header>

        <form onSubmit={handleAnalyze} className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-xl">
            <input
              type="url"
              required
              placeholder="https://www.tiktok.com/@usuario/video/123456789..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-transparent px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none text-sm md:text-base"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 whitespace-nowrap"
            >
              {loading ? (
                <span>A analisar no servidor...</span>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Extrair Vídeo Real</span>
                </>
              )}
            </button>
          </div>
        </form>

        {data && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold">
                    <FileText className="w-5 h-5" />
                    <h2>Transcrição & Legenda Real</h2>
                  </div>
                  <button
                    onClick={() => copyToClipboard(data.transcription, 'transcript')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition text-slate-300"
                  >
                    {copiedText === 'transcript' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedText === 'transcript' ? 'Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <p className="text-slate-300 text-sm md:text-base bg-slate-950 p-4 rounded-xl border border-slate-800">
                  "{data.transcription}"
                </p>
                <div className="pt-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Autor & Métricas:</h3>
                  <p className="text-xs text-slate-300">{data.summary}</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold border-b border-slate-800 pb-3">
                  <Layout className="w-5 h-5" />
                  <h2>Estrutura do Vídeo</h2>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-indigo-400 font-semibold block mb-1">Duração:</span>
                    <p className="text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">{data.duration}</p>
                  </div>
                  <div>
                    <span className="text-indigo-400 font-semibold block mb-1">Criador:</span>
                    <p className="text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">{data.author}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xl font-bold text-slate-100">
                  <Image className="w-6 h-6 text-indigo-400" />
                  <h2>Imagens Âncoras Extraídas do Vídeo</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.storyboard.map((item, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                    <div className="relative aspect-video bg-slate-950">
                      <img src={item.image} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-slate-950/80 px-2.5 py-1 rounded text-xs font-mono border border-slate-800">
                        {item.timestamp}
                      </div>
                    </div>

                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-indigo-400">Prompt Sugerido da Imagem:</span>
                            <button
                              onClick={() => copyToClipboard(item.prompt, `prompt-${idx}`)}
                              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                            >
                              {copiedText === `prompt-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              {copiedText === `prompt-${idx}` ? 'Copiado' : 'Copiar Prompt'}
                            </button>
                          </div>
                          <p className="text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-slate-300">
                            {item.prompt}
                          </p>
                        </div>
                      </div>

                      <a
                        href={item.image}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2.5 rounded-xl text-center font-medium transition flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Abrir Imagem do Vídeo em Alta Definição
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

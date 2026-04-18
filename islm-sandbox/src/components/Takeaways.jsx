import { Info, AlertTriangle, TrendingUp } from 'lucide-react';

const iconMap = {
  crowdout: AlertTriangle,
  supply: AlertTriangle,
  panic: AlertTriangle,
  neutral: Info,
};

const colorMap = {
  crowdout: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  supply: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  panic: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  fiscal: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  money: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  tax: 'text-slate-300 bg-slate-700/50 border-slate-600',
  rate: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  neutral: 'text-slate-400 bg-slate-700/30 border-slate-700',
};

export default function Takeaways({ takeaways }) {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
      <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
        <TrendingUp size={18} className="text-indigo-400" />
        Key Takeaways
      </h2>
      <div className="space-y-2">
        {takeaways.map(({ id, text }) => {
          const Icon = iconMap[id] ?? Info;
          const cls = colorMap[id] ?? colorMap.neutral;
          return (
            <div key={id} className={`flex gap-2.5 p-3 rounded-xl border text-sm ${cls}`}>
              <Icon size={15} className="mt-0.5 shrink-0" />
              <p className="leading-relaxed">{text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

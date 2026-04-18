import { Zap, TrendingDown } from 'lucide-react';

function SliderControl({ label, symbol, value, min, max, step = 10, onChange, color = 'indigo' }) {
  const pct = ((value - min) / (max - min)) * 100;
  const colorMap = {
    indigo: 'accent-indigo-400',
    rose: 'accent-rose-400',
    emerald: 'accent-emerald-400',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-300">
          {label} <span className="text-slate-500 font-mono text-xs">({symbol})</span>
        </label>
        <span className="font-mono text-sm text-amber-400 bg-slate-700 px-2 py-0.5 rounded">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-full cursor-pointer ${colorMap[color]}`}
        style={{
          background: `linear-gradient(to right, ${color === 'indigo' ? '#818cf8' : color === 'rose' ? '#fb7185' : '#34d399'} ${pct}%, #334155 ${pct}%)`,
        }}
      />
      <div className="flex justify-between text-xs text-slate-600">
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

function ShockButton({ icon: Icon, label, sublabel, active, onClick, colorClass }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
        active
          ? `${colorClass} border-current`
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-700/50'
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className={active ? '' : 'text-slate-400'} />
        <span className={`text-sm font-medium ${active ? '' : 'text-slate-300'}`}>{label}</span>
        {active && (
          <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-black/20 font-mono">ON</span>
        )}
      </div>
      <p className={`text-xs mt-1 ${active ? 'opacity-80' : 'text-slate-500'}`}>{sublabel}</p>
    </button>
  );
}

export default function Sidebar({ G, setG, T, setT, M, setM, applyShock, shockLM, shockIS }) {
  return (
    <div className="space-y-6">
      {/* Fiscal Policy */}
      <section>
        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          Fiscal Policy
        </h3>
        <div className="space-y-5">
          <SliderControl
            label="Gov. Spending" symbol="G"
            value={G} min={0} max={600}
            onChange={setG} color="indigo"
          />
          <SliderControl
            label="Taxes" symbol="T"
            value={T} min={0} max={500}
            onChange={setT} color="rose"
          />
        </div>
      </section>

      {/* Monetary Policy */}
      <section>
        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Monetary Policy
        </h3>
        <SliderControl
          label="Money Supply" symbol="M"
          value={M} min={100} max={1000}
          onChange={setM} color="emerald"
        />
      </section>

      {/* Shocks */}
      <section>
        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Shock Events
        </h3>
        <div className="space-y-2">
          <ShockButton
            icon={Zap}
            label="Supply Shock"
            sublabel="Shifts LM left — raises rates, squeezes output"
            active={shockLM !== 0}
            onClick={() => applyShock('supply')}
            colorClass="text-amber-400 bg-amber-400/10 border-amber-400/40"
          />
          <ShockButton
            icon={TrendingDown}
            label="Consumer Panic"
            sublabel="Shifts IS left — demand collapse, recession risk"
            active={shockIS !== 0}
            onClick={() => applyShock('panic')}
            colorClass="text-rose-400 bg-rose-400/10 border-rose-400/40"
          />
        </div>
      </section>
    </div>
  );
}

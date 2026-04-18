import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceDot, Legend,
} from 'recharts';

const CustomDot = (props) => {
  const { cx, cy } = props;
  return (
    <circle
      cx={cx} cy={cy} r={7}
      fill="#f59e0b" stroke="#fff" strokeWidth={2}
      className="equilibrium-dot"
    />
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm shadow-xl">
      <p className="text-slate-400 mb-1">Y = {label}</p>
      {payload.map(p => p.value != null && (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: r = {Number(p.value).toFixed(2)}%
        </p>
      ))}
    </div>
  );
};

export default function ISLMChart({ mergedPoints, equilibrium, ghostEq }) {
  const { Y: eqY, r: eqR } = equilibrium;

  // Filter to a readable Y domain
  const visiblePoints = mergedPoints.filter(p => p.Y <= 1400);

  const rValues = visiblePoints.flatMap(p =>
    [p.IS, p.LM, p.ghostIS, p.ghostLM].filter(v => v != null)
  );
  const rMin = Math.floor(Math.min(...rValues) - 1);
  const rMax = Math.ceil(Math.max(...rValues) + 1);

  return (
    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-200">IS-LM Diagram</h2>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-indigo-400 inline-block rounded" />
            <span className="text-slate-400">IS Curve</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-emerald-400 inline-block rounded" />
            <span className="text-slate-400">LM Curve</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span className="text-slate-400">Equilibrium</span>
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={visiblePoints} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="Y"
            label={{ value: 'Output (Y)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }}
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickCount={8}
          />
          <YAxis
            domain={[rMin, rMax]}
            label={{ value: 'Interest Rate (r %)', angle: -90, position: 'insideLeft', offset: 15, fill: '#94a3b8', fontSize: 12 }}
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Ghost curves */}
          <Line dataKey="ghostIS" stroke="#6366f1" strokeWidth={1} strokeDasharray="4 4"
            dot={false} strokeOpacity={0.3} legendType="none" name="Ghost IS" />
          <Line dataKey="ghostLM" stroke="#10b981" strokeWidth={1} strokeDasharray="4 4"
            dot={false} strokeOpacity={0.3} legendType="none" name="Ghost LM" />

          {/* Active curves */}
          <Line dataKey="IS" stroke="#818cf8" strokeWidth={2.5} dot={false} name="IS" />
          <Line dataKey="LM" stroke="#34d399" strokeWidth={2.5} dot={false} name="LM" />

          {/* Equilibrium dot */}
          {eqY >= 0 && eqY <= 1400 && (
            <ReferenceDot
              x={Math.round(eqY / 20) * 20}
              y={eqR}
              r={8}
              fill="#f59e0b"
              stroke="#fff"
              strokeWidth={2}
            />
          )}

          {/* Ghost equilibrium */}
          {ghostEq && ghostEq.Y >= 0 && ghostEq.Y <= 1400 && (
            <ReferenceDot
              x={Math.round(ghostEq.Y / 20) * 20}
              y={ghostEq.r}
              r={5}
              fill="#94a3b8"
              stroke="#475569"
              strokeWidth={1.5}
              fillOpacity={0.5}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-3 flex gap-6 justify-center text-sm">
        <div className="text-center">
          <span className="text-slate-500 text-xs uppercase tracking-wider">Eq. Output</span>
          <p className="text-amber-400 font-mono font-semibold text-base">{eqY.toFixed(0)}</p>
        </div>
        <div className="text-center">
          <span className="text-slate-500 text-xs uppercase tracking-wider">Eq. Rate</span>
          <p className="text-amber-400 font-mono font-semibold text-base">{eqR.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
}

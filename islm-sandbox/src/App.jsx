import useMacroModel from './hooks/useMacroModel';
import ISLMChart from './components/ISLMChart';
import Sidebar from './components/Sidebar';
import Takeaways from './components/Takeaways';
import './index.css';

export default function App() {
  const model = useMacroModel();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Policy Sandbox
              <span className="ml-2 text-indigo-400 font-light">IS-LM</span>
            </h1>
            <p className="text-xs text-slate-500">Interactive macroeconomic equilibrium model</p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
            <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">Y* = {model.equilibrium.Y.toFixed(0)}</span>
            <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">r* = {model.equilibrium.r.toFixed(2)}%</span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6">

          {/* Sidebar */}
          <aside className="xl:order-first">
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700 p-5 xl:sticky xl:top-20">
              <Sidebar
                G={model.G} setG={model.setG}
                T={model.T} setT={model.setT}
                M={model.M} setM={model.setM}
                applyShock={model.applyShock}
                shockLM={model.shockLM}
                shockIS={model.shockIS}
              />
            </div>
          </aside>

          {/* Chart + Takeaways */}
          <div className="space-y-5">
            <ISLMChart
              mergedPoints={model.mergedPoints}
              equilibrium={model.equilibrium}
              ghostEq={model.ghostEq}
            />
            <Takeaways takeaways={model.takeaways} />

            {/* Equation reference */}
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-4">
              <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-3">Model Equations</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm font-mono">
                <div className="bg-slate-800 rounded-lg p-3 border border-indigo-500/20">
                  <span className="text-indigo-400 text-xs uppercase tracking-wider block mb-1">IS Curve</span>
                  <span className="text-slate-300 text-xs">r = (A+G−cT)/d − ((1−c)/d)·Y</span>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 border border-emerald-500/20">
                  <span className="text-emerald-400 text-xs uppercase tracking-wider block mb-1">LM Curve</span>
                  <span className="text-slate-300 text-xs">r = (k/h)·Y − (1/h)·(M/P)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

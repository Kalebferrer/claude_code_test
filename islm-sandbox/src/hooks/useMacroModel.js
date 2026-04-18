import { useState, useMemo, useRef, useEffect } from 'react';

// IS curve: r = (A + G - c*T)/d - ((1-c)/d)*Y
// LM curve: r = (k/h)*Y - (1/h)*(M/P)
//
// Fixed structural params (reasonable textbook values)
const FIXED = {
  A: 200,  // autonomous spending
  c: 0.75, // marginal propensity to consume
  d: 500,  // interest sensitivity of investment
  k: 0.25, // income sensitivity of money demand
  h: 200,  // interest sensitivity of money demand
  P: 1,    // price level (fixed)
};

function solveEquilibrium(params) {
  const { A, c, d, k, h, P, G, T, M } = params;
  // Set IS = LM and solve for Y:
  // (A+G-c*T)/d - ((1-c)/d)*Y = (k/h)*Y - (1/h)*(M/P)
  // (A+G-c*T)/d + (1/h)*(M/P) = Y*((1-c)/d + k/h)
  const lhs = (A + G - c * T) / d + (1 / h) * (M / P);
  const slope = (1 - c) / d + k / h;
  const Y = lhs / slope;
  const r = (k / h) * Y - (1 / h) * (M / P);
  return { Y: Math.max(0, Y), r };
}

function buildISPoints(params, yRange) {
  const { A, c, d, G, T } = params;
  return yRange.map(Y => ({
    Y,
    r: Math.max(-5, (A + G - c * T) / d - ((1 - c) / d) * Y),
  }));
}

function buildLMPoints(params, yRange) {
  const { k, h, P, M } = params;
  return yRange.map(Y => ({
    Y,
    r: (k / h) * Y - (1 / h) * (M / P),
  }));
}

const Y_RANGE = Array.from({ length: 80 }, (_, i) => i * 20); // 0..1580

export default function useMacroModel() {
  const [G, setG] = useState(300);
  const [T, setT] = useState(200);
  const [M, setM] = useState(500);
  const [shockLM, setShockLM] = useState(0);
  const [shockIS, setShockIS] = useState(0);

  const prevParamsRef = useRef(null);

  const params = useMemo(() => ({
    ...FIXED,
    G: G + shockIS,
    T,
    M: M + shockLM,
  }), [G, T, M, shockLM, shockIS]);

  const equilibrium = useMemo(() => solveEquilibrium(params), [params]);
  const isPoints = useMemo(() => buildISPoints(params, Y_RANGE), [params]);
  const lmPoints = useMemo(() => buildLMPoints(params, Y_RANGE), [params]);

  // Ghost: capture prev curves when params change
  const [ghostIS, setGhostIS] = useState(null);
  const [ghostLM, setGhostLM] = useState(null);
  const [ghostEq, setGhostEq] = useState(null);

  const prevParamsStr = useRef(null);
  const currentStr = JSON.stringify(params);

  useEffect(() => {
    if (prevParamsStr.current && prevParamsStr.current !== currentStr) {
      const prev = JSON.parse(prevParamsStr.current);
      setGhostIS(buildISPoints(prev, Y_RANGE));
      setGhostLM(buildLMPoints(prev, Y_RANGE));
      setGhostEq(solveEquilibrium(prev));
    }
    prevParamsStr.current = currentStr;
  }, [currentStr]);

  const mergedPoints = useMemo(() => {
    return Y_RANGE.map((Y, i) => ({
      Y,
      IS: isPoints[i].r,
      LM: lmPoints[i].r,
      ghostIS: ghostIS ? ghostIS[i].r : null,
      ghostLM: ghostLM ? ghostLM[i].r : null,
    }));
  }, [isPoints, lmPoints, ghostIS, ghostLM]);

  const takeaways = useMemo(() => {
    const msgs = [];
    const { Y, r } = equilibrium;

    if (r > 8) msgs.push({ id: 'rate', text: 'Interest rates are elevated — borrowing costs are high, potentially crowding out private investment.' });
    else if (r < 2) msgs.push({ id: 'rate', text: 'Interest rates are low — monetary conditions are loose, stimulating borrowing and investment.' });

    if (G > 350) msgs.push({ id: 'fiscal', text: 'Expansionary fiscal policy: higher government spending is boosting aggregate demand.' });
    if (T > 300) msgs.push({ id: 'tax', text: 'Higher taxes are reducing disposable income, dampening consumer spending.' });
    if (M > 600) msgs.push({ id: 'money', text: 'Expanded money supply is shifting the LM curve right, lowering interest rates.' });
    if (shockLM < 0) msgs.push({ id: 'supply', text: 'Supply shock: LM has shifted left, raising rates and squeezing output.' });
    if (shockIS < 0) msgs.push({ id: 'panic', text: 'Consumer panic: IS has shifted left as confidence collapses, reducing spending.' });

    if (G > 300 && r > 6) msgs.push({ id: 'crowdout', text: 'Crowding out is occurring: government borrowing is raising rates, offsetting fiscal stimulus.' });

    if (msgs.length === 0) msgs.push({ id: 'neutral', text: 'Economy is near neutral — no major imbalances detected.' });

    return msgs;
  }, [equilibrium, G, T, M, shockLM, shockIS]);

  function applyShock(type) {
    if (type === 'supply') {
      setShockLM(v => v === -150 ? 0 : -150);
    } else if (type === 'panic') {
      setShockIS(v => v === -200 ? 0 : -200);
    }
  }

  return {
    G, setG,
    T, setT,
    M, setM,
    equilibrium,
    mergedPoints,
    ghostEq,
    takeaways,
    applyShock,
    shockLM,
    shockIS,
  };
}

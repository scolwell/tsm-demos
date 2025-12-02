// Pure JS sample size function mirroring app logic (normal-approx based)
// Requires jStat (optional; falls back to z approximations if missing)

function computeSampleSizeJS({ testType, d, power, alpha, alternative }) {
  const twoTailed = (alternative !== 'one.sided' && alternative !== 'greater');
  const beta = 1 - power;
  let zAlpha, zBeta;
  if (typeof jStat !== 'undefined' && jStat.normal) {
    zAlpha = twoTailed ? jStat.normal.inv(1 - alpha / 2, 0, 1) : jStat.normal.inv(1 - alpha, 0, 1);
    zBeta = jStat.normal.inv(1 - beta, 0, 1);
  } else {
    zAlpha = twoTailed ? 1.96 : 1.645;
    // Rough default; not used if jStat available
    zBeta = power === 0.8 ? 0.84 : (power === 0.9 ? 1.282 : 0.84);
  }

  let base;
  if (testType === 'two-sample') {
    // n per group = 2 * ((zAlpha + zBeta)/d)^2; total = 2 * n_per
    const nPer = 2 * Math.pow((zAlpha + zBeta) / d, 2);
    base = 2 * nPer; // total N
  } else {
    // one-sample or paired
    base = Math.pow((zAlpha + zBeta) / d, 2);
  }
  const n0 = Math.ceil(base);
  return { n_total: n0, n_per: testType === 'two-sample' ? Math.ceil(n0 / 2) : n0 };
}

function runCases() {
  const cases = [
    { id: 1, testType: 'single-sample', d: 0.5, power: 0.80, alpha: 0.05, alternative: 'two.sided' },
    { id: 2, testType: 'paired',        d: 0.5, power: 0.80, alpha: 0.05, alternative: 'two.sided' },
    { id: 3, testType: 'two-sample',    d: 0.5, power: 0.80, alpha: 0.05, alternative: 'two.sided' },
    { id: 4, testType: 'two-sample',    d: 0.8, power: 0.90, alpha: 0.05, alternative: 'two.sided' },
    { id: 5, testType: 'single-sample', d: 0.2, power: 0.80, alpha: 0.05, alternative: 'two.sided' },
    { id: 6, testType: 'paired',        d: 0.5, power: 0.80, alpha: 0.01, alternative: 'greater'   },
    { id: 7, testType: 'two-sample',    d: 0.3, power: 0.80, alpha: 0.05, alternative: 'two.sided' },
    { id: 8, testType: 'single-sample', d: 0.7, power: 0.95, alpha: 0.05, alternative: 'two.sided' }
  ];
  const results = cases.map(c => {
    const comp = computeSampleSizeJS(c);
    return { ...c, ...comp };
  });
  return results;
}

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function render() {
  const out = runCases();
  const pre = document.getElementById('jsResults');
  pre.textContent = JSON.stringify(out, null, 2);
  const btn = document.getElementById('downloadJs');
  btn.addEventListener('click', () => downloadJSON('js_results.json', out));
}

window.addEventListener('DOMContentLoaded', render);

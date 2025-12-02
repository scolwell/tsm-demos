# Testing the Sample Size Estimator Against R (in VS Code)

This quick harness lets you compare the JS estimator outputs with R's `pwr` package using VS Code (no RStudio required).

## Prereqs

- VS Code
- R installed on your Mac (you already have this)
- Recommended VS Code extensions (optional but helpful):
  - "R" by R Editor Support (ID: `REditorSupport.r`)
  - "R Language Server" (ID: `REditorSupport.r-lsp`)

## Files

- `tests/compare_pwr.R` — runs `pwr.t.test` on a handful of cases and writes `tests/r_results.json`
- `tests/compare_js.html` + `tests/js_compute.js` — runs the JS math (normal-approx as in app) and lets you download `tests/js_results.json`

## Steps

1) Generate R baselines

- In VS Code, open an integrated terminal in the project folder and run:

```bash
Rscript tests/compare_pwr.R
```

- This creates `tests/r_results.json`.

2) Generate JS outputs

- Open `tests/compare_js.html` in your browser (double-click in Finder or right-click → Open with Live Preview if you have it).
- Click "Download js_results.json" to save the JS outputs.

3) Compare

- Open both JSON files side-by-side in VS Code and scan for differences:
  - For two-sample t-tests, note that R returns per-group `n`; our JS harness returns total `n_total` and `n_per`. For apples-to-apples, compare `r_results.json.n_total` to `js_results.json.n_total`.
  - Small differences can occur because the JS estimator uses normal approximations for sample size, while `pwr` uses non-central t.

## Notes

- The app’s power curve uses a non-central t calculation for achieved power at a given N, but the a-priori sample size formula uses z-based approximations (matching the harness). That’s why you may see small differences vs pwr.
- Finite Population Correction and design effects are intentionally not part of this parity test—they're design-layer adjustments beyond the base t-test power formula.

## Next ideas (optional)

- Add more cases or CSV-driven cases.
- Add a tiny comparator script to highlight percentage differences.
- Expand to proportions/ANOVA once those are implemented in the app.

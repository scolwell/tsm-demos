# Testing the Sample Size Estimator Against R (in VS Code)

This testing suite lets you compare the JS estimator outputs with R's `pwr` package using VS Code (no RStudio required).

## Prereqs

- VS Code
- R installed on your Mac (you already have this)
- Recommended VS Code extensions (optional but helpful):
  - "R" by R Editor Support (ID: `REditorSupport.r`)
  - "R Language Server" (ID: `REditorSupport.r-lsp`)

## Test Suites

### 1. Basic Parity Test (8 cases)

Quick validation with a handful of test cases.

**Files:**
- `tests/compare_pwr.R` — runs `pwr.t.test` on 8 cases and writes `tests/r_results.json`
- `tests/compare_js.html` + `tests/js_compute.js` — runs the JS math and lets you download `tests/js_results.json`

**Steps:**

1) Generate R baselines

```bash
Rscript tests/compare_pwr.R
```

2) Generate JS outputs

- Open `tests/compare_js.html` in your browser
- Click "Download js_results.json"

3) Compare

- Open both JSON files side-by-side in VS Code

### 2. Comprehensive Test Suite (864 cases)

Full cross-check of all combinations:
- **3 test types** (single-sample, paired, two-sample)
- **3 power levels** (0.60, 0.70, 0.80)
- **3 effect sizes** (0.2, 0.5, 0.8 - small, medium, large)
- **2 significance levels** (0.05, 0.01)
- **2 test directions** (two-sided, one-sided)
- **4 sampling methods** (simple, stratified, cluster, systematic)
- **2 extraction methods** (with replacement, without replacement)

**Total: 864 unique test cases**

**Files:**
- `tests/comprehensive_test.R` — R implementation with pwr package
- `tests/comprehensive_test.html` — JS implementation with app logic
- `tests/compare_comprehensive.R` — Automated comparison script

**Steps:**

1) **Generate R baselines (864 cases)**

```bash
Rscript tests/comprehensive_test.R
```

This creates:
- `tests/comprehensive_results.json` - Full results
- `tests/comprehensive_results.csv` - Summary table

2) **Generate JS results (864 cases)**

```bash
# Open the test page in browser
open tests/comprehensive_test.html
```

- Click "Run All 864 Tests"
- Wait for completion (~5-10 seconds)
- Click "Download Results (JSON)" to save `js_comprehensive_results.json`
- Move the downloaded file to the `tests/` folder

3) **Run automated comparison**

```bash
Rscript tests/compare_comprehensive.R
```

This creates:
- `tests/comparison_results.csv` - Detailed comparison for all 864 cases
- `tests/comparison_summary.json` - Summary statistics

**What to expect:**
- Match rates (% of exact matches)
- Mean/max absolute differences
- Mean percentage differences
- Top 10 cases with largest discrepancies
- Breakdown by test parameters

## Understanding Results

### Expected Differences

Small differences between R and JS are normal and occur due to:

1. **Distributional approximations**
   - JS uses normal (z) approximations for sample size
   - R `pwr` uses non-central t distribution
   - Typically <5% difference, larger for small effect sizes

2. **Rounding conventions**
   - Both ceil() to integers, but at different stages
   - Can cause ±1 sample size differences

3. **Design effects** (comprehensive test only)
   - Stratified: 20% reduction (DEFF = 0.8)
   - Cluster: DEFF = 1 + (m-1)×ICC, assumes m=25, ICC=0.05
   - Systematic: No adjustment (DEFF = 1)

4. **Finite Population Correction** (comprehensive test only)
   - Applied when extraction = "without-replacement"
   - Assumes N = 1000 for testing
   - Formula: n_adj = n / (1 + n/N)

### Interpreting Comparison Output

```
=== COMPARISON SUMMARY ===
Total cases compared: 864
Exact matches (base n): 245 (85.1%)     ← Before design effects
Exact matches (final n): 238 (82.6%)    ← After all adjustments

Base n differences:
  Mean absolute diff: 1.23               ← Average difference
  Max absolute diff: 8                   ← Worst case
  Mean % diff: 2.45%                     ← Average % error

Final n differences (with adjustments):
  Mean absolute diff: 1.56
  Max absolute diff: 12
  Mean % diff: 2.89%
```

**Good results:**
- Match rate >80%
- Mean % diff <5%
- Max absolute diff <10

**Investigate if:**
- Match rate <70%
- Mean % diff >10%
- Max absolute diff >20

## Two-Sample Tests

For two-sample t-tests, note that R returns per-group `n`:
- R `n_per_group` = sample size per group
- Total N = 2 × `n_per_group`

Compare:
- `r_results.n_total` to `js_results.n_total`
- `r_results.n_per_group` to `js_results.n_per_group`

## Notes

- The app's power curve uses a non-central t calculation for achieved power at a given N, but the a-priori sample size formula uses z-based approximations (matching the harness). That's why you may see small differences vs pwr.
- Finite Population Correction and design effects are tested in the comprehensive suite but not the basic parity test.

## Quick Test Checklist

```bash
# Full validation workflow
Rscript tests/comprehensive_test.R
open tests/comprehensive_test.html
# (Run tests, download JSON, move to tests/)
Rscript tests/compare_comprehensive.R
# Review comparison_results.csv and comparison_summary.json
```

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

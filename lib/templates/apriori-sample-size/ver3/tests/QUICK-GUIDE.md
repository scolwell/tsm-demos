# Quick Test Guide

## Run All 864 Comprehensive Tests

### Step 1: Run R Tests
```bash
cd "/Users/scott/Sync/The Statistical Mind/Apps/sample-size/apps/ss2/Sample Size Estimator Tool/ver2"
Rscript tests/comprehensive_test.R
```

**Output:**
- `tests/comprehensive_results.json`
- `tests/comprehensive_results.csv`

### Step 2: Run JS Tests
```bash
open tests/comprehensive_test.html
```

**In Browser:**
1. Click "Run All 864 Tests"
2. Wait for completion (~5-10 seconds)
3. Click "Download Results (JSON)"
4. Move `js_comprehensive_results.json` to `tests/` folder

### Step 3: Compare Results
```bash
Rscript tests/compare_comprehensive.R
```

**Output:**
- `tests/comparison_results.csv` - All 864 case comparisons
- `tests/comparison_summary.json` - Statistical summary

### Step 4: Review Results

**Open in VS Code:**
- `tests/comparison_summary.json` - Quick overview
- `tests/comparison_results.csv` - Detailed breakdown

**Key Metrics to Check:**
- Match rate should be >80%
- Mean % difference should be <5%
- Max absolute difference should be <10

---

## Test Matrix

| Parameter | Values | Count |
|-----------|--------|-------|
| Test Type | Single-sample, Paired, Two-sample | 3 |
| Power | 0.60, 0.70, 0.80 | 3 |
| Effect Size | 0.2 (small), 0.5 (medium), 0.8 (large) | 3 |
| Significance | 0.05, 0.01 | 2 |
| Direction | Two-sided, One-sided | 2 |
| Sampling | Simple, Stratified, Cluster, Systematic | 4 |
| Extraction | With replacement, Without replacement | 2 |

**Total combinations:** 3 × 3 × 3 × 2 × 2 × 4 × 2 = **864 tests**

---

## What Gets Tested

### Base Calculations (R pwr package vs JS)
- Sample size for given power, effect size, significance
- Per-group vs total sample size (two-sample tests)
- One-sided vs two-sided tests

### Design Effects
- **Simple Random**: No adjustment (baseline)
- **Stratified**: 20% reduction (DEFF = 0.8)
- **Cluster**: DEFF = 1 + (m-1)×ICC (assumes m=25, ICC=0.05)
- **Systematic**: No adjustment (DEFF = 1)

### Finite Population Correction
- **With replacement**: No correction
- **Without replacement**: FPC applied (assumes N=1000)
  - Formula: n_adj = n / (1 + n/N)

---

## Expected Results

### Good Validation:
```
=== COMPARISON SUMMARY ===
Total cases compared: 864
Exact matches (base n): 245 (85.1%)
Exact matches (final n): 238 (82.6%)

Base n differences:
  Mean absolute diff: 1.23
  Max absolute diff: 8
  Mean % diff: 2.45%
```

### Issues to Investigate:
- Match rate <70% → Systematic calculation error
- Mean % diff >10% → Approximation problems
- Max diff >20 → Specific edge case failure

---

## Troubleshooting

### "R results not found"
```bash
Rscript tests/comprehensive_test.R
```

### "JS results not found"
- Open `tests/comprehensive_test.html` in browser
- Click "Run All 864 Tests"
- Download JSON
- Move to `tests/` folder as `js_comprehensive_results.json`

### "Different number of cases"
- Ensure both test files use same parameter grid
- Check that no test cases failed in either implementation

### Large discrepancies in specific cases
1. Open `tests/comparison_results.csv`
2. Filter by `n_base_diff` or `n_final_diff`
3. Look for patterns (e.g., all small effect sizes, all cluster sampling)
4. Check calculation logic for those specific conditions

---

## Files Generated

```
tests/
├── comprehensive_test.R              # R test script
├── comprehensive_test.html           # JS test page
├── compare_comprehensive.R           # Comparison script
├── comprehensive_results.json        # R results (864 cases)
├── comprehensive_results.csv         # R results (table)
├── js_comprehensive_results.json     # JS results (864 cases)
├── comparison_results.csv            # Detailed comparison
└── comparison_summary.json           # Summary statistics
```

---

## One-Line Test Command

```bash
Rscript tests/comprehensive_test.R && open tests/comprehensive_test.html && echo "⚠️  After running browser tests and downloading JSON, run: Rscript tests/compare_comprehensive.R"
```

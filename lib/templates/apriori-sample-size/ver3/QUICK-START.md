# TSM Calculator Generator - Quick Reference

## Generate a Calculator

```bash
node build/generate.js calculators/confidence-interval/config.json
```

## File Structure

```
calculators/confidence-interval/
├── config.json          # Calculator configuration
├── formulas.js          # Calculation logic
└── index.html          # Generated HTML (auto-created)
```

## Create New Calculator (3 Steps)

### 1. Create folder & config
```bash
mkdir -p calculators/my-calculator
cp calculators/confidence-interval/config.json calculators/my-calculator/
```

### 2. Edit config.json
- Update `metadata.title` and `description`
- Modify `leftPanels` controls
- Define `rightPanels` metrics
- Set up calculations

### 3. Write formulas.js
```javascript
class MyCalculator extends SampleSizeEstimator {
  calculateSampleSize() {
    // Your calculation logic
    return {
      sampleSize: 100,
      // other metrics
    };
  }
  
  generateRCode() {
    return `# Your R code`;
  }
}

window.calculator = new MyCalculator();
```

### 4. Generate HTML
```bash
node build/generate.js calculators/my-calculator/config.json
```

## Control Types

### Slider with Stepper
```json
{
  "type": "slider-with-stepper",
  "id": "sampleSize",
  "label": "Sample Size (n)",
  "min": 5,
  "max": 500,
  "step": 1,
  "default": 30
}
```

### Slider with Value Display
```json
{
  "type": "slider-with-value",
  "id": "confidenceLevel",
  "label": "Confidence Level",
  "min": 0.8,
  "max": 0.99,
  "step": 0.01,
  "default": 0.95,
  "valueDisplay": "percent"
}
```

### Select Dropdown
```json
{
  "type": "select",
  "id": "testType",
  "label": "Test Type",
  "options": [
    {"value": "mean", "label": "Mean"},
    {"value": "proportion", "label": "Proportion"}
  ],
  "default": "mean"
}
```

### Segmented Toggle
```json
{
  "type": "segmented",
  "id": "distribution",
  "label": "Distribution",
  "options": [
    {"value": "t", "label": "t-distribution"},
    {"value": "z", "label": "z-distribution"}
  ],
  "default": "t"
}
```

## Tips

- **Reuse the base class**: Extend `SampleSizeEstimator` for common functionality
- **Override key methods**: `calculateSampleSize()`, `generateRCode()`, `generateROutput()`
- **Test incremental**: Generate after each major config change
- **Share CSS/JS**: All calculators use the same `style.css` and `script.js`

## Time Savings

- **Manual**: ~4 hours per calculator
- **With generator**: ~15 minutes per calculator
- **Result**: 16x faster! ⚡

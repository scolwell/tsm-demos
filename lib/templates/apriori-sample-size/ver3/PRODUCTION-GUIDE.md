# TSM Calculator Production System

## Quick Start Guide

This guide shows you how to efficiently produce 15+ TSM calculators using your a-priori sample size calculator as the design template.

## Recommended Approach: Template + Config System

### Structure

```
tsm-calculators/
├── shared/               # Reusable assets
│   ├── css/
│   │   └── tsm-calc.css     # Your current style.css (shared)
│   ├── js/
│   │   ├── tsm-base.js      # Core calculator logic
│   │   └── plotly.min.js    # Charting library
│   └── templates/
│       ├── base.html        # Main HTML structure
│       └── components/      # Reusable HTML components
├── calculators/          # Individual calculator instances
│   ├── apriori-sample/
│   │   ├── config.json
│   │   ├── formulas.js
│   │   └── index.html (auto-generated)
│   ├── effect-size/
│   └── power-analysis/
└── build/
    └── generate.js       # Build script
```

---

## Step-by-Step Implementation

### Step 1: Extract Shared Components

**Create `shared/templates/base.html`:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{TITLE}} | TSM Calculators</title>
  <link rel="stylesheet" href="../../shared/css/tsm-calc.css">
</head>
<body>
  <div class="app-container">
    {{HEADER}}
    {{INFO_BANNER}}
    {{TAB_NAVIGATION}}
    
    <div class="content-wrapper">
      <div class="left-panel">
        {{LEFT_PANELS}}
      </div>
      
      <div class="right-panel">
        {{RESULTS_CARD}}
        {{VISUALIZATION_CARD}}
        {{CODE_SECTION}}
      </div>
    </div>
    
    {{FOOTER}}
    {{MODAL}}
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/jstat@1.9.6/dist/jstat.min.js"></script>
  <script src="https://cdn.plot.ly/plotly-2.32.0.min.js"></script>
  <script src="../../shared/js/tsm-base.js"></script>
  <script src="formulas.js"></script>
</body>
</html>
```

### Step 2: Create Configuration Schema

**`calculators/effect-size/config.json`:**
```json
{
  "metadata": {
    "id": "effect-size-calculator",
    "title": "Effect Size Calculator",
    "version": "1.0.0",
    "build": "20251201",
    "description": "Calculate standardized effect sizes for various statistical tests",
    "icon": "calculator"
  },
  
  "tabs": [
    {
      "id": "cohens-d",
      "label": "Cohen's d",
      "active": true
    },
    {
      "id": "cohens-f",
      "label": "Cohen's f",
      "disabled": true,
      "badge": "Coming Soon"
    }
  ],
  
  "sections": {
    "left": [
      {
        "id": "study-design",
        "title": "Study Design",
        "subtitle": "Select your test type",
        "controls": [
          {
            "type": "select",
            "id": "testType",
            "label": "Test Type",
            "infoModal": "Select the type of statistical test...",
            "options": [
              {"value": "independent", "label": "Independent Samples"},
              {"value": "paired", "label": "Paired Samples"}
            ]
          },
          {
            "type": "slider",
            "id": "mean1",
            "label": "Group 1 Mean",
            "min": 0,
            "max": 100,
            "step": 0.1,
            "default": 50
          }
        ]
      }
    ],
    
    "right": [
      {
        "type": "results-card",
        "metrics": [
          {"id": "effectSize", "label": "Effect Size (d)", "color": "blue"},
          {"id": "interpretation", "label": "Interpretation", "color": "purple"}
        ]
      },
      {
        "type": "power-chart",
        "enabled": true
      }
    ]
  },
  
  "formulas": {
    "file": "formulas.js",
    "functions": ["calculateCohenD", "interpretEffect"]
  }
}
```

### Step 3: Create Calculation Module

**`calculators/effect-size/formulas.js`:**
```javascript
class EffectSizeCalculator extends TSMCalculator {
  constructor() {
    super();
    this.calculatorType = 'effect-size';
  }

  calculate() {
    const { testType, mean1, mean2, sd1, sd2 } = this.getValues();
    
    // Cohen's d calculation
    const pooledSD = Math.sqrt((sd1 ** 2 + sd2 ** 2) / 2);
    const d = (mean1 - mean2) / pooledSD;
    
    return {
      effectSize: Math.abs(d),
      interpretation: this.interpretEffect(Math.abs(d))
    };
  }
  
  interpretEffect(d) {
    if (d < 0.2) return 'Negligible';
    if (d < 0.5) return 'Small';
    if (d < 0.8) return 'Medium';
    return 'Large';
  }
  
  generateRCode() {
    return `# Effect Size Calculation
library(effsize)

cohen.d(${this.getValues().mean1}, ${this.getValues().mean2})`;
  }
}

// Initialize
window.calculator = new EffectSizeCalculator();
```

### Step 4: Build Script (Node.js)

**`build/generate.js`:**
```javascript
const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');

class CalculatorBuilder {
  constructor(configPath) {
    this.config = require(configPath);
    this.templatePath = path.join(__dirname, '../shared/templates/base.html');
  }

  async build() {
    const template = await fs.readFile(this.templatePath, 'utf8');
    const compiled = Handlebars.compile(template);
    
    const html = compiled({
      TITLE: this.config.metadata.title,
      HEADER: this.buildHeader(),
      INFO_BANNER: this.buildInfoBanner(),
      TAB_NAVIGATION: this.buildTabs(),
      LEFT_PANELS: this.buildLeftPanels(),
      RESULTS_CARD: this.buildResultsCard(),
      // ... etc
    });
    
    const outputPath = path.join(
      path.dirname(configPath),
      'index.html'
    );
    
    await fs.writeFile(outputPath, html);
    console.log(`✓ Generated ${this.config.metadata.title}`);
  }

  buildHeader() {
    return `<header class="header">...</header>`;
  }
  
  // ... helper methods for each section
}

// Usage
const builder = new CalculatorBuilder('./calculators/effect-size/config.json');
builder.build();
```

---

## Quick Production Workflow

### Creating a New Calculator (5 minutes)

1. **Copy template folder:**
   ```bash
   cp -r calculators/_template calculators/my-new-calc
   ```

2. **Edit `config.json`:**
   - Change title, description
   - Define your input controls
   - Specify calculations needed

3. **Write `formulas.js`:**
   - Extend `TSMCalculator` base class
   - Implement `calculate()` method
   - Add R code generation

4. **Generate HTML:**
   ```bash
   node build/generate.js calculators/my-new-calc/config.json
   ```

5. **Test and deploy** 🎉

---

## Shared Base Class (tsm-base.js)

```javascript
class TSMCalculator {
  constructor() {
    this.version = { major: 2, minor: 0, patch: 0 };
    this.initializeElements();
    this.bindEvents();
    this.updateCalculations();
  }

  initializeElements() {
    // Common element initialization
    this.effectSizeSlider = document.getElementById('effectSize');
    this.resultValues = document.querySelectorAll('.result-value');
  }

  bindEvents() {
    // Common event handlers
    document.querySelectorAll('.slider').forEach(slider => {
      slider.addEventListener('input', () => this.updateCalculations());
    });
  }

  getValues() {
    // Override in subclass
    return {};
  }

  calculate() {
    // Override in subclass
    return {};
  }

  updateCalculations() {
    const results = this.calculate();
    this.displayResults(results);
    this.updateCharts(results);
    this.updateCode();
  }

  displayResults(results) {
    // Common result display logic
  }

  updateCharts(results) {
    // Common charting logic using Plotly
  }

  generateRCode() {
    // Override in subclass
    return '# R code here';
  }

  updateCode() {
    document.getElementById('codeBlock').textContent = this.generateRCode();
  }
}
```

---

## Benefits of This Approach

✅ **Consistency:** All calculators use the same design system  
✅ **Speed:** Generate a new calculator in 5-10 minutes  
✅ **Maintainability:** Update shared CSS/JS once, affects all calculators  
✅ **Flexibility:** Each calculator can override/extend base functionality  
✅ **Type Safety:** Config schema ensures all calculators have required properties  

---

## Alternative: Pure HTML Components

If you want to avoid build scripts:

### Use Web Components

```javascript
// shared/components/tsm-slider.js
class TSMSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Your slider styles */
      </style>
      <div class="slider-container">
        <input type="range" class="slider" 
          min="${this.getAttribute('min')}"
          max="${this.getAttribute('max')}"
          value="${this.getAttribute('value')}">
        <div class="slider-value">${this.getAttribute('value')}</div>
      </div>
    `;
  }
}

customElements.define('tsm-slider', TSMSlider);
```

**Usage in any calculator:**
```html
<tsm-slider min="0.1" max="2.0" value="0.5" label="Effect Size"></tsm-slider>
```

---

## Recommended Tools

1. **Handlebars.js** - Template engine for HTML generation
2. **JSON Schema** - Validate config files
3. **Rollup/Vite** - Bundle JS if needed
4. **PostCSS** - Process shared CSS
5. **Live Server** - Quick local testing

---

## Next Steps

1. Extract your current calculator into templates
2. Create 2-3 test calculators using config approach
3. Refine the system based on what you learn
4. Document common patterns
5. Batch-create remaining calculators

Would you like me to create the actual build script or help extract your current calculator into the template system?

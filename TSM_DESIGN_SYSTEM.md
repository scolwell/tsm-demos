# TSM Design System Guide
**A-Priori Sample Size Calculator Style Reference**

Complete styling and component inventory for replicating TSM style in other calculators.

---

## Table of Contents
1. [Colors & Typography](#colors--typography)
2. [Layout Structure](#layout-structure)
3. [Header Components](#header-components)
4. [Form Elements](#form-elements)
5. [Buttons & Actions](#buttons--actions)
6. [Cards & Sections](#cards--sections)
7. [Interactive Controls](#interactive-controls)
8. [Tables & Data Display](#tables--data-display)
9. [Modals & Overlays](#modals--overlays)
10. [Charts & Visualizations](#charts--visualizations)
11. [Code Blocks](#code-blocks)
12. [Responsive Behavior](#responsive-behavior)

---

## Colors & Typography

### Color Palette
```css
:root {
  /* Primary Brand */
  --tsm-blue: #005EE9;
  --tsm-blue-hover: #0067FF;
  --tsm-blue-dark: #0051c9;
  
  /* Neutrals */
  --background: #F7F9FC;
  --foreground: #0F172A;
  --gray-50: #f8fafc;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #cbd5e1;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  
  /* Info/Alert */
  --info-bg: #F3F7FE;
  --info-border: #bae6fd;
  --warning-bg: #FEF3C7;
  --warning-icon: #F59E0B;
  --warning-text: #111827;
  
  /* Semantic */
  --border-color: #e2e8f0;
  --white: #ffffff;
}
```

### Typography
```css
/* Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700;800&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--foreground);
}

/* Headings use Poppins */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Specific sizes */
h1 { font-size: 1.875rem; font-weight: 700; } /* 30px */
h2 { font-size: 1.5rem; font-weight: 600; }   /* 24px */
h3 { font-size: 1.125rem; font-weight: 600; } /* 18px */
h4 { font-size: 1rem; font-weight: 600; }     /* 16px */

/* Body text */
.section-subtitle { font-size: 1rem; color: #64748b; font-weight: 400; }
.small { font-size: 0.875rem; } /* 14px */
.small-note { font-size: 0.875rem; color: #64748b; }
```

### Code Typography
```css
/* Code blocks use monospace */
code, pre {
  font-family: 'JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 1.08em;
}
```

---

## Layout Structure

### App Container
```css
.app-container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  min-height: 100vh;
}
```

### Main Content Wrapper
```css
.main-content {
  padding: 48px 32px;
  margin: 0 32px;
}
```

### Two-Column Grid
```css
.content-wrapper {
  display: grid;
  grid-template-columns: minmax(0, 35%) minmax(0, 1fr);
  gap: 2rem;
  width: 1216px;
  margin: 0 auto;
  padding: 0 0 2rem 0;
}

/* Responsive */
@media (max-width: 1280px) {
  .content-wrapper {
    width: 100%;
    grid-template-columns: 1fr;
  }
}
```

### Left & Right Panels
```css
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
```

---

## Header Components

### Header Container
```html
<header class="header">
  <div class="header-content">
    <a href="index.html" class="back-button">
      <svg><!-- arrow icon --></svg>
      Back to Demonstrations
    </a>
    <div class="header-info">
      <div class="header-icon">
        <svg><!-- calculator icon --></svg>
      </div>
      <div class="header-text">
        <h1>A-Priori Sample Size Calculator</h1>
        <p>Calculate required sample sizes for detecting effects...</p>
      </div>
      <div class="header-version">
        <span>v2.0.0</span>
        <span class="version-separator">•</span>
        <span>Build 20251028</span>
      </div>
    </div>
  </div>
</header>
```

### Header Styles
```css
.header {
  background: #0051c9;
  color: white;
  padding: 1.5rem 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.back-button {
  background: transparent;
  border: none;
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 0.375rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 1.5rem;
  transition: background-color 0.2s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

.header-info {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  position: relative;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.75rem;
  border-radius: 0.75rem;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.header-text h1 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.header-text p {
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.6;
}

.header-version {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 0.375rem;
}
```

### Info Banner
```html
<div class="info-banner">
  <div class="info-icon">
    <svg><!-- info icon --></svg>
  </div>
  <div class="info-content">
    <strong>Educational Tool</strong>
    <p>This calculator helps you determine...</p>
  </div>
</div>
```

```css
.info-banner {
  background: #F3F7FE;
  border: 1px solid #bae6fd;
  border-radius: 0.75rem;
  padding: 12px 16px;
  display: flex;
  gap: 0.75rem;
  width: 1216px;
  min-height: 90px;
  margin: 32px auto;
  align-items: flex-start;
}

.info-icon {
  color: #005EE9;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-content {
  color: #64748b;
  font-size: 0.875rem;
}

.info-content strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #64748b;
  font-weight: 600;
}
```

---

## Form Elements

### Section Card
```html
<section class="section">
  <h3>Study Design</h3>
  <p class="section-subtitle">Configure your test parameters</p>
  <!-- form elements -->
</section>
```

```css
.section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.section-subtitle {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #64748b;
  margin-bottom: 1.5rem;
}
```

### Form Group
```html
<div class="form-group">
  <label>
    Effect Size (Cohen's d)
    <button class="info-button" data-modal-title="..." data-modal-content="...">
      <svg><!-- info icon --></svg>
    </button>
  </label>
  <input type="number" class="text-input" placeholder="e.g., 0.5">
</div>
```

```css
.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #0F172A;
}

.info-button {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.125rem;
  border-radius: 0.25rem;
  transition: color 0.2s;
}

.info-button:hover {
  color: #475569;
}
```

### Text Input
```css
.text-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  background: #ffffff;
  color: #0F172A;
}

.text-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.text-input::placeholder {
  color: #cbd5e1;
}
```

### Select Input
```css
.select-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  color: #0F172A;
}

.select-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}
```

### Form Row (side-by-side fields)
```html
<div class="form-row">
  <div class="field">
    <label class="small">Mean 1</label>
    <input type="number" class="text-input">
  </div>
  <div class="field">
    <label class="small">Mean 2</label>
    <input type="number" class="text-input">
  </div>
</div>
```

```css
.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
}

.field label.small {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #0F172A;
}
```

---

## Buttons & Actions

### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #005EE9, #0067FF);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 94, 233, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}
```

### Secondary Button
```css
.btn-secondary {
  background: white;
  color: #005EE9;
  border: 1px solid #005EE9;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f0f9ff;
}
```

### Code Action Button (with icon)
```html
<button class="code-action" id="computeEffectSize">
  <svg><!-- checkmark icon --></svg>
  Compute d
</button>
```

```css
.code-action {
  background: #005EE9;
  color: white;
  border: none;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.code-action:hover {
  background: #0067FF;
  transform: translateY(-1px);
}

.code-action svg {
  width: 14px;
  height: 14px;
}
```

### Icon-Only Buttons (copy/download)
```css
.code-action-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #64748b;
  padding: 0;
}

.code-action-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #334155;
  transform: translateY(-1px);
}

.code-action-btn:active {
  transform: translateY(0);
}

.code-action-btn svg {
  width: 16px;
  height: 16px;
}
```

### Clear/Reset Button
```css
.clear-button {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #334155;
}
```

---

## Interactive Controls

### Segmented Control (Toggle)
```html
<div class="segmented" id="significanceToggle" role="group">
  <button type="button" class="segment active" data-value="0.05">
    0.05 (standard)
  </button>
  <button type="button" class="segment" data-value="0.01">
    0.01
  </button>
</div>
```

```css
.segmented {
  display: inline-flex;
  background: #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.25rem;
  width: 100%;
}

.segment {
  flex: 1;
  background: none;
  border: none;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s;
}

.segment.active {
  background: white;
  color: #1e293b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.segment:hover:not(.active) {
  color: #475569;
}
```

### Collapsible Panel
```html
<button type="button" class="calc-toggle" id="toggleAdvanced" 
        aria-expanded="false" aria-controls="advancedPanel">
  <svg class="chevron"><!-- chevron icon --></svg>
  <span class="label-full">Advanced Options</span>
</button>
<div class="calc-panel" id="advancedPanel" hidden>
  <!-- content -->
</div>
```

```css
.calc-toggle {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  color: #64748b;
  transition: color 0.2s;
  width: 100%;
}

.calc-toggle:hover {
  color: #334155;
}

.calc-toggle svg.chevron {
  width: 14px;
  height: 14px;
  transition: transform 0.2s;
}

.calc-toggle[aria-expanded="true"] svg.chevron {
  transform: rotate(180deg);
}

.calc-panel {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
}
```

### Toggle Switch
```html
<div class="toggle-row">
  <label class="switch">
    <input type="checkbox" id="customAllocToggle" />
    <span class="slider"></span>
  </label>
  <span class="small">Use custom allocation</span>
</div>
```

```css
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #005EE9;
}

input:checked + .slider:before {
  transform: translateX(20px);
}
```

### Sampling Option Grid (cards with checkmarks)
```html
<div class="sampling-grid">
  <div class="sampling-option active" data-design="no-stratification">
    <span class="option-check">
      <svg><!-- checkmark --></svg>
    </span>
    <h4>No stratification</h4>
    <p>Single homogeneous population</p>
  </div>
  <!-- more options -->
</div>
```

```css
.sampling-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.sampling-option {
  position: relative;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.sampling-option:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.sampling-option.active {
  border-color: #005EE9;
  background: #f0f9ff;
}

.option-check {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.sampling-option.active .option-check {
  background: #005EE9;
  border-color: #005EE9;
}

.sampling-option.active .option-check svg {
  opacity: 1;
}

.sampling-option .option-check svg {
  width: 16px;
  height: 16px;
  opacity: 0;
  stroke: white;
  transition: opacity 0.2s;
}

.sampling-option h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #0F172A;
}

.sampling-option p {
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0;
}
```

---

## Cards & Sections

### Results Card
```html
<div class="results-card">
  <div class="results-header-row">
    <h3>Sample Size Required</h3>
    <button id="clearAllBtn" class="clear-button">Clear all</button>
  </div>
  <p class="results-subtitle">Based on your study parameters</p>
  <div class="results-grid">
    <!-- result items -->
  </div>
</div>
```

```css
.results-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.results-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.results-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.result-item {
  text-align: center;
}

.result-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #005EE9;
  margin-bottom: 0.5rem;
}

.result-value.power {
  color: #10b981;
}

.result-value.effect {
  color: #f59e0b;
}

.result-label {
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}
```

### Warning/Alert Box
```html
<div class="warning">
  <span class="warning-icon">
    <svg><!-- warning triangle --></svg>
  </span>
  Power is below the recommended 80% threshold.
</div>
```

```css
.warning {
  background: #FEF3C7;
  border: 1px solid #fbbf24;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #111827;
  margin-top: 1rem;
}

.warning-icon svg {
  width: 16px;
  height: 16px;
}
```

---

## Tables & Data Display

### APA-Style Table
```html
<table class="apa-table">
  <caption>Table 1<br><em>Sample Size Requirements</em></caption>
  <colgroup>
    <col class="col-param">
    <col class="col-value">
    <col class="col-desc">
  </colgroup>
  <thead>
    <tr>
      <th scope="col">Parameter</th>
      <th scope="col">Value</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Test Type</td>
      <td>Two-sample t-test</td>
      <td>Independent groups</td>
    </tr>
    <!-- more rows -->
  </tbody>
</table>
```

```css
.apa-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.apa-table caption {
  text-align: left;
  font-weight: 600;
  color: #0F172A;
  padding-bottom: 0.75rem;
  caption-side: top;
}

.apa-table caption em {
  font-style: italic;
  font-weight: 400;
}

.apa-table thead {
  border-top: 2px solid #0F172A;
  border-bottom: 1px solid #0F172A;
}

.apa-table th {
  text-align: left;
  padding: 0.75rem 0.5rem;
  font-weight: 600;
  color: #0F172A;
}

.apa-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
}

.apa-table tbody tr:last-child {
  border-bottom: 2px solid #0F172A;
}

.apa-table td {
  padding: 0.75rem 0.5rem;
  color: #334155;
}

.apa-table tr.table-result td {
  font-weight: 600;
  color: #0F172A;
}

.apa-table tr.table-divider {
  border-top: 1px solid #0F172A;
}

/* Column widths */
.apa-table .col-param { width: 30%; }
.apa-table .col-value { width: 25%; }
.apa-table .col-desc { width: 45%; }
```

---

## Code Blocks

### R Code Block
```html
<div class="r-label">
  R Code
  <div class="code-actions">
    <button class="code-action-btn" id="printCode" title="Print">
      <svg><!-- print icon --></svg>
    </button>
    <button class="code-action-btn" id="downloadCode" title="Download">
      <svg><!-- download icon --></svg>
    </button>
    <button class="code-action-btn" id="copyCode" title="Copy">
      <svg><!-- copy icon --></svg>
    </button>
  </div>
</div>
<div class="r-block">
  <code id="codeBlock" class="language-r">
    # R code here
  </code>
</div>
```

```css
.r-label {
  font-weight: 600;
  font-size: 1.08em;
  margin-bottom: 8px;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.r-block {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px 18px 12px 18px;
  font-family: 'JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 1.08em;
  color: #334155;
  margin-bottom: 12px;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 400px;
  overflow-y: auto;
}

.r-block::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.r-block::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.r-block::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.r-block::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
```

### R Info Box
```html
<div class="r-info">
  <div class="r-info-header">
    <svg><!-- book icon --></svg>
    <strong>New to R?</strong> This code uses base R functions.
  </div>
  <ul class="r-info-list">
    <li>Install required packages once with <code>install.packages()</code></li>
    <li>Load packages with <code>library()</code></li>
    <!-- more tips -->
  </ul>
</div>
```

```css
.r-info {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-top: 1rem;
}

.r-info-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #0369a1;
  font-size: 0.875rem;
}

.r-info-header svg {
  width: 16px;
  height: 16px;
}

.r-info-list {
  list-style: disc;
  padding-left: 1.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

.r-info-list li {
  margin-bottom: 0.25rem;
}

.r-info-list code {
  background: #e0f2fe;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.8125rem;
  color: #0369a1;
}
```

---

## Charts & Visualizations

### Chart Section
```html
<div class="chart-section">
  <div class="chart-header">
    <h4>Power Analysis Curve</h4>
    <div class="chart-legend">
      <div class="legend-item">
        <div class="legend-color statistical"></div>
        <span>Statistical Power</span>
      </div>
      <div class="legend-item">
        <div class="legend-color target"></div>
        <span>Target (0.80)</span>
      </div>
    </div>
    <div class="curve-style-controls">
      <span class="curve-control-label">Theme</span>
      <span id="themeSwatch" class="theme-swatch"></span>
      <select id="chartTheme" class="curve-control-select">
        <option value="default">Default</option>
        <option value="midnight">Midnight</option>
        <!-- more themes -->
      </select>
    </div>
  </div>
  <div class="chart-container">
    <div id="powerChart" style="width: 100%; height: 480px;"></div>
  </div>
</div>
```

```css
.chart-section {
  margin-top: 2rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #0F172A;
}

.chart-legend {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.legend-color.statistical {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.legend-color.target {
  background: #f59e0b;
}

.curve-style-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.curve-control-label {
  font-size: 0.875rem;
  color: #64748b;
}

.theme-swatch {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.curve-control-select {
  padding: 0.375rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.chart-container {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
}
```

---

## Modals & Overlays

### Info Modal
```html
<div id="infoModal" class="modal" aria-hidden="true">
  <div class="modal-overlay"></div>
  <div class="modal-container">
    <div class="modal-header">
      <h2 id="modalTitle" class="modal-title">Information</h2>
      <button class="modal-close" aria-label="Close modal">
        <svg><!-- X icon --></svg>
      </button>
    </div>
    <div class="modal-body">
      <p id="modalContent"></p>
    </div>
  </div>
</div>
```

```css
.modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: none;
  align-items: center;
  justify-content: center;
}

.modal[aria-hidden="false"] {
  display: flex;
}

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-container {
  position: relative;
  background: white;
  border-radius: 1rem;
  max-width: 32rem;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 51;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0F172A;
}

.modal-close {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f8fafc;
  color: #334155;
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 1.5rem;
  color: #334155;
  font-size: 0.9375rem;
  line-height: 1.6;
}
```

---

## Footer

```html
<footer class="app-footer">
  <div class="footer-content">
    <div class="footer-left">
      <span class="footer-brand">TSM A-Priori Sample Size Calculator</span>
      <span class="footer-separator">•</span>
      <span class="footer-version">v2.0.0</span>
      <span class="footer-separator">•</span>
      <span class="footer-build">Build 20251028</span>
    </div>
    <div class="footer-right">
      <a href="#" class="footer-link">Documentation</a>
      <span class="footer-separator">•</span>
      <a href="#" class="footer-link">Release Notes</a>
    </div>
  </div>
</footer>
```

```css
.app-footer {
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 1.5rem 2rem;
  margin-top: 3rem;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #64748b;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-left,
.footer-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer-brand {
  font-weight: 600;
  color: #0F172A;
}

.footer-separator {
  color: #cbd5e1;
}

.footer-link {
  color: #005EE9;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #0067FF;
  text-decoration: underline;
}
```

---

## Responsive Behavior

### Breakpoints
```css
/* Desktop-first approach */

/* Tablets and smaller desktops */
@media (max-width: 1280px) {
  .info-banner,
  .tab-navigation,
  .content-wrapper {
    width: 100%;
  }
  
  .content-wrapper {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .header {
    padding: 1rem 1.5rem;
  }
  
  .header-text h1 {
    font-size: 1.5rem;
  }
  
  .header-version {
    position: static;
    margin-top: 0.5rem;
  }
  
  .main-content {
    padding: 24px 16px;
    margin: 0 16px;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .sampling-grid {
    grid-template-columns: 1fr;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .header-text h1 {
    font-size: 1.25rem;
  }
  
  .section {
    padding: 1rem;
  }
  
  .result-value {
    font-size: 2rem;
  }
}
```

---

## Key Design Principles

### 1. **Spacing System**
- Base unit: 0.25rem (4px)
- Common gaps: 0.5rem (8px), 0.75rem (12px), 1rem (16px), 1.5rem (24px), 2rem (32px)

### 2. **Border Radius**
- Small elements: 0.375rem (6px) - 0.5rem (8px)
- Medium elements: 0.75rem (12px)
- Large panels: 1rem (16px)

### 3. **Shadow System**
```css
/* Subtle */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

/* Medium */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Elevated */
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.06);

/* Button hover */
box-shadow: 0 4px 12px rgba(0, 94, 233, 0.3);
```

### 4. **Transitions**
```css
/* Standard */
transition: all 0.2s ease;

/* Fast */
transition: all 0.15s ease;

/* Slow */
transition: all 0.3s ease;
```

### 5. **Icon Sizes**
- Small: 14px × 14px
- Medium: 16px × 16px
- Large: 20px × 20px
- Header: 32px × 32px

---

## SVG Icons Used

### Common Icons
```html
<!-- Checkmark -->
<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M12 4L5 11L1 7" stroke="currentColor" stroke-width="1" 
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>

<!-- Info Circle -->
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="2" stroke-linecap="round" 
     stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
  <path d="M12 17h.01"></path>
</svg>

<!-- Chevron Down -->
<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M4 5L7 8L10 5" stroke="currentColor" stroke-width="1" 
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>

<!-- Arrow Left (back button) -->
<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" 
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>

<!-- Download -->
<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M7 1V10" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
  <path d="M4 7L7 10L10 7" stroke="currentColor" stroke-width="1" 
        stroke-linecap="round"/>
  <path d="M1 12H13" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
</svg>

<!-- Copy -->
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="2" stroke-linecap="round" 
     stroke-linejoin="round">
  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
</svg>

<!-- Print -->
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="2" stroke-linecap="round" 
     stroke-linejoin="round">
  <polyline points="6 9 6 2 18 2 18 9"></polyline>
  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
  <rect x="6" y="14" width="12" height="8"></rect>
</svg>

<!-- Close (X) -->
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="2">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>

<!-- Warning Triangle -->
<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" 
        fill="#F59E0B"/>
  <path d="M12 9v5" stroke="#111827" stroke-width="2" stroke-linecap="round"/>
  <circle cx="12" cy="17" r="1" fill="#111827"/>
</svg>
```

---

## Implementation Checklist

When applying this design system to a new calculator:

- [ ] Import Inter (body) and Poppins (headings) fonts
- [ ] Set CSS variables for colors
- [ ] Apply header with blue background (#0051c9)
- [ ] Add info banner below header
- [ ] Use two-column grid (35% / 65%) for main content
- [ ] Wrap form sections in `.section` cards
- [ ] Use `.form-group` for each input/control
- [ ] Add info buttons with modal support
- [ ] Implement segmented controls for toggles
- [ ] Style results card with large centered values
- [ ] Add APA-style table for summary
- [ ] Include R code blocks with action buttons
- [ ] Add chart section with Plotly
- [ ] Implement footer with version info
- [ ] Test responsive breakpoints
- [ ] Ensure all interactive states (hover, active, focus)
- [ ] Add proper ARIA labels for accessibility

---

## Dependencies

### External Libraries
```html
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">

<!-- Math library for statistical calculations -->
<script src="https://cdn.jsdelivr.net/npm/jstat@1.9.6/dist/jstat.min.js"></script>

<!-- Plotly for interactive charts -->
<script src="https://cdn.plot.ly/plotly-2.32.0.min.js"></script>

<!-- Table export -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

---

## Notes

- All colors use consistent hex values from the palette
- Spacing follows 4px base unit system
- Border radius increases with element size
- Transitions are 0.2s for most interactions
- Focus states use subtle ring shadows
- Icons are inline SVG for customization
- All interactive elements have hover/active states
- Code blocks use monospace font (JetBrains Mono preferred)
- Tables follow APA 7th edition styling
- Modals use backdrop blur for depth
- Charts use Plotly with custom TSM themes

---

**Version:** 1.0.0  
**Last Updated:** December 1, 2025  
**Based on:** A-Priori Sample Size Calculator v2.0.0

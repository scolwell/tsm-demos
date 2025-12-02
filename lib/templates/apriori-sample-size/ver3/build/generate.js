#!/usr/bin/env node

/**
 * TSM Calculator Generator
 * Generates complete HTML calculators from config.json + formulas.js
 */

const fs = require('fs');
const path = require('path');

class CalculatorGenerator {
  constructor(configPath) {
    this.configPath = configPath;
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    this.calculatorDir = path.dirname(configPath);
    this.baseDir = path.resolve(__dirname, '..');
  }

  generate() {
    console.log(`\n🔨 Generating ${this.config.metadata.title}...`);
    
    const html = this.buildHTML();
    const outputPath = path.join(this.calculatorDir, 'index.html');
    
    fs.writeFileSync(outputPath, html, 'utf8');
    
    console.log(`✅ Generated: ${outputPath}`);
    console.log(`📊 Stats: ${Math.round(html.length / 1024)}KB`);
  }

  buildHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.config.metadata.title}</title>
  <link rel="stylesheet" href="../../style.css">
</head>
<body>
  <div class="app-container">
    ${this.buildHeader()}
    ${this.buildInfoBanner()}
    ${this.buildTabNavigation()}
    
    <div class="content-wrapper">
      ${this.buildLeftPanel()}
      ${this.buildRightPanel()}
    </div>

    ${this.buildFooter()}
    ${this.buildModal()}
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/jstat@1.9.6/dist/jstat.min.js"></script>
  <script src="https://cdn.plot.ly/plotly-2.32.0.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="../../script.js"></script>
  <script src="formulas.js"></script>
</body>
</html>`;
  }

  buildHeader() {
    const m = this.config.metadata;
    return `
    <header class="header">
      <div class="header-content">
        <button class="back-button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back to Calculators
        </button>
        <div class="header-info">
          <div class="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calculator">
              <rect width="16" height="20" x="4" y="2" rx="2"></rect>
              <line x1="8" x2="16" y1="6" y2="6"></line>
              <line x1="16" x2="16" y1="14" y2="18"></line>
              <path d="M16 10h.01"></path>
              <path d="M12 10h.01"></path>
              <path d="M8 10h.01"></path>
              <path d="M12 14h.01"></path>
              <path d="M8 14h.01"></path>
              <path d="M12 18h.01"></path>
              <path d="M8 18h.01"></path>
            </svg>
          </div>
          <div class="header-text">
            <h1>${m.title}</h1>
            <p>${m.description}</p>
          </div>
          <div class="header-version">
            <span id="headerVersion">${m.version}</span>
            <span class="version-separator">•</span>
            <span id="headerBuild">Build ${m.build}</span>
          </div>
        </div>
      </div>
    </header>`;
  }

  buildInfoBanner() {
    if (!this.config.infoBanner) return '';
    const b = this.config.infoBanner;
    return `
    <div class="info-banner">
      <div class="info-icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
          <path d="M9 18h6"></path>
          <path d="M10 22h4"></path>
        </svg>
      </div>
      <div class="info-content">
        <strong>${b.title}</strong>
        <p>${b.content}</p>
      </div>
    </div>`;
  }

  buildTabNavigation() {
    if (!this.config.tabs || this.config.tabs.length === 0) return '';
    
    const tabs = this.config.tabs.map(tab => {
      const classes = ['tab-button'];
      if (tab.active) classes.push('active');
      if (tab.disabled) classes.push('disabled');
      
      return `
        <button class="${classes.join(' ')}" data-tab="${tab.id}" ${tab.disabled ? 'aria-disabled="true"' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="16" height="20" x="4" y="2" rx="2"></rect>
            <line x1="8" x2="16" y1="6" y2="6"></line>
            <line x1="16" x2="16" y1="14" y2="18"></line>
            <path d="M16 10h.01"></path>
            <path d="M12 10h.01"></path>
            <path d="M8 10h.01"></path>
          </svg>
          ${tab.label}
          ${tab.badge ? `<span class="soon-badge">${tab.badge}</span>` : ''}
        </button>`;
    }).join('');
    
    return `<div class="tab-navigation">${tabs}</div>`;
  }

  buildLeftPanel() {
    if (!this.config.leftPanels) return '<div class="left-panel"></div>';
    
    const sections = this.config.leftPanels.map(panel => this.buildSection(panel)).join('');
    return `<div class="left-panel">${sections}</div>`;
  }

  buildSection(panel) {
    const controls = panel.controls.map(control => this.buildControl(control)).join('');
    
    return `
      <section class="section">
        <h3>${panel.title}</h3>
        ${panel.subtitle ? `<p class="section-subtitle">${panel.subtitle}</p>` : ''}
        ${controls}
      </section>`;
  }

  buildControl(control) {
    switch (control.type) {
      case 'select':
        return this.buildSelect(control);
      case 'slider-with-stepper':
        return this.buildSliderWithStepper(control);
      case 'slider-with-value':
        return this.buildSliderWithValue(control);
      case 'segmented':
        return this.buildSegmented(control);
      default:
        return `<!-- Unknown control type: ${control.type} -->`;
    }
  }

  buildSelect(control) {
    const options = control.options.map(opt => 
      `<option value="${opt.value}" ${opt.value === control.default ? 'selected' : ''}>${opt.label}</option>`
    ).join('');
    
    return `
      <div class="form-group">
        <label>
          ${control.label}
          ${this.buildInfoButton(control.infoModal)}
        </label>
        <select class="select-input" id="${control.id}">
          ${options}
        </select>
      </div>`;
  }

  buildSliderWithStepper(control) {
    const value = control.default || control.min;
    return `
      <div class="form-group">
        <label>
          ${control.label}
          ${this.buildInfoButton(control.infoModal)}
        </label>
        <div class="power-container">
          <button type="button" class="stepper-btn" id="decrement${control.id.charAt(0).toUpperCase() + control.id.slice(1)}" aria-label="Decrease ${control.label}">−</button>
          <input type="range" class="slider" id="${control.id}" 
            min="${control.min}" max="${control.max}" step="${control.step}" value="${value}">
          <button type="button" class="stepper-btn" id="increment${control.id.charAt(0).toUpperCase() + control.id.slice(1)}" aria-label="Increase ${control.label}">+</button>
          <div class="power-value" style="background: ${this.getColorForSlider(control.color)}">${value}</div>
        </div>
        ${control.helpText ? `<p class="help-text">${control.helpText}</p>` : ''}
      </div>`;
  }

  buildSliderWithValue(control) {
    const value = control.default || control.min;
    const displayValue = control.valueDisplay === 'percent' ? Math.round(value * 100) + '%' : value;
    
    return `
      <div class="form-group">
        <label>
          ${control.label}
          ${this.buildInfoButton(control.infoModal)}
        </label>
        <div class="effect-row">
          <button type="button" class="stepper-btn" id="decrement${control.id.charAt(0).toUpperCase() + control.id.slice(1)}" aria-label="Decrease ${control.label}">−</button>
          <input type="range" class="slider" id="${control.id}" 
            min="${control.min}" max="${control.max}" step="${control.step}" value="${value}">
          <button type="button" class="stepper-btn" id="increment${control.id.charAt(0).toUpperCase() + control.id.slice(1)}" aria-label="Increase ${control.label}">+</button>
          <div class="slider-value" style="background: ${this.getColorForSlider(control.color)}">${displayValue}</div>
        </div>
        ${control.helpText ? `<p class="help-text">${control.helpText}</p>` : ''}
      </div>`;
  }

  buildSegmented(control) {
    const buttons = control.options.map((opt, idx) => 
      `<button type="button" class="segment ${opt.value === control.default ? 'active' : ''}" data-value="${opt.value}">${opt.label}</button>`
    ).join('');
    
    return `
      <div class="form-group">
        <label>
          ${control.label}
          ${this.buildInfoButton(control.infoModal)}
        </label>
        <div class="segmented" id="${control.id}" role="group" aria-label="${control.label}">
          ${buttons}
        </div>
      </div>`;
  }

  buildInfoButton(infoModal) {
    if (!infoModal) return '';
    return `
      <button class="info-button" data-modal-title="${infoModal.title}" data-modal-content="${this.escapeHTML(infoModal.content)}">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <path d="M12 17h.01"></path>
        </svg>
      </button>`;
  }

  buildRightPanel() {
    if (!this.config.rightPanels) return '<div class="right-panel"></div>';
    
    const panels = this.config.rightPanels.map(panel => {
      switch (panel.type) {
        case 'results-card':
          return this.buildResultsCard(panel);
        case 'visualization-card':
          return this.buildVisualizationCard(panel);
        case 'code-section':
          return this.buildCodeSection(panel);
        default:
          return '';
      }
    }).join('');
    
    return `<div class="right-panel">${panels}</div>`;
  }

  buildResultsCard(panel) {
    const metrics = panel.metrics.map((m, idx) => `
      <div class="result-item">
        <div class="result-value ${m.color === 'purple' ? 'power' : m.color === 'orange' ? 'effect' : ''}">${idx === 0 ? '73' : idx === 1 ? '±5.2' : idx === 2 ? '94.8' : '105.2'}</div>
        <div class="result-label">
          ${m.label}
          ${m.infoModal ? this.buildInfoButton(m.infoModal) : ''}
        </div>
      </div>`).join('');

    return `
      <div class="results-card">
        <div class="results-header-row">
          <h3>${panel.title}</h3>
          <button id="clearAllBtn" class="clear-button" type="button" title="Reset all inputs to defaults">Clear all</button>
        </div>
        <p class="results-subtitle">${panel.subtitle}</p>
        
        <div class="results-grid">
          ${metrics}
        </div>

        ${panel.chart ? this.buildChartSection(panel.chart) : ''}
        ${panel.designInfo ? this.buildDesignInfo(panel.designInfo) : ''}
      </div>`;
  }

  buildChartSection(chart) {
    const legend = chart.legend.map(item => `
      <div class="legend-item">
        <div class="legend-color ${item.color}"></div>
        <span id="powerTargetLabel">${item.label}</span>
      </div>`).join('');

    return `
      <div class="chart-section">
        <div class="chart-header">
          <h4>${chart.title}</h4>
          <div class="chart-legend">
            ${legend}
          </div>
          <div class="curve-style-controls">
            <span class="curve-control-label">Theme</span>
            <span id="themeSwatch" class="theme-swatch" aria-hidden="true"></span>
            <select id="chartTheme" class="curve-control-select" aria-label="Theme">
              <option value="default" selected>Default</option>
              <option value="midnight">Midnight</option>
              <option value="emerald">Emerald</option>
              <option value="crimson">Crimson</option>
              <option value="amber">Amber</option>
              <option value="indigo">Indigo</option>
              <option value="graphite">Graphite</option>
              <option value="ocean">Ocean</option>
              <option value="forest">Forest</option>
              <option value="magenta">Magenta</option>
            </select>
          </div>
        </div>
        <div class="chart-container">
          <div id="powerChart" style="width: 100%; height: 480px;"></div>
        </div>
      </div>`;
  }

  buildDesignInfo(info) {
    return `
      <div class="design-info">
        <p><strong>Current Design:</strong> ${info.template}</p>
        <div class="warning" style="display: none;">
          <span class="warning-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="#F59E0B"/>
              <path d="M12 9v5" stroke="#111827" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="17" r="1" fill="#111827"/>
            </svg>
          </span>
          ${info.warning.message}
        </div>
      </div>`;
  }

  buildVisualizationCard(panel) {
    return `
      <div class="visualization-card">
        <div class="visualization-header">
          <h3>${panel.title}</h3>
          <div class="visualization-actions">
            <div class="download-dropdown">
              <button type="button" class="code-action dropdown-toggle" id="downloadDropdownBtn">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1V10" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
                  <path d="M4 7L7 10L10 7" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
                  <path d="M1 12H13" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
                </svg>
                <span>Download</span>
                <svg class="chevron" width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </button>
              <div class="dropdown-menu" id="downloadDropdownMenu" hidden>
                <button type="button" class="dropdown-item" data-format="png">PNG</button>
                <button type="button" class="dropdown-item" data-format="pdf">PDF</button>
              </div>
            </div>
          </div>
        </div>
        <p class="visualization-subtitle">${panel.subtitle}</p>
        
        <div class="apa-table-container" id="apaTableContainer">
          <table class="apa-table" id="samplingTable">
            <caption>Table 1<br><em>${this.config.metadata.title} Results</em></caption>
            <thead>
              <tr>
                <th scope="col">Parameter</th>
                <th scope="col">Value</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody id="samplingTableBody">
              <tr><td>Test Type</td><td id="tableTestType">—</td><td id="tableTestTypeDesc">—</td></tr>
              <tr><td>Effect Size</td><td id="tableEffectSize">—</td><td id="tableEffectSizeDesc">—</td></tr>
              <tr><td>Significance Level (α)</td><td id="tableAlpha">—</td><td id="tableAlphaDesc">—</td></tr>
              <tr><td>Statistical Power (1-β)</td><td id="tablePower">—</td><td id="tablePowerDesc">—</td></tr>
              <tr><td>Test Direction</td><td id="tableDirection">—</td><td id="tableDirectionDesc">—</td></tr>
              <tr class="table-divider"><td>Sampling Design</td><td id="tableSamplingDesign">—</td><td id="tableSamplingDesignDesc">—</td></tr>
              <tr id="tableDesignParamsRow" style="display: none;"><td>Design Parameters</td><td id="tableDesignParams">—</td><td id="tableDesignParamsDesc">—</td></tr>
              <tr><td>Extraction Method</td><td id="tableExtraction">—</td><td id="tableExtractionDesc">—</td></tr>
              <tr id="tableFPCRow" style="display: none;"><td>Population Size</td><td id="tablePopSize">—</td><td id="tablePopSizeDesc">—</td></tr>
              <tr class="table-result"><td>Required Sample Size</td><td id="tableSampleSize"><strong>—</strong></td><td id="tableSampleSizeDesc">—</td></tr>
            </tbody>
          </table>
        </div>

        <div class="viz-notes-section" id="vizNotesSection">
          <div class="viz-notes-header" style="font-weight:normal;font-style:italic;">Note:</div>
          <p class="viz-notes-text" id="vizNotesText">Results calculated using statistical power analysis.</p>
        </div>
      </div>`;
  }

  buildCodeSection(panel) {
    const langButtons = panel.languages.map(lang => `
      <button type="button" class="segment ${lang.active ? 'active' : ''}" data-lang="${lang.id}" ${lang.disabled ? 'disabled aria-disabled="true"' : ''}>
        ${lang.label}
        ${lang.badge ? `<span class="soon-badge">${lang.badge}</span>` : ''}
      </button>`).join('');

    return `
      <div class="code-section">
        <div class="code-header">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 3L14 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M2 7L14 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M2 11L14 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <h3>${panel.title}</h3>
        </div>
        <p>${panel.subtitle}</p>

        <div class="code-tabs">
          <div class="segmented" id="codeLangToggle">
            ${langButtons}
          </div>
        </div>

        <p class="code-description" id="codeLangDescription">Copy this code to reproduce the analysis in R.</p>

        <div class="r-label">
          R Code
          <div class="code-actions">
            <button class="code-action-btn" id="printCode" title="Print R Code">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
            </button>
            <button class="code-action-btn" id="downloadCode" title="Download R Code">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
            <button class="code-action-btn" id="copyCode" title="Copy R Code">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="r-block">
          <code id="codeBlock" class="language-r"># Code will be generated here</code>
        </div>

        <div class="r-label">
          R Output
          <div class="code-actions">
            <button class="code-action-btn" id="printOutput" title="Print R Output">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
            </button>
            <button class="code-action-btn" id="downloadOutput" title="Download R Output">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
            <button class="code-action-btn" id="copyOutput" title="Copy R Output">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="r-block">
          <code id="outputBlock" class="language-r"># Output will be generated here</code>
        </div>

        ${panel.info ? this.buildRInfo(panel.info) : ''}

        <div class="learn-more">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 12V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M8 6H8.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>Want to learn more about using R for statistical analysis?</span>
          <a href="#" class="learn-link">View R Tutorials</a>
        </div>
      </div>`;
  }

  buildRInfo(info) {
    const tips = info.tips.map(tip => `<li>${tip}</li>`).join('');
    return `
      <div class="r-info">
        <div class="r-info-header">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor"/>
            <path d="M9 9L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <strong>${info.title}</strong> ${info.content}
        </div>
        <ul class="r-info-list">
          ${tips}
        </ul>
      </div>`;
  }

  buildFooter() {
    const m = this.config.metadata;
    return `
      <footer class="app-footer">
        <div class="footer-content">
          <div class="footer-left">
            <span class="footer-brand">TSM ${m.title}</span>
            <span class="footer-separator">•</span>
            <span class="footer-version" id="appVersion">${m.version}</span>
            <span class="footer-separator">•</span>
            <span class="footer-build" id="appBuild">Build ${m.build}</span>
          </div>
          <div class="footer-right">
            <a href="#" class="footer-link">Documentation</a>
            <span class="footer-separator">•</span>
            <a href="#" class="footer-link">Release Notes</a>
          </div>
        </div>
      </footer>`;
  }

  buildModal() {
    return `
      <div id="infoModal" class="modal" aria-hidden="true">
        <div class="modal-overlay"></div>
        <div class="modal-container">
          <div class="modal-header">
            <h2 id="modalTitle" class="modal-title">Information</h2>
            <button class="modal-close" aria-label="Close modal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p id="modalContent"></p>
          </div>
        </div>
      </div>`;
  }

  getColorForSlider(color) {
    const colors = {
      blue: '#005EE9',
      purple: '#7c3aed',
      orange: '#f97316',
      green: '#10b981'
    };
    return colors[color] || colors.blue;
  }

  escapeHTML(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node generate.js <config.json>');
    process.exit(1);
  }

  const configPath = path.resolve(args[0]);
  
  if (!fs.existsSync(configPath)) {
    console.error(`❌ Config file not found: ${configPath}`);
    process.exit(1);
  }

  try {
    const generator = new CalculatorGenerator(configPath);
    generator.generate();
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    process.exit(1);
  }
}

module.exports = CalculatorGenerator;

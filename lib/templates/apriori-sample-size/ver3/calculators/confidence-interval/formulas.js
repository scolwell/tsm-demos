// ==============================
// CONFIDENCE INTERVAL CALCULATOR
// ==============================

class ConfidenceIntervalCalculator extends SampleSizeEstimator {
  constructor() {
    super();
    this.calculatorType = 'confidence-interval';
    this.initializeSpecificElements();
    this.bindSpecificEvents();
    // Initial render
    this.updateCalculations();
  }

  initializeSpecificElements() {
    // Override parent elements for CI-specific controls
    this.sampleSizeSlider = document.getElementById('sampleSize');
    this.confidenceLevelSlider = document.getElementById('confidenceLevel');
    this.standardDeviationSlider = document.getElementById('standardDeviation');
    this.sampleMeanSlider = document.getElementById('sampleMean');
    this.estimationTypeSelect = document.getElementById('estimationType');
    this.distributionTypeToggle = document.getElementById('distributionType');

    // CI-specific values
    this.currentValues = {
      sampleSize: 30,
      confidenceLevel: 0.95,
      standardDeviation: 15,
      sampleMean: 100,
      estimationType: 'single-mean',
      distributionType: 't'
    };

    // Sync with HTML
    if (this.sampleSizeSlider) {
      this.currentValues.sampleSize = parseInt(this.sampleSizeSlider.value) || 30;
    }
    if (this.confidenceLevelSlider) {
      this.currentValues.confidenceLevel = parseFloat(this.confidenceLevelSlider.value) || 0.95;
    }
    if (this.standardDeviationSlider) {
      this.currentValues.standardDeviation = parseFloat(this.standardDeviationSlider.value) || 15;
    }
    if (this.sampleMeanSlider) {
      this.currentValues.sampleMean = parseFloat(this.sampleMeanSlider.value) || 100;
    }
  }

  bindSpecificEvents() {
    // Sliders: sample size
    if (this.sampleSizeSlider) {
      const badge = document.querySelector('#sampleSize')?.closest('.power-container')?.querySelector('.power-value');
      this.sampleSizeSlider.addEventListener('input', (e) => {
        const v = parseInt(e.target.value) || 5;
        this.currentValues.sampleSize = v;
        if (badge) badge.textContent = String(v);
        this.updateRangeFill && this.updateRangeFill(this.sampleSizeSlider);
        this.updateCalculations();
      });
      const dec = document.getElementById('decrementSampleSize');
      const inc = document.getElementById('incrementSampleSize');
      const step = parseFloat(this.sampleSizeSlider.step) || 1;
      const min = parseFloat(this.sampleSizeSlider.min) || 5;
      const max = parseFloat(this.sampleSizeSlider.max) || 500;
      if (dec) dec.addEventListener('click', () => {
        const cur = parseInt(this.sampleSizeSlider.value) || min;
        const nv = Math.max(min, cur - step);
        this.sampleSizeSlider.value = String(nv);
        this.currentValues.sampleSize = nv;
        if (badge) badge.textContent = String(nv);
        this.updateRangeFill && this.updateRangeFill(this.sampleSizeSlider);
        this.updateCalculations();
      });
      if (inc) inc.addEventListener('click', () => {
        const cur = parseInt(this.sampleSizeSlider.value) || min;
        const nv = Math.min(max, cur + step);
        this.sampleSizeSlider.value = String(nv);
        this.currentValues.sampleSize = nv;
        if (badge) badge.textContent = String(nv);
        this.updateRangeFill && this.updateRangeFill(this.sampleSizeSlider);
        this.updateCalculations();
      });
    }

    // Slider: confidence level
    if (this.confidenceLevelSlider) {
      const badge = this.confidenceLevelSlider.closest('.effect-row')?.querySelector('.slider-value');
      this.confidenceLevelSlider.addEventListener('input', (e) => {
        const v = Math.max(0.5, Math.min(0.999, parseFloat(e.target.value) || 0.95));
        this.currentValues.confidenceLevel = v;
        if (badge) badge.textContent = Math.round(v * 100) + '%';
        this.updateRangeFill && this.updateRangeFill(this.confidenceLevelSlider);
        this.updateCalculations();
      });
      const dec = document.getElementById('decrementConfidenceLevel');
      const inc = document.getElementById('incrementConfidenceLevel');
      const step = parseFloat(this.confidenceLevelSlider.step) || 0.01;
      const min = parseFloat(this.confidenceLevelSlider.min) || 0.5;
      const max = parseFloat(this.confidenceLevelSlider.max) || 0.99;
      if (dec) dec.addEventListener('click', () => {
        const cur = parseFloat(this.confidenceLevelSlider.value) || min;
        const nv = Math.max(min, cur - step);
        this.confidenceLevelSlider.value = String(nv);
        this.currentValues.confidenceLevel = nv;
        if (badge) badge.textContent = Math.round(nv * 100) + '%';
        this.updateRangeFill && this.updateRangeFill(this.confidenceLevelSlider);
        this.updateCalculations();
      });
      if (inc) inc.addEventListener('click', () => {
        const cur = parseFloat(this.confidenceLevelSlider.value) || min;
        const nv = Math.min(max, cur + step);
        this.confidenceLevelSlider.value = String(nv);
        this.currentValues.confidenceLevel = nv;
        if (badge) badge.textContent = Math.round(nv * 100) + '%';
        this.updateRangeFill && this.updateRangeFill(this.confidenceLevelSlider);
        this.updateCalculations();
      });
    }

    // Slider: standard deviation
    if (this.standardDeviationSlider) {
      const badge = this.standardDeviationSlider.closest('.effect-row')?.querySelector('.slider-value');
      this.standardDeviationSlider.addEventListener('input', (e) => {
        const v = Math.max(0.0001, parseFloat(e.target.value) || 1);
        this.currentValues.standardDeviation = v;
        if (badge) badge.textContent = String(v);
        this.updateRangeFill && this.updateRangeFill(this.standardDeviationSlider);
        this.updateCalculations();
      });
      const dec = document.getElementById('decrementStandardDeviation');
      const inc = document.getElementById('incrementStandardDeviation');
      const step = parseFloat(this.standardDeviationSlider.step) || 0.5;
      const min = parseFloat(this.standardDeviationSlider.min) || 0.0001;
      const max = parseFloat(this.standardDeviationSlider.max) || 1000;
      if (dec) dec.addEventListener('click', () => {
        const cur = parseFloat(this.standardDeviationSlider.value) || min;
        const nv = Math.max(min, cur - step);
        this.standardDeviationSlider.value = String(nv);
        this.currentValues.standardDeviation = nv;
        if (badge) badge.textContent = String(nv);
        this.updateRangeFill && this.updateRangeFill(this.standardDeviationSlider);
        this.updateCalculations();
      });
      if (inc) inc.addEventListener('click', () => {
        const cur = parseFloat(this.standardDeviationSlider.value) || min;
        const nv = Math.min(max, cur + step);
        this.standardDeviationSlider.value = String(nv);
        this.currentValues.standardDeviation = nv;
        if (badge) badge.textContent = String(nv);
        this.updateRangeFill && this.updateRangeFill(this.standardDeviationSlider);
        this.updateCalculations();
      });
    }

    // Slider: sample mean
    if (this.sampleMeanSlider) {
      const badge = this.sampleMeanSlider.closest('.effect-row')?.querySelector('.slider-value');
      this.sampleMeanSlider.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value) || 0;
        this.currentValues.sampleMean = v;
        if (badge) badge.textContent = String(v);
        this.updateRangeFill && this.updateRangeFill(this.sampleMeanSlider);
        this.updateCalculations();
      });
      const dec = document.getElementById('decrementSampleMean');
      const inc = document.getElementById('incrementSampleMean');
      const step = parseFloat(this.sampleMeanSlider.step) || 0.5;
      const min = parseFloat(this.sampleMeanSlider.min) || 0;
      const max = parseFloat(this.sampleMeanSlider.max) || 100000;
      if (dec) dec.addEventListener('click', () => {
        const cur = parseFloat(this.sampleMeanSlider.value) || min;
        const nv = Math.max(min, cur - step);
        this.sampleMeanSlider.value = String(nv);
        this.currentValues.sampleMean = nv;
        if (badge) badge.textContent = String(nv);
        this.updateRangeFill && this.updateRangeFill(this.sampleMeanSlider);
        this.updateCalculations();
      });
      if (inc) inc.addEventListener('click', () => {
        const cur = parseFloat(this.sampleMeanSlider.value) || min;
        const nv = Math.min(max, cur + step);
        this.sampleMeanSlider.value = String(nv);
        this.currentValues.sampleMean = nv;
        if (badge) badge.textContent = String(nv);
        this.updateRangeFill && this.updateRangeFill(this.sampleMeanSlider);
        this.updateCalculations();
      });
    }

    // Estimation type select (for future modes)
    if (this.estimationTypeSelect) {
      this.estimationTypeSelect.addEventListener('change', (e) => {
        this.currentValues.estimationType = e.target.value || 'single-mean';
        this.updateCalculations();
      });
    }

    // Distribution segmented toggle
    if (this.distributionTypeToggle) {
      const buttons = this.distributionTypeToggle.querySelectorAll('.segment');
      buttons.forEach(btn => btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const v = btn.dataset.value || 't';
        this.currentValues.distributionType = v;
        this.updateCalculations();
      }));
    }

    // Theme select
    if (this.chartThemeSelect) {
      this.chartThemeSelect.addEventListener('change', () => this.updateIntervalChart(this.calculateCI()));
    }

    // Clear all
    const clearBtn = document.getElementById('clearAllBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        // Defaults
        this.currentValues = {
          sampleSize: 30,
          confidenceLevel: 0.95,
          standardDeviation: 15,
          sampleMean: 100,
          estimationType: 'single-mean',
          distributionType: 't'
        };
        if (this.sampleSizeSlider) this.sampleSizeSlider.value = '30';
        if (this.confidenceLevelSlider) this.confidenceLevelSlider.value = '0.95';
        if (this.standardDeviationSlider) this.standardDeviationSlider.value = '15';
        if (this.sampleMeanSlider) this.sampleMeanSlider.value = '100';
        // Update badges
        const nBadge = document.querySelector('#sampleSize')?.closest('.power-container')?.querySelector('.power-value');
        if (nBadge) nBadge.textContent = '30';
        const clBadge = this.confidenceLevelSlider?.closest('.effect-row')?.querySelector('.slider-value');
        if (clBadge) clBadge.textContent = '95%';
        const sdBadge = this.standardDeviationSlider?.closest('.effect-row')?.querySelector('.slider-value');
        if (sdBadge) sdBadge.textContent = '15';
        const meanBadge = this.sampleMeanSlider?.closest('.effect-row')?.querySelector('.slider-value');
        if (meanBadge) meanBadge.textContent = '100';
        this.updateCalculations();
      });
    }
  }

  calculateSampleSize() {
    // Override parent method to calculate CI instead
    return this.calculateCI();
  }

  calculateCI() {
    const { sampleSize: n, confidenceLevel, standardDeviation: sd, sampleMean, distributionType } = this.currentValues;
    
    const alpha = 1 - confidenceLevel;
    
    // Calculate critical value
    let critical;
    if (distributionType === 't') {
      const df = n - 1;
      critical = this.getTCritical(1 - alpha / 2, df);
    } else {
      critical = this.getZCritical(1 - alpha / 2);
    }
    
    // Calculate standard error
    const se = sd / Math.sqrt(n);
    
    // Calculate margin of error
    const marginOfError = critical * se;
    
    // Calculate bounds
    const lowerBound = sampleMean - marginOfError;
    const upperBound = sampleMean + marginOfError;
    const intervalWidth = upperBound - lowerBound;
    
    return {
      sampleSize: n,
      intervalWidth: intervalWidth,
      marginOfError: marginOfError,
      lowerBound: lowerBound,
      upperBound: upperBound,
      criticalValue: critical,
      standardError: se,
      confidenceLevel: confidenceLevel
    };
  }

  getTCritical(p, df) {
    // Use jStat for t-distribution inverse
    if (typeof jStat !== 'undefined' && jStat.studentt) {
      return jStat.studentt.inv(p, df);
    }
    // Fallback approximation
    return this.getZCritical(p) * (1 + 1 / (4 * df));
  }

  getZCritical(p) {
    // Use jStat for normal distribution inverse
    if (typeof jStat !== 'undefined' && jStat.normal) {
      return jStat.normal.inv(p, 0, 1);
    }
    // Common fallback values
    if (Math.abs(p - 0.975) < 0.001) return 1.96;
    if (Math.abs(p - 0.95) < 0.001) return 1.645;
    if (Math.abs(p - 0.995) < 0.001) return 2.576;
    return 1.96; // Default
  }

  updateCalculations() {
    const results = this.calculateCI();
    
    // Update result displays
    this.resultValues.sampleSize.textContent = results.sampleSize;
    
    // Format interval width to 2 decimals
    const widthEl = document.querySelector('.result-value:nth-child(1)');
    if (widthEl) widthEl.textContent = results.intervalWidth.toFixed(2);
    
    const meEl = document.querySelector('.result-value.power');
    if (meEl) meEl.textContent = '±' + results.marginOfError.toFixed(2);
    
    const lbEl = document.querySelector('.result-value.effect');
    if (lbEl) lbEl.textContent = results.lowerBound.toFixed(2);
    
    // Add upper bound (need to get 4th result value if it exists)
    const allResults = document.querySelectorAll('.result-value');
    if (allResults.length >= 4) {
      allResults[3].textContent = results.upperBound.toFixed(2);
    }
    
    // Update charts
    this.updateIntervalChart(results);
    
    // Update design info
    this.updateDesignInfo(results);
    
    // Update code blocks
    this.updateCodeBlock();
    
    // Update APA table
    this.updateCITable(results);
  }

  updateIntervalChart(results) {
    if (!this.powerChart || typeof Plotly === 'undefined') return;

    const currentN = results.sampleSize;
    const { confidenceLevel, standardDeviation, sampleMean, distributionType } = this.currentValues;
    
    // Generate curve showing how interval width changes with sample size
    const sampleSizes = [];
    const widths = [];
    
    const minN = 5;
    const maxN = Math.max(500, currentN * 3);
    
    // Generate 200 points with quadratic spacing for smooth curve
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const n = Math.round(minN + (maxN - minN) * t * t);
      
      if (sampleSizes.length > 0 && sampleSizes[sampleSizes.length - 1] === n) continue;
      
      sampleSizes.push(n);
      
      // Calculate width for this sample size
      const alpha = 1 - confidenceLevel;
      let critical;
      if (distributionType === 't') {
        const df = n - 1;
        critical = this.getTCritical(1 - alpha / 2, df);
      } else {
        critical = this.getZCritical(1 - alpha / 2);
      }
      const se = standardDeviation / Math.sqrt(n);
      const me = critical * se;
      const width = 2 * me;
      widths.push(width);
    }

    // Get theme
    const themeName = this.chartThemeSelect ? this.chartThemeSelect.value : 'default';
    const theme = this.chartThemes[themeName] || this.chartThemes.default;

    // Create traces
    const traces = [
      {
        x: sampleSizes,
        y: widths,
        type: 'scatter',
        mode: 'lines',
        name: 'Interval Width',
        line: { color: theme.line, width: 2 },
        hovertemplate: '<b>n = %{x}</b><br>Width = %{y:.2f}<extra></extra>'
      },
      {
        x: [currentN],
        y: [results.intervalWidth],
        type: 'scatter',
        mode: 'markers',
        name: 'Current n',
        marker: { 
          size: 10, 
          color: '#dc2626',
          line: { color: '#ffffff', width: 2 }
        },
        hovertemplate: `<b>n = ${currentN}</b><br>Width = ${results.intervalWidth.toFixed(2)}<extra></extra>`
      },
      {
        // Vertical line from point to x-axis
        x: [currentN, currentN],
        y: [results.intervalWidth, 0],
        type: 'scatter',
        mode: 'lines',
        line: { color: '#dc2626', width: 1, dash: 'dot' },
        showlegend: false,
        hoverinfo: 'skip'
      }
    ];

    const layout = {
      xaxis: {
        title: { text: 'Sample Size (n)', font: { family: 'Inter, sans-serif', size: 14, color: '#1e293b' } },
        gridcolor: theme.grid,
        linecolor: '#cbd5e1',
        linewidth: 2,
        showline: true,
        tickfont: { size: 12, color: '#64748b' },
        rangemode: 'tozero'
      },
      yaxis: {
        title: { text: 'Confidence Interval Width', font: { family: 'Inter, sans-serif', size: 14, color: '#1e293b' } },
        gridcolor: theme.grid,
        linecolor: '#cbd5e1',
        linewidth: 2,
        showline: true,
        tickfont: { size: 12, color: '#64748b' },
        rangemode: 'tozero'
      },
      margin: { t: 60, r: 30, b: 60, l: 70 },
      hovermode: 'closest',
      showlegend: false,
      plot_bgcolor: theme.background,
      paper_bgcolor: theme.background,
      annotations: [
        {
          x: currentN,
          y: 0,
          ax: currentN,
          ay: results.intervalWidth,
          xref: 'x', yref: 'y', axref: 'x', ayref: 'y',
          showarrow: true,
          arrowhead: 3,
          arrowsize: 1,
          arrowwidth: 1,
          arrowcolor: '#dc2626'
        }
      ]
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
      toImageButtonOptions: { 
        format: 'png', 
        filename: 'ci_width_curve', 
        height: 600, 
        width: 1000, 
        scale: 2 
      }
    };

    Plotly.react(this.powerChart, traces, layout, config);
  }

  updateDesignInfo(results) {
    const designInfo = document.querySelector('.design-info p');
    const warning = document.querySelector('.warning');
    
    if (designInfo) {
      const cl = (this.currentValues.confidenceLevel * 100).toFixed(0);
      designInfo.innerHTML = `<strong>Current Design:</strong> With n = ${results.sampleSize}, your ${cl}% CI spans ${results.intervalWidth.toFixed(2)} units (Margin of Error = ±${results.marginOfError.toFixed(2)}).`;
    }
    
    if (warning) {
      if (results.intervalWidth > 40) {
        warning.style.display = 'flex';
        warning.innerHTML = `
          <span class="warning-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="#F59E0B"/>
              <path d="M12 9v5" stroke="#111827" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="17" r="1" fill="#111827"/>
            </svg>
          </span>
          Interval is quite wide. Consider increasing sample size for better precision.
        `;
      } else {
        warning.style.display = 'none';
      }
    }
  }

  updateCITable(results) {
    // Update APA table with CI-specific information
    document.getElementById('tableTestType').textContent = 'Confidence Interval for Mean';
    document.getElementById('tableTestTypeDesc').textContent = 'Interval estimate for population mean';
    
    document.getElementById('tableEffectSize').textContent = results.sampleSize;
    document.getElementById('tableEffectSizeDesc').textContent = 'Number of observations';
    
    const cl = (this.currentValues.confidenceLevel * 100).toFixed(0);
    document.getElementById('tableAlpha').textContent = `${cl}%`;
    document.getElementById('tableAlphaDesc').textContent = 'Confidence level';
    
    document.getElementById('tablePower').textContent = results.intervalWidth.toFixed(2);
    document.getElementById('tablePowerDesc').textContent = 'Range of plausible values (width)';
    
    document.getElementById('tableDirection').textContent = `[${results.lowerBound.toFixed(2)}, ${results.upperBound.toFixed(2)}]`;
    document.getElementById('tableDirectionDesc').textContent = 'Lower and upper bounds';
    
    document.getElementById('tableSamplingDesign').textContent = this.currentValues.distributionType === 't' ? 't-distribution' : 'z-distribution';
    document.getElementById('tableSamplingDesignDesc').textContent = this.currentValues.distributionType === 't' 
      ? 'Exact for normal data, robust for large n' 
      : 'Appropriate when σ is known';
    
    const designParamsRow = document.getElementById('tableDesignParamsRow');
    if (designParamsRow) designParamsRow.style.display = 'none';
    
    document.getElementById('tableExtraction').textContent = `±${results.marginOfError.toFixed(2)}`;
    document.getElementById('tableExtractionDesc').textContent = 'Maximum expected error';
    
    const fpcRow = document.getElementById('tableFPCRow');
    if (fpcRow) fpcRow.style.display = 'none';
    
    document.getElementById('tableSampleSize').textContent = `${results.lowerBound.toFixed(2)} to ${results.upperBound.toFixed(2)}`;
    document.getElementById('tableSampleSizeDesc').textContent = `${cl}% CI for population mean`;
    
    const noteText = document.getElementById('vizNotesText');
    if (noteText) {
      noteText.textContent = `Confidence interval calculated using ${this.currentValues.distributionType === 't' ? 't' : 'z'}-distribution. Formula: x̄ ± ${this.currentValues.distributionType === 't' ? 't' : 'z'}* × (σ/√n).`;
    }
  }

  generateRCode() {
    const { sampleSize, confidenceLevel, standardDeviation, sampleMean, distributionType } = this.currentValues;
    const cl = (confidenceLevel * 100).toFixed(0);
    
    return `# Confidence Interval Calculation
# Sample parameters
n <- ${sampleSize}
x_bar <- ${sampleMean}
sigma <- ${standardDeviation}
conf_level <- ${confidenceLevel}

# Calculate standard error
se <- sigma / sqrt(n)

# Calculate critical value
alpha <- 1 - conf_level
${distributionType === 't' ? `df <- n - 1
critical <- qt(1 - alpha/2, df)` : `critical <- qnorm(1 - alpha/2)`}

# Calculate margin of error
me <- critical * se

# Calculate confidence interval
lower_bound <- x_bar - me
upper_bound <- x_bar + me

# Display results
cat("${cl}% Confidence Interval for Mean\\n")
cat("Sample size: n =", n, "\\n")
cat("Sample mean: x̄ =", x_bar, "\\n")
cat("Standard deviation: σ =", sigma, "\\n")
cat("Standard error: SE =", round(se, 4), "\\n")
cat("Critical value: ${distributionType === 't' ? 't*' : 'z*'} =", round(critical, 4), "\\n")
cat("Margin of error: ME = ±", round(me, 4), "\\n")
cat("\\n${cl}% CI: [", round(lower_bound, 2), ",", round(upper_bound, 2), "]\\n")
cat("Interval width:", round(upper_bound - lower_bound, 2), "\\n")

# Alternative using built-in functions (for verification)
# Note: This assumes you have actual sample data
# sample_data <- rnorm(n, mean = x_bar, sd = sigma)
# t.test(sample_data, conf.level = conf_level)$conf.int`;
  }

  generateROutput() {
    const results = this.calculateCI();
    const { sampleSize, confidenceLevel, standardDeviation, sampleMean, distributionType } = this.currentValues;
    const cl = (confidenceLevel * 100).toFixed(0);
    
    return `${cl}% Confidence Interval for Mean
Sample size: n = ${sampleSize}
Sample mean: x̄ = ${sampleMean}
Standard deviation: σ = ${standardDeviation}
Standard error: SE = ${results.standardError.toFixed(4)}
Critical value: ${distributionType === 't' ? 't*' : 'z*'} = ${results.criticalValue.toFixed(4)}
Margin of error: ME = ±${results.marginOfError.toFixed(4)}

${cl}% CI: [${results.lowerBound.toFixed(2)}, ${results.upperBound.toFixed(2)}]
Interval width: ${results.intervalWidth.toFixed(2)}`;
  }
}

// Initialize calculator when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new ConfidenceIntervalCalculator();
  });
} else {
  window.calculator = new ConfidenceIntervalCalculator();
}

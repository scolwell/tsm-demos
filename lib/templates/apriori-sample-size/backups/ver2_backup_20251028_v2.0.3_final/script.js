// ==============================
// VERSION & BUILD CONTROL
// ==============================
const APP_VERSION = {
  major: 2,
  minor: 0,
  patch: 3,
  build: '20251028',
  toString() {
    return `v${this.major}.${this.minor}.${this.patch}`;
  },
  getBuildString() {
    return `Build ${this.build}`;
  },
  getFullVersion() {
    return `${this.toString()} (${this.getBuildString()})`;
  }
};

// ==============================
// MAIN ESTIMATOR CLASS
// ==============================
class SampleSizeEstimator {
  constructor() {
    this.version = APP_VERSION;
    this.initializeElements();
    // Setup consolidated Advanced panel (FPC + design-specific)
    this.setupCombinedAdvancedPanel && this.setupCombinedAdvancedPanel();
    this.bindEvents();
    this.initializeCharts();
    this.updateCalculations();
    this.displayVersion();
  }

  initializeElements() {
    // Form elements
    this.effectSizeSlider = document.getElementById('effectSize');
    this.statisticalPowerSlider = document.getElementById('statisticalPower');
    this.testTypeSelect = document.getElementById('testType');
  this.nullHypothesisPill = document.getElementById('nullHypothesis');
  // Old selects may not exist after toggles are introduced
  this.significanceLevelSelect = document.getElementById('significanceLevel');
  this.testDirectionSelect = document.getElementById('testDirection');

    // Display elements
    this.sliderValue = document.querySelector('.slider-value');
    this.powerValue = document.querySelector('.power-value');
    this.resultValues = {
      sampleSize: document.querySelector('.result-value:first-child'),
      achievedPower: document.querySelector('.result-value.power'),
      effectSize: document.querySelector('.result-value.effect')
    };

    // Charts
    this.powerChart = document.getElementById('powerChart');
    this.samplingVisualization = document.getElementById('samplingVisualization');
    this.samplingCtx = this.samplingVisualization?.getContext('2d');

    // Chart theme control
    this.chartThemeSelect = document.getElementById('chartTheme');
  this.themeSwatch = document.getElementById('themeSwatch');
    
    // Define chart themes
    this.chartThemes = {
      default: { line: "#0067FF", background: "#FFFFFF", grid: "#E5E7EB" },
      midnight: { line: "#FFFFFF", background: "#0F172A", grid: "#2E3B4E" },
      emerald: { line: "#1ABC9C", background: "#F7F9FC", grid: "#D0E8E2" },
      crimson: { line: "#E74C3C", background: "#FFF8F6", grid: "#F2D7D5" },
      amber: { line: "#F5B041", background: "#FFFDF5", grid: "#F9E79F" },
      indigo: { line: "#5B5BD6", background: "#F9F8FF", grid: "#DAD9F7" },
      graphite: { line: "#555555", background: "#FFFFFF", grid: "#CCCCCC" },
      ocean: { line: "#0097A7", background: "#F2FBFD", grid: "#B2EBF2" },
      forest: { line: "#27AE60", background: "#F7FFF9", grid: "#D4EFDF" },
      magenta: { line: "#C2185B", background: "#FFF5F8", grid: "#F5B7B1" }
    };

  // Ensure sampling canvas matches its container size
  this.resizeSamplingCanvas();

    // Build custom select UI for test type
    this.setupCustomSelect(this.testTypeSelect);
  // Build custom select UI for FPC preset
  this.setupCustomSelect(this.populationPresetSelect);

  // Effect size segmented toggle
  this.effectSizeToggle = document.getElementById('effectSizeToggle');
  this.effectSizeButtons = this.effectSizeToggle ? this.effectSizeToggle.querySelectorAll('.segment') : [];

  // Significance level segmented toggle
  this.significanceToggle = document.getElementById('significanceToggle');
  this.significanceButtons = this.significanceToggle ? this.significanceToggle.querySelectorAll('.segment') : [];

  // Test direction segmented toggle
  this.testDirectionToggle = document.getElementById('testDirectionToggle');
  this.testDirectionButtons = this.testDirectionToggle ? this.testDirectionToggle.querySelectorAll('.segment') : [];

  // Code language toggle
  this.codeLangToggle = document.getElementById('codeLangToggle');
  this.codeLangButtons = this.codeLangToggle ? this.codeLangToggle.querySelectorAll('.segment') : [];
  this.codeToggleLabel = document.getElementById('codeToggleLabel');
  this.codeLangDescription = document.getElementById('codeLangDescription');
  this.codeBlock = document.getElementById('codeBlock');
  
  // R Output elements (new)
  this.outputToggleLabel = document.getElementById('outputToggleLabel');
  this.outputBlock = document.getElementById('outputBlock');

  // Effect size calculation panel
  this.effectCalcToggle = document.getElementById('toggleEffectCalc');
  this.effectCalcPanel = document.getElementById('effectCalcPanel');
  this.calcSections = this.effectCalcPanel ? this.effectCalcPanel.querySelectorAll('.calc-section') : [];
  // Inputs for single-sample
  this.ss_mean = document.getElementById('ss_mean');
  this.ss_null_mean = document.getElementById('ss_null_mean');
  this.ss_sd = document.getElementById('ss_sd');
  // Inputs for paired
  this.pd_mean_diff = document.getElementById('pd_mean_diff');
  this.pd_sd_diff = document.getElementById('pd_sd_diff');
  // Inputs for two-sample
  this.ts_mean1 = document.getElementById('ts_mean1');
  this.ts_mean2 = document.getElementById('ts_mean2');
  this.ts_sd1 = document.getElementById('ts_sd1');
  this.ts_sd2 = document.getElementById('ts_sd2');
  this.ts_n1 = document.getElementById('ts_n1');
  this.ts_n2 = document.getElementById('ts_n2');
  // Compute button and error
  this.computeEffectBtn = document.getElementById('computeEffectSize');
  this.effectCalcError = document.getElementById('effectCalcError');

  // Design parameters panel & inputs
  this.designParamsPanel = document.getElementById('designParamsPanel');
  this.designSections = this.designParamsPanel ? this.designParamsPanel.querySelectorAll('.design-section') : [];
  // Stratified inputs
  this.numStrata = document.getElementById('numStrata');
  this.stratVarReduction = document.getElementById('stratVarReduction');
  // Allocation mode toggles (proportional vs equal)
  this.strataAllocMode = document.getElementById('strataAllocMode');
  // Custom allocation advanced (stratified)
  this.stratCustomAllocToggle = document.getElementById('stratCustomAllocToggle');
  this.stratCustomAllocEditor = document.getElementById('stratCustomAllocEditor');
  this.stratAllocRows = document.getElementById('stratAllocRows');
  // Cluster inputs
  this.clusterICC = document.getElementById('clusterICC');
  this.clusterCV = document.getElementById('clusterCV');
  this.numClusters = document.getElementById('numClusters');
  this.clusterMEst = document.getElementById('clusterM_est');
  // Cluster variability mode and mix inputs
  this.clusterVarMode = document.getElementById('clusterVarMode');
  this.clusterCVRow = document.getElementById('clusterCVRow');
  this.clusterMixRow = document.getElementById('clusterMixRow');
  this.clusterMixSmall = document.getElementById('clusterMixSmall');
  this.clusterMixMed = document.getElementById('clusterMixMed');
  this.clusterMixLarge = document.getElementById('clusterMixLarge');
  // Stratified + Cluster inputs
  this.sc_clusterICC = document.getElementById('sc_clusterICC');
  this.sc_clusterCV = document.getElementById('sc_clusterCV');
  this.sc_stratVarReduction = document.getElementById('sc_stratVarReduction');
  this.sc_numClusters = document.getElementById('sc_numClusters');
  this.sc_clusterMEst = document.getElementById('sc_clusterM_est');
  this.sc_strataAllocMode = document.getElementById('sc_strataAllocMode');
  // Custom allocation advanced (stratified+cluster)
  this.sc_stratCustomAllocToggle = document.getElementById('sc_stratCustomAllocToggle');
  this.sc_stratCustomAllocEditor = document.getElementById('sc_stratCustomAllocEditor');
  this.sc_stratAllocRows = document.getElementById('sc_stratAllocRows');

  // No layout tuning slider (removed)
  // Stratified+Cluster variability mode and mix inputs
  this.sc_clusterVarMode = document.getElementById('sc_clusterVarMode');
  this.sc_clusterCVRow = document.getElementById('sc_clusterCVRow');
  this.sc_clusterMixRow = document.getElementById('sc_clusterMixRow');
  this.sc_clusterMixSmall = document.getElementById('sc_clusterMixSmall');
  this.sc_clusterMixMed = document.getElementById('sc_clusterMixMed');
  this.sc_clusterMixLarge = document.getElementById('sc_clusterMixLarge');

  // Combined Advanced panel (new)
  this.designAdvToggle = document.getElementById('toggleDesignAdvanced');
  this.designAdvPanel = document.getElementById('designAdvancedPanel');
  this.designAdvSummary = document.getElementById('designAdvSummary');
  this.advancedGlobalContainer = document.getElementById('advancedGlobalContainer');
  this.advancedDesignContainer = document.getElementById('advancedDesignContainer');

  // Collapsible controls for design params panel and advanced sections
  this.toggleDesignParamsBtn = document.getElementById('toggleDesignParams');
  this.clusterAdvancedToggle = document.getElementById('clusterAdvancedToggle');
  this.clusterAdvanced = document.getElementById('clusterAdvanced');
  this.scAdvancedToggle = document.getElementById('scAdvancedToggle');
  this.scAdvanced = document.getElementById('scAdvanced');
  this.stratAdvancedToggle = document.getElementById('stratAdvancedToggle');
  this.stratAdvanced = document.getElementById('stratAdvanced');

  // Population (Finite Population Correction) controls - now under Advanced
    this.togglePopulation = document.getElementById('toggleAdvanced');
  this.populationOptionsPanel = document.getElementById('advancedPanel');
  this.populationPresetSelect = document.getElementById('populationPreset');
  this.populationSizeInput = document.getElementById('populationSize');

    // Current values
    this.currentValues = {
      effectSize: 0.5,
      statisticalPower: 0.8,
      testType: 'single-sample',
      significanceLevel: 0.05,
      testDirection: 'two-tailed',
      samplingDesign: 'no-stratification',
      extractionMethod: 'simple-random',
      populationEnabled: false,
      populationSize: null
    };
    
    // Sync currentValues with actual HTML element values
    if (this.effectSizeSlider) {
      this.currentValues.effectSize = parseFloat(this.effectSizeSlider.value) || 0.5;
    }
    if (this.statisticalPowerSlider) {
      this.currentValues.statisticalPower = parseFloat(this.statisticalPowerSlider.value) || 0.8;
    }
    if (this.testTypeSelect) {
      this.currentValues.testType = this.testTypeSelect.value || 'single-sample';
    }
    if (this.significanceLevelSelect) {
      this.currentValues.significanceLevel = parseFloat(this.significanceLevelSelect.value) || 0.05;
    }
    if (this.testDirectionSelect) {
      this.currentValues.testDirection = this.testDirectionSelect.value || 'two-tailed';
    }

    // Code language state
    this.currentCodeLang = 'r';

    // Visualization notes list
    this.vizNotesList = document.getElementById('vizNotesList');
    this.vizResample = document.getElementById('vizResample');
    this.vizPlaceholder = document.getElementById('vizPlaceholder');
    this.dismissVizPlaceholder = document.getElementById('dismissVizPlaceholder');

    this.vizState = { hasInteracted: false };

    // Params summary
    this.paramsSummary = document.getElementById('paramsSummary');

    // Tree containers and controls
    this.samplingTree = document.getElementById('samplingTree');
    this.samplingTreeSvg = document.getElementById('samplingTreeSvg');
    this.treeViewMode = document.getElementById('treeViewMode');
    this.treeViewButtons = this.treeViewMode ? this.treeViewMode.querySelectorAll('.segment') : [];
    this.treeView = 'outline';
  }

  bindEvents() {
    // Sliders
    this.effectSizeSlider.addEventListener('input', (e) => {
      this.markInteracted();
      this.currentValues.effectSize = parseFloat(e.target.value);
      this.sliderValue.textContent = this.currentValues.effectSize.toFixed(2);
      this.updateRangeFill(e.target);
      this.syncEffectSizeToggle();
      this.updateCalculations();
    });

    this.statisticalPowerSlider.addEventListener('input', (e) => {
      this.markInteracted();
      this.currentValues.statisticalPower = parseFloat(e.target.value);
      this.powerValue.textContent = Math.round(e.target.value * 100) + '%';
      this.updateRangeFill(e.target);
      this.updateCalculations();
    });

    // Stepper buttons for power slider
    const decrementPower = document.getElementById('decrementPower');
    const incrementPower = document.getElementById('incrementPower');
    if (decrementPower) {
      decrementPower.addEventListener('click', () => {
        this.markInteracted();
        const currentValue = parseFloat(this.statisticalPowerSlider.value);
        const step = parseFloat(this.statisticalPowerSlider.step) || 0.01;
        const min = parseFloat(this.statisticalPowerSlider.min);
        const newValue = Math.max(min, currentValue - step);
        this.statisticalPowerSlider.value = newValue;
        this.currentValues.statisticalPower = newValue;
        this.powerValue.textContent = Math.round(newValue * 100) + '%';
        this.updateRangeFill(this.statisticalPowerSlider);
        this.updateCalculations();
      });
    }
    if (incrementPower) {
      incrementPower.addEventListener('click', () => {
        this.markInteracted();
        const currentValue = parseFloat(this.statisticalPowerSlider.value);
        const step = parseFloat(this.statisticalPowerSlider.step) || 0.01;
        const max = parseFloat(this.statisticalPowerSlider.max);
        const newValue = Math.min(max, currentValue + step);
        this.statisticalPowerSlider.value = newValue;
        this.currentValues.statisticalPower = newValue;
        this.powerValue.textContent = Math.round(newValue * 100) + '%';
        this.updateRangeFill(this.statisticalPowerSlider);
        this.updateCalculations();
      });
    }

    // Stepper buttons for effect size slider
    const decrementEffect = document.getElementById('decrementEffect');
    const incrementEffect = document.getElementById('incrementEffect');
    if (decrementEffect) {
      decrementEffect.addEventListener('click', () => {
        this.markInteracted();
        const currentValue = parseFloat(this.effectSizeSlider.value);
        const step = parseFloat(this.effectSizeSlider.step) || 0.1;
        const min = parseFloat(this.effectSizeSlider.min);
        const newValue = Math.max(min, currentValue - step);
        this.effectSizeSlider.value = newValue;
        this.currentValues.effectSize = newValue;
        this.sliderValue.textContent = newValue.toFixed(2);
        this.updateRangeFill(this.effectSizeSlider);
        this.syncEffectSizeToggle();
        this.updateCalculations();
      });
    }
    if (incrementEffect) {
      incrementEffect.addEventListener('click', () => {
        this.markInteracted();
        const currentValue = parseFloat(this.effectSizeSlider.value);
        const step = parseFloat(this.effectSizeSlider.step) || 0.1;
        const max = parseFloat(this.effectSizeSlider.max);
        const newValue = Math.min(max, currentValue + step);
        this.effectSizeSlider.value = newValue;
        this.currentValues.effectSize = newValue;
        this.sliderValue.textContent = newValue.toFixed(2);
        this.updateRangeFill(this.effectSizeSlider);
        this.syncEffectSizeToggle();
        this.updateCalculations();
      });
    }

    // Selects
    this.testTypeSelect.addEventListener('change', (e) => {
      this.markInteracted();
      this.currentValues.testType = e.target.value;
      this.updateCalculations();
      this.updateEffectCalcSectionVisibility();
    });

    if (this.significanceLevelSelect) {
      this.significanceLevelSelect.addEventListener('change', (e) => {
        this.markInteracted();
        this.currentValues.significanceLevel = parseFloat(e.target.value);
        this.updateCalculations();
      });
    }

    if (this.testDirectionSelect) {
      this.testDirectionSelect.addEventListener('change', (e) => {
        this.markInteracted();
        this.currentValues.testDirection = e.target.value;
        this.updateCalculations();
      });
    }

    // Update null hypothesis pill when test type changes
    if (this.testTypeSelect && this.nullHypothesisPill) {
      this.testTypeSelect.addEventListener('change', () => {
        this.updateNullHypothesisPill();
      });
    }

    // Toggle effect size calculation panel
    if (this.effectCalcToggle && this.effectCalcPanel) {
      this.effectCalcToggle.addEventListener('click', () => {
        const isHidden = this.effectCalcPanel.hasAttribute('hidden');
        if (isHidden) {
          this.effectCalcPanel.removeAttribute('hidden');
          this.effectCalcToggle.setAttribute('aria-expanded', 'true');
        } else {
          this.effectCalcPanel.setAttribute('hidden', '');
          this.effectCalcToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Compute effect size from summary stats
    if (this.computeEffectBtn) {
      this.computeEffectBtn.addEventListener('click', () => {
        this.computeEffectSizeFromStats();
      });
    }

    // Sampling design options
    document.querySelectorAll('.sampling-option').forEach(option => {
      option.addEventListener('click', (e) => {
        this.markInteracted();
        document.querySelectorAll('.sampling-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        this.currentValues.samplingDesign = option.dataset.design;
        this.updateDesignParamsVisibility();
        this.updateCalculations();
      });
    });

    // Extraction method options
    document.querySelectorAll('.extraction-option').forEach(option => {
      option.addEventListener('click', (e) => {
        this.markInteracted();
        document.querySelectorAll('.extraction-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        this.currentValues.extractionMethod = option.dataset.method;
        this.updateCalculations();
      });
    });

    // Tab navigation
    document.querySelectorAll('.tab-button').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        // In a real app, this would switch between different calculation modes
      });
    });

    // Chart theme control
    if (this.chartThemeSelect) {
      this.chartThemeSelect.addEventListener('change', () => {
        this.updatePowerChart();
      });
    }

    // Clear all button
    const clearBtn = document.getElementById('clearAllBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.resetAll();
      });
    }

    // Tree view toggle
    if (this.treeViewButtons && this.treeViewButtons.length) {
      this.treeViewButtons.forEach(btn => btn.addEventListener('click', () => {
        this.treeViewButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.treeView = btn.dataset.view || 'outline';
        if (this.samplingTree && this.samplingTreeSvg) {
          if (this.treeView === 'diagram') {
            this.samplingTree.style.display = 'none';
            this.samplingTreeSvg.style.display = '';
            this.renderSamplingTreeSvg();
          } else {
            this.samplingTree.style.display = '';
            this.samplingTreeSvg.style.display = 'none';
            this.renderSamplingTree();
          }
        }
      }));
    }
    // Bind recalc for design parameters
  const bindRecalc = (el) => el && el.addEventListener('input', () => { this.markInteracted(); this.updateCalculations(); });
    [this.numStrata, this.stratVarReduction, this.clusterICC, this.clusterCV, this.numClusters,
      this.clusterMixSmall, this.clusterMixMed, this.clusterMixLarge,
      this.sc_clusterICC, this.sc_clusterCV, this.sc_stratVarReduction, this.sc_numClusters,
      this.sc_clusterMixSmall, this.sc_clusterMixMed, this.sc_clusterMixLarge].forEach(bindRecalc);
    // Rebuild custom allocation rows when S changes
    if (this.numStrata) {
      this.numStrata.addEventListener('input', () => {
        const S = Math.max(2, Math.min(10, parseInt(this.numStrata.value) || 4));
        this.buildCustomAllocRows(S, false);
        this.buildCustomAllocRows(S, true);
        this.updateCalculations();
      });
    }
    // Allocation mode segmented toggles
    const bindAllocMode = (container) => {
      if (!container) return;
      const buttons = container.querySelectorAll('.segment');
      buttons.forEach(btn => btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.markInteracted();
        this.updateCalculations();
      }));
    };
    bindAllocMode(this.strataAllocMode);
    bindAllocMode(this.sc_strataAllocMode);

    // Bind custom allocation toggles
    const bindCustomToggle = (toggle, editor) => {
      if (!toggle || !editor) return;
      toggle.addEventListener('change', () => {
        if (toggle.checked) editor.removeAttribute('hidden'); else editor.setAttribute('hidden', '');
        this.updateCalculations();
      });
    };
    bindCustomToggle(this.stratCustomAllocToggle, this.stratCustomAllocEditor);
    bindCustomToggle(this.sc_stratCustomAllocToggle, this.sc_stratCustomAllocEditor);

    // Toggle cluster variability input mode
    const bindModeToggle = (container, cvRow, mixRow) => {
      if (!container) return;
      const buttons = container.querySelectorAll('.segment');
      buttons.forEach(btn => btn.addEventListener('click', () => {
        this.markInteracted();
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.mode;
        if (mode === 'cv') {
          cvRow && cvRow.removeAttribute('hidden');
          mixRow && mixRow.setAttribute('hidden', '');
        } else {
          cvRow && cvRow.setAttribute('hidden', '');
          mixRow && mixRow.removeAttribute('hidden');
        }
        this.updateCalculations();
        this.updateSamplingVisualization();
      }));
    };
    // Visualization resample button
    if (this.vizResample) this.vizResample.addEventListener('click', () => {
      // Manual resampling: mark interaction and rerun all calculations + redraws
      this.markInteracted();
      this.updateCalculations();
    });
    if (this.dismissVizPlaceholder && this.vizPlaceholder) {
      this.dismissVizPlaceholder.addEventListener('click', () => {
        this.vizState.hasInteracted = true;
        this.vizPlaceholder.style.display = 'none';
      });
    }
    bindModeToggle(this.clusterVarMode, this.clusterCVRow, this.clusterMixRow);
    bindModeToggle(this.sc_clusterVarMode, this.sc_clusterCVRow, this.sc_clusterMixRow);

    // Collapsible design parameters header toggle
    if (this.toggleDesignParamsBtn && this.designParamsPanel) {
      this.toggleDesignParamsBtn.addEventListener('click', () => {
        const collapsed = this.designParamsPanel.getAttribute('data-collapsed') === 'true';
        if (collapsed) {
          this.designParamsPanel.setAttribute('data-collapsed', 'false');
          this.toggleDesignParamsBtn.setAttribute('aria-expanded', 'true');
          const t = this.toggleDesignParamsBtn.querySelector('.toggle-text');
          if (t) t.textContent = 'Hide';
        } else {
          this.designParamsPanel.setAttribute('data-collapsed', 'true');
          this.toggleDesignParamsBtn.setAttribute('aria-expanded', 'false');
          const t = this.toggleDesignParamsBtn.querySelector('.toggle-text');
          if (t) t.textContent = 'Show';
        }
      });
    }

    // Advanced section toggles
    const bindAdvancedToggle = (btn, content) => {
      if (!btn || !content) return;
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (expanded) content.setAttribute('hidden', ''); else content.removeAttribute('hidden');
      });
    };
    bindAdvancedToggle(this.clusterAdvancedToggle, this.clusterAdvanced);
    bindAdvancedToggle(this.scAdvancedToggle, this.scAdvanced);
  bindAdvancedToggle(this.stratAdvancedToggle, this.stratAdvanced);
    // Combined Advanced panel toggle
    if (this.designAdvToggle && this.designAdvPanel) {
      this.designAdvToggle.addEventListener('click', () => {
        const isHidden = this.designAdvPanel.hasAttribute('hidden');
        if (isHidden) {
          this.designAdvPanel.removeAttribute('hidden');
          this.designAdvToggle.setAttribute('aria-expanded', 'true');
        } else {
          this.designAdvPanel.setAttribute('hidden', '');
          this.designAdvToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
    
    // Section-level Hide/Show toggles for stratified, cluster, stratified+cluster params
    document.querySelectorAll('.params-toggle-compact').forEach(btn => {
      btn.addEventListener('click', () => {
        const sectionType = btn.dataset.toggle;
        const section = document.querySelector(`.design-section[data-design="${sectionType}"]`);
        if (!section) return;
        
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          // Collapse
          btn.setAttribute('aria-expanded', 'false');
          section.setAttribute('data-collapsed', 'true');
          const t = btn.querySelector('.toggle-text');
          if (t) t.textContent = 'Show';
        } else {
          // Expand
          btn.setAttribute('aria-expanded', 'true');
          section.setAttribute('data-collapsed', 'false');
          const t = btn.querySelector('.toggle-text');
          if (t) t.textContent = 'Hide';
        }
      });
    });

    // Population (FPC) bindings
      if (this.togglePopulation && this.populationOptionsPanel) {
        this.togglePopulation.addEventListener('click', () => {
          const expanded = this.togglePopulation.getAttribute('aria-expanded') === 'true';
          this.togglePopulation.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          if (expanded) {
            this.populationOptionsPanel.setAttribute('hidden', '');
            this.currentValues.populationEnabled = false;
          } else {
            this.populationOptionsPanel.removeAttribute('hidden');
            this.currentValues.populationEnabled = true;
          }
          this.updateCalculations();
        });
      }
    if (this.populationPresetSelect) {
      this.populationPresetSelect.addEventListener('change', () => {
        const val = this.populationPresetSelect.value || '';
        const parts = val.split('|');
        if (parts.length === 2) {
          const n = parseInt(parts[1], 10);
          if (Number.isFinite(n) && this.populationSizeInput) {
            this.populationSizeInput.value = String(n);
            this.currentValues.populationSize = n;
            this.currentValues.populationEnabled = true;
          }
        }
        if (!this.populationSizeInput?.value) this.currentValues.populationEnabled = false;
        this.updateCalculations();
      });
    }
    if (this.populationSizeInput) {
      this.populationSizeInput.addEventListener('input', () => {
        const n = parseInt(this.populationSizeInput.value, 10);
        const valid = Number.isFinite(n) && n > 0;
        this.currentValues.populationSize = valid ? n : null;
        this.currentValues.populationEnabled = valid;
        this.updateCalculations();
      });
    }
    // Handle responsive resizing for sampling visualization
    window.addEventListener('resize', () => {
      this.resizeSamplingCanvas();
      this.updateSamplingVisualization();
    });

    // Effect size segmented buttons
    if (this.effectSizeButtons && this.effectSizeButtons.length) {
      this.effectSizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = parseFloat(btn.dataset.value);
          if (Number.isFinite(val)) {
            this.effectSizeSlider.value = val;
            this.currentValues.effectSize = val;
            this.sliderValue.textContent = val.toFixed(2);
            this.updateRangeFill(this.effectSizeSlider);
            // Update active visual
            this.effectSizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.updateCalculations();
          }
        });
      });
    }

    // Significance level segmented buttons
    if (this.significanceButtons && this.significanceButtons.length) {
      this.significanceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = parseFloat(btn.dataset.value);
          if (Number.isFinite(val)) {
            this.currentValues.significanceLevel = val;
            // Update active visual
            this.significanceButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.updateCalculations();
          }
        });
      });
    }

    // Test direction segmented buttons
    if (this.testDirectionButtons && this.testDirectionButtons.length) {
      this.testDirectionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.dataset.value;
          if (val) {
            this.currentValues.testDirection = val;
            this.testDirectionButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.updateCalculations();
          }
        });
      });
    }

    // Code language segmented buttons
    if (this.codeLangButtons && this.codeLangButtons.length) {
      this.codeLangButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const lang = btn.dataset.lang;
          if (!lang) return;
          if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') {
            // Show a subtle note in description and exit
            if (this.codeLangDescription) this.codeLangDescription.textContent = 'Python support is coming soon. Copy the R (pwr) code below to reproduce the analysis.';
            return;
          }
          this.currentCodeLang = lang;
          this.codeLangButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          // Update toggle label text
          if (this.codeToggleLabel) {
            this.codeToggleLabel.lastChild.textContent = (lang === 'r' ? 'R Code' : 'Python');
          }
          // Update supporting description if desired
          if (this.codeLangDescription) {
            if (lang === 'r') {
              this.codeLangDescription.textContent = 'Copy this code to reproduce the analysis in R (pwr). Python support is coming soon.';
            } else {
              this.codeLangDescription.textContent = 'Python support is coming soon. In the meantime, use the R code tab.';
            }
          }
          this.updateCodeBlock();
        });
      });
    }

    // Code action buttons (copy, download)
    const copyCodeBtn = document.getElementById('copyCode');
    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', () => this.copyCode());
    }

    const downloadCodeBtn = document.getElementById('downloadCode');
    if (downloadCodeBtn) {
      downloadCodeBtn.addEventListener('click', () => this.downloadCode());
    }

    // New unified Download dropdown (PNG/PDF)
    const downloadDropdownBtn = document.getElementById('downloadDropdownBtn');
    const downloadDropdownMenu = document.getElementById('downloadDropdownMenu');
    if (downloadDropdownBtn && downloadDropdownMenu) {
      const closeMenu = () => {
        downloadDropdownMenu.setAttribute('hidden', '');
        downloadDropdownBtn.setAttribute('aria-expanded', 'false');
      };
      const openMenu = () => {
        downloadDropdownMenu.removeAttribute('hidden');
        downloadDropdownBtn.setAttribute('aria-expanded', 'true');
      };
      downloadDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = downloadDropdownBtn.getAttribute('aria-expanded') === 'true';
        if (isOpen) closeMenu(); else openMenu();
      });
      // Select format
      downloadDropdownMenu.addEventListener('click', (e) => {
        const item = e.target.closest('.dropdown-item');
        if (!item) return;
        const fmt = item.dataset.format || 'png';
        closeMenu();
        if (fmt === 'pdf') this.downloadTableAsPDF(); else this.downloadTableAsPNG();
      });
      // Click outside closes menu
      document.addEventListener('click', (e) => {
        if (!downloadDropdownMenu.hasAttribute('hidden') && !downloadDropdownBtn.contains(e.target) && !downloadDropdownMenu.contains(e.target)) {
          closeMenu();
        }
      });
      // Esc to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
      });
    }

    // Output toggle
    if (this.outputToggleLabel) {
      const outputContainer = this.outputToggleLabel.closest('.code-container');
      const outputPre = outputContainer ? outputContainer.nextElementSibling : null;
      this.outputToggleLabel.addEventListener('click', () => {
        if (!outputPre) return;
        const isHidden = outputPre.hasAttribute('hidden');
        if (isHidden) {
          outputPre.removeAttribute('hidden');
          this.outputToggleLabel.setAttribute('aria-expanded', 'true');
        } else {
          outputPre.setAttribute('hidden', '');
          this.outputToggleLabel.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Copy output button
    const copyOutputBtn = document.getElementById('copyOutput');
    if (copyOutputBtn) {
      copyOutputBtn.addEventListener('click', () => this.copyOutput());
    }

    // Layout tuning slider removed
  }

  setupCustomSelect(selectEl) {
    if (!selectEl) return;
    // Wrap select
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select';
    const parent = selectEl.parentElement;
    // Clone options
    const opts = Array.from(selectEl.options).map(o => ({ value: o.value, label: o.text }));
    // Create trigger
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';
    trigger.innerHTML = `<span class="label">${selectEl.options[selectEl.selectedIndex]?.text || ''}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    // Create list
    const list = document.createElement('div');
    list.className = 'custom-select-list';
    opts.forEach(o => {
      const item = document.createElement('div');
      item.className = 'custom-select-item' + (o.value === selectEl.value ? ' selected' : '');
      item.dataset.value = o.value;
      item.innerHTML = `<span>${o.label}</span>
        <svg class="check" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 5l-6 6L3 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      item.addEventListener('click', () => {
        // Update selection
        selectEl.value = o.value;
        // Update visual
        list.querySelectorAll('.custom-select-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        trigger.querySelector('.label').textContent = o.label;
        // Dispatch change for existing logic
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        wrapper.classList.remove('open');
      });
      list.appendChild(item);
    });

    // Insert in DOM
    parent.insertBefore(wrapper, selectEl);
    wrapper.appendChild(trigger);
    selectEl.classList.add('native-select');
    wrapper.appendChild(selectEl);
    wrapper.appendChild(list);

    // Toggle
    trigger.addEventListener('click', () => {
      wrapper.classList.toggle('open');
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) wrapper.classList.remove('open');
    });
  }

  resizeSamplingCanvas() {
    if (!this.samplingVisualization) return;
    const container = this.samplingVisualization.parentElement;
    if (!container) return;
    const styles = getComputedStyle(container);
    const paddingH = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    const cssWidth = container.clientWidth - paddingH;
    const cssHeight = 156; // match CSS height for visual consistency
    if (cssWidth > 0) {
      this.samplingVisualization.width = Math.floor(cssWidth);
      this.samplingVisualization.height = cssHeight;
    }
  }

  calculateSampleSize() {
    const { effectSize, statisticalPower, significanceLevel, testDirection, testType } = this.currentValues;
    
    const alpha = significanceLevel;
    const beta = 1 - statisticalPower;
    const twoTailed = (testDirection === 'two-tailed');
    
    // Use more accurate calculation based on test type
    let baseSampleSize;
    
    if (typeof jStat !== 'undefined' && jStat.normal) {
      // Use jStat for accurate inverse normal calculations
      const zAlpha = twoTailed ? jStat.normal.inv(1 - alpha / 2, 0, 1) : jStat.normal.inv(1 - alpha, 0, 1);
      const zBeta = jStat.normal.inv(1 - beta, 0, 1);
      
      if (testType === 'two-sample') {
        // Two independent samples: n per group = 2 * ((z_α + z_β) / d)²
        const nPerGroup = 2 * Math.pow((zAlpha + zBeta) / effectSize, 2);
        baseSampleSize = 2 * nPerGroup; // Total N
      } else {
        // One-sample or paired: n = ((z_α + z_β) / d)²
        baseSampleSize = Math.pow((zAlpha + zBeta) / effectSize, 2);
      }
    } else {
      // Fallback to approximation if jStat not available
      const zAlpha = twoTailed ? 1.96 : 1.645;
      const zBeta = 0.84; // for 80% power
      
      if (testType === 'two-sample') {
        baseSampleSize = 2 * (2 * Math.pow((zAlpha + zBeta) / effectSize, 2));
      } else {
        baseSampleSize = Math.pow((zAlpha + zBeta) / effectSize, 2);
      }
    }

    const designEffect = this.getDesignEffect();
    const n0 = Math.ceil(baseSampleSize);
    
    // Apply finite population correction if enabled and N provided
    let nFinal = n0;
    if (this.currentValues.populationEnabled) {
      const N = parseInt(this.populationSizeInput?.value || this.currentValues.populationSize, 10);
      if (Number.isFinite(N) && N > 0) {
        // n_adj = N * n0 / (N + n0 - 1)
        const nAdj = Math.ceil((N * n0) / (N + n0 - 1));
        nFinal = Math.min(n0, Math.max(1, Math.min(nAdj, N)));
      }
    }

    return {
      sampleSize: nFinal,
      // For a-priori power analysis, the target power IS the achieved power
      // (the sample size is calculated TO achieve this power level)
      achievedPower: statisticalPower,
      designEffect: designEffect
    };
  }

  getZScore(p) {
    // Approximation of inverse normal CDF
    if (p === 0.05) return 1.96;
    if (p === 0.01) return 2.58;
    if (p === 0.001) return 3.29;
    if (p === 0.2) return 0.84;
    if (p === 0.1) return 1.28;
    return 1.96; // Default
  }

  getDesignEffect() {
    const { samplingDesign } = this.currentValues;
    const readNum = (el, fallback) => {
      if (!el) return fallback;
      const v = parseFloat(el.value);
      return Number.isFinite(v) ? v : fallback;
    };

    if (samplingDesign === 'no-stratification') return 1.0;

    if (samplingDesign === 'stratified') {
      const reductionPct = Math.min(90, Math.max(0, readNum(this.stratVarReduction, 0)));
      const r = reductionPct / 100;
      return Math.max(0.1, 1 - r);
    }

    const deffCluster = (m, icc) => {
      const mEff = Math.max(2, Math.round(m));
      const rho = Math.max(0, Math.min(1, icc));
      return 1 + ((mEff - 1) * rho);
    };

    if (samplingDesign === 'cluster') {
      // Estimate m from number of clusters if provided (fallback to 25)
      let m = 25;
      const nClus = parseInt(this.numClusters?.value);
      if (Number.isFinite(nClus) && nClus > 0) {
        const estimatedPop = 400; // fallback estimate (visualization computes exact)
        m = Math.max(2, Math.round(estimatedPop / nClus));
      }
      const icc = readNum(this.clusterICC, 0.05);
      return deffCluster(m, icc);
    }

    if (samplingDesign === 'stratified-cluster') {
      let m = 25;
      const nClus = parseInt(this.sc_numClusters?.value);
      if (Number.isFinite(nClus) && nClus > 0) {
        const estimatedPop = 400; // fallback estimate when not rendering
        m = Math.max(2, Math.round(estimatedPop / nClus));
      }
      const icc = readNum(this.sc_clusterICC, 0.05);
      const reductionPct = Math.min(90, Math.max(0, readNum(this.sc_stratVarReduction, 0)));
      const r = reductionPct / 100;
      return deffCluster(m, icc) * Math.max(0.1, 1 - r);
    }

    return 1.0;
  }

  calculateAchievedPower(sampleSize) {
    // Simplified power calculation (no DEFF adjustment)
    const { effectSize } = this.currentValues;
    const effectiveSampleSize = sampleSize;
    
    const power = Math.min(0.99, Math.max(0.05, 
      0.5 + (effectSize * Math.sqrt(effectiveSampleSize / 2) - 1.96) / 4
    ));
    return power;
  }

  updateCalculations() {
    const results = this.calculateSampleSize();
    
    // Update result displays
    this.resultValues.sampleSize.textContent = results.sampleSize;
    this.resultValues.achievedPower.textContent = Math.round(results.achievedPower * 100) + '%';
    // Show current Effect Size in results card (swap from Design Effect)
    this.resultValues.effectSize.textContent = this.currentValues.effectSize.toFixed(2);
    
    // Update charts
    this.updatePowerChart();
    this.updateSamplingVisualization();
    
    // Update design info
    this.updateDesignInfo(results);
  // Update visible code block content
  this.updateCodeBlock();
    // Update combined advanced summary
    this.updateDesignAdvancedSummary && this.updateDesignAdvancedSummary();
    
    // Notify iframe visualizer of sampling changes
    this.notifyVisualizerIframe();
  }

  updateCodeBlock() {
    if (this.codeBlock) {
      const lang = this.currentCodeLang;
      const useLang = (lang === 'py') ? 'r' : 'r';
      const code = useLang === 'r' ? this.generateRCode() : this.generatePythonCode();
      this.codeBlock.textContent = code;
      this.codeBlock.className = `language-${useLang}`;
    }
    if (this.codeToggleLabel) this.codeToggleLabel.lastChild.textContent = (this.currentCodeLang === 'r') ? 'R Code' : 'Python';
    // Update output block
    if (this.outputBlock && this.currentCodeLang === 'r') {
      const output = this.generateROutput();
      this.outputBlock.textContent = output;
      this.outputBlock.className = 'language-r';
    }
  }
  
  notifyVisualizerIframe() {
    // Call inline visualizer update function
    if (typeof window.updateInlineVisualizer === 'function') {
      window.updateInlineVisualizer(
        this.currentValues.samplingDesign,
        this.currentValues.extractionMethod
      );
    }
  }

  updateDesignInfo(results) {
    const designInfo = document.querySelector('.design-info p');
    const warning = document.querySelector('.warning');
    
    designInfo.innerHTML = `<strong>Current Design:</strong> With N = ${results.sampleSize}, you have ${(results.achievedPower * 100).toFixed(0)}% power to detect an effect size of ${this.currentValues.effectSize.toFixed(2)} at α = ${this.currentValues.significanceLevel}.`;
    // Annotate when finite population correction is applied
    if (this.currentValues.populationEnabled) {
      const N = parseInt(this.populationSizeInput?.value || this.currentValues.populationSize, 10);
      if (Number.isFinite(N) && N > 0) {
        const hint = `<span class="summary-hint" title="Finite population correction applied using N=${N}">FPC (N=${N})</span>`;
        designInfo.innerHTML += ` ${hint}`;
      }
    }
    
    if (results.achievedPower < 0.8) {
      warning.style.display = 'flex';
    } else {
      warning.style.display = 'none';
    }
  }

  initializeCharts() {
    // Initialize slider fill
    this.updateRangeFill(this.effectSizeSlider);
    this.updateRangeFill(this.statisticalPowerSlider);
    // Ensure slider badge is correctly formatted and segmented reflects value
    if (this.sliderValue && this.effectSizeSlider) {
      this.sliderValue.textContent = Number(this.effectSizeSlider.value).toFixed(2);
      this.syncEffectSizeToggle();
    }
    // Initialize null hypothesis pill
    this.updateNullHypothesisPill();
    // Initialize effect size calc section visibility
    this.updateEffectCalcSectionVisibility();
    this.updatePowerChart();
    this.updateSamplingVisualization();
    this.updateDesignParamsVisibility();

    // Initialize custom allocation rows with current S
    const S = Math.max(2, Math.min(10, parseInt(this.numStrata?.value) || 4));
    this.buildCustomAllocRows(S, false);
    this.buildCustomAllocRows(S, true);

    // Initialize Population (FPC) panel visibility
    if (this.togglePopulation && this.populationOptionsPanel) {
      this.togglePopulation.setAttribute('aria-expanded', this.currentValues.populationEnabled ? 'true' : 'false');
      if (this.currentValues.populationEnabled) this.populationOptionsPanel.removeAttribute('hidden');
      else this.populationOptionsPanel.setAttribute('hidden', '');
    }
  }

  buildCustomAllocRows(S, isSC) {
    const container = isSC ? this.sc_stratAllocRows : this.stratAllocRows;
    if (!container) return;
    container.innerHTML = '';
    // Equal default percentages
    const def = Math.round((100 / S) * 10) / 10;
    for (let i = 0; i < S; i++) {
      const row = document.createElement('div');
      row.className = 'alloc-row';
      const label = document.createElement('label');
      label.className = 'small';
      label.style.minWidth = '88px';
      label.textContent = `Stratum ${i + 1}`;
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = '100';
      input.step = '1';
      input.className = 'text-input';
      input.value = String(def);
      input.dataset.index = String(i);
      input.addEventListener('input', () => { this.markInteracted(); this.updateCalculations(); });
      const suffix = document.createElement('span');
      suffix.textContent = '%';
      suffix.className = 'small';
      suffix.style.marginLeft = '6px';
      row.appendChild(label);
      row.appendChild(input);
      row.appendChild(suffix);
      container.appendChild(row);
    }
  }

  updateDesignParamsVisibility() {
    if (!this.designParamsPanel || !this.designSections) return;
    const design = this.currentValues.samplingDesign;
    const panelShouldShow = design !== 'no-stratification';
    if (panelShouldShow) {
      this.designParamsPanel.removeAttribute('hidden');
      // Default to collapsed (Hide) when switching designs
      this.designParamsPanel.setAttribute('data-collapsed', 'true');
      if (this.toggleDesignParamsBtn) {
        this.toggleDesignParamsBtn.setAttribute('aria-expanded', 'false');
        const t = this.toggleDesignParamsBtn.querySelector('.toggle-text');
        if (t) t.textContent = 'Show';
      }
    } else {
      this.designParamsPanel.setAttribute('hidden', '');
    }
    this.designSections.forEach(sec => {
      const match = sec.dataset.design === design;
      if (match) sec.removeAttribute('hidden'); else sec.setAttribute('hidden', '');
    });
    // Update panel title based on design
    const titleEl = document.getElementById('designParamsTitle');
    if (titleEl) {
      const titles = {
        'stratified': 'Stratified parameters',
        'cluster': 'Cluster parameters',
        'stratified-cluster': 'Stratified + Cluster parameters'
      };
      titleEl.textContent = titles[design] || 'Design parameters';
    }
    // If user is exploring design params, consider it interaction
    if (panelShouldShow) this.markInteracted();
    this.updateParamsSummary();
    this.updateDesignAdvancedVisibility && this.updateDesignAdvancedVisibility();
  }

  // Move existing advanced controls into the new combined panel and hide old toggles
  setupCombinedAdvancedPanel() {
    // Only proceed if containers exist
    if (!this.advancedGlobalContainer || !this.advancedDesignContainer) return;

    // Move FPC inner content into global container and hide original group
    if (this.populationOptionsPanel) {
      const fpcWrapper = document.createElement('div');
      fpcWrapper.id = 'fpcMovedSection';
      const lbl = document.createElement('label');
      lbl.className = 'small';
      lbl.style.display = 'block';
      lbl.style.marginBottom = '6px';
      lbl.textContent = 'Finite Population Correction (FPC)';
      fpcWrapper.appendChild(lbl);
      while (this.populationOptionsPanel.firstChild) {
        fpcWrapper.appendChild(this.populationOptionsPanel.firstChild);
      }
      this.advancedGlobalContainer.appendChild(fpcWrapper);
      const fpcGroup = this.togglePopulation ? this.togglePopulation.closest('.form-group') : null;
      if (fpcGroup) fpcGroup.style.display = 'none';
    }

    // Move design-specific advanced sections
    const move = (el, design) => {
      if (!el) return;
      el.setAttribute('data-design', design);
      el.setAttribute('hidden', '');
      this.advancedDesignContainer.appendChild(el);
    };
    move(this.stratAdvanced, 'stratified');
    move(this.clusterAdvanced, 'cluster');
    move(this.scAdvanced, 'stratified-cluster');

    // Hide original toggles
    if (this.stratAdvancedToggle) this.stratAdvancedToggle.style.display = 'none';
    if (this.clusterAdvancedToggle) this.clusterAdvancedToggle.style.display = 'none';
    if (this.scAdvancedToggle) this.scAdvancedToggle.style.display = 'none';

    // Initial state
    this.updateDesignAdvancedVisibility();
    this.updateDesignAdvancedSummary();
  }

  updateDesignAdvancedVisibility() {
    if (!this.advancedDesignContainer) return;
    const active = this.currentValues.samplingDesign;
    const nodes = this.advancedDesignContainer.querySelectorAll('[data-design]');
    nodes.forEach(n => {
      const show = n.getAttribute('data-design') === active;
      if (show) n.removeAttribute('hidden'); else n.setAttribute('hidden', '');
    });
  }

  updateDesignAdvancedSummary() {
    if (!this.designAdvSummary) return;
    const parts = [];
    // FPC
    if (this.currentValues.populationEnabled) {
      const N = parseInt(this.populationSizeInput?.value || this.currentValues.populationSize, 10);
      parts.push(`FPC: ${Number.isFinite(N) && N > 0 ? 'N=' + N.toLocaleString() : 'On'}`);
    } else {
      parts.push('FPC: Off');
    }
    const fmt = (v, d=2) => (Number.isFinite(v) ? Number(v).toFixed(d) : '—');
    const design = this.currentValues.samplingDesign;
    if (design === 'stratified') {
      const red = parseFloat(this.stratVarReduction?.value);
      let alloc = '';
      if (this.stratCustomAllocToggle && this.stratCustomAllocToggle.checked) alloc = 'Custom';
      else if (this.strataAllocMode) {
        const act = this.strataAllocMode.querySelector('.segment.active');
        alloc = act && act.dataset.mode === 'equal' ? 'Equal' : 'Prop';
      }
      const bits = [];
      if (Number.isFinite(red)) bits.push(`Var red: ${Math.max(0, Math.min(90, red))}%`);
      if (alloc) bits.push(`Alloc: ${alloc}`);
      if (bits.length) parts.push(`Stratified: ${bits.join(', ')}`);
    } else if (design === 'cluster') {
      const icc = parseFloat(this.clusterICC?.value);
      let cvTxt = '';
      const act = this.clusterVarMode ? this.clusterVarMode.querySelector('.segment.active') : null;
      const mode = act ? act.dataset.mode : 'cv';
      if (mode === 'cv') {
        const cv = parseFloat(this.clusterCV?.value);
        if (Number.isFinite(cv)) cvTxt = `, CV=${fmt(cv,2)}`;
      } else {
        const s = parseFloat(this.clusterMixSmall?.value);
        const m = parseFloat(this.clusterMixMed?.value);
        const l = parseFloat(this.clusterMixLarge?.value);
        if ([s, m, l].some(v => Number.isFinite(v))) cvTxt = `, Mix ${fmt(s,0)}/${fmt(m,0)}/${fmt(l,0)}`;
      }
      if (Number.isFinite(icc)) parts.push(`Cluster: ICC=${fmt(icc,3)}${cvTxt}`);
    } else if (design === 'stratified-cluster') {
      const icc = parseFloat(this.sc_clusterICC?.value);
      const red = parseFloat(this.sc_stratVarReduction?.value);
      const bits = [];
      if (Number.isFinite(icc)) bits.push(`ICC=${fmt(icc,3)}`);
      if (Number.isFinite(red)) bits.push(`Strat red: ${Math.max(0, Math.min(90, red))}%`);
      if (bits.length) parts.push(`Strat+Cluster: ${bits.join(', ')}`);
    }
    this.designAdvSummary.textContent = parts.join(' • ');
  }

  updateRangeFill(range) {
    if (!range) return;
    const min = parseFloat(range.min || 0);
    const max = parseFloat(range.max || 100);
    const val = parseFloat(range.value || 0);
    const pct = ((val - min) / (max - min)) * 100;
    range.style.setProperty('--fill', pct + '%');
  }

  updateNullHypothesisPill() {
    if (!this.nullHypothesisPill) return;
    const type = this.testTypeSelect ? this.testTypeSelect.value : this.currentValues.testType;
    let html = '';
    if (type === 'single-sample') {
      html = 'H<sub>0</sub>: &mu; = &mu;<sub>0</sub>';
    } else if (type === 'paired') {
      html = 'H<sub>0</sub>: &mu;<sub>D</sub> = 0';
    } else {
      html = 'H<sub>0</sub>: &mu;<sub>1</sub> = &mu;<sub>2</sub>';
    }
    this.nullHypothesisPill.innerHTML = html;
  }

  updateEffectCalcSectionVisibility() {
    if (!this.calcSections) return;
    const type = this.testTypeSelect ? this.testTypeSelect.value : this.currentValues.testType;
    this.calcSections.forEach(sec => {
      const matches = sec.dataset.type === type;
      if (matches) {
        sec.removeAttribute('hidden');
      } else {
        sec.setAttribute('hidden', '');
      }
    });
  }

  computeEffectSizeFromStats() {
    if (this.effectCalcError) this.effectCalcError.textContent = '';
    this.markInteracted();
    const type = this.testTypeSelect ? this.testTypeSelect.value : this.currentValues.testType;
    let d = NaN;
    try {
      if (type === 'single-sample') {
        const mean = parseFloat(this.ss_mean.value);
        const mu0 = parseFloat(this.ss_null_mean.value);
        const sd = parseFloat(this.ss_sd.value);
        if (!isFinite(mean) || !isFinite(mu0) || !isFinite(sd) || sd <= 0) throw new Error('Enter mean, null mean, and SD > 0');
        d = (mean - mu0) / sd;
      } else if (type === 'paired') {
        const md = parseFloat(this.pd_mean_diff.value);
        const sd = parseFloat(this.pd_sd_diff.value);
        if (!isFinite(md) || !isFinite(sd) || sd <= 0) throw new Error('Enter mean difference and SD of differences > 0');
        d = md / sd;
      } else { // two-sample
        const m1 = parseFloat(this.ts_mean1.value);
        const m2 = parseFloat(this.ts_mean2.value);
        const sd1 = parseFloat(this.ts_sd1.value);
        const sd2 = parseFloat(this.ts_sd2.value);
        const n1 = parseFloat(this.ts_n1.value);
        const n2 = parseFloat(this.ts_n2.value);
        if (!isFinite(m1) || !isFinite(m2) || !isFinite(sd1) || !isFinite(sd2) || sd1 <= 0 || sd2 <= 0) throw new Error('Enter means and SDs > 0 for both groups');
        let sp;
        if (isFinite(n1) && isFinite(n2) && n1 >= 2 && n2 >= 2) {
          sp = Math.sqrt((((n1 - 1) * sd1 * sd1) + ((n2 - 1) * sd2 * sd2)) / (n1 + n2 - 2));
        } else {
          sp = Math.sqrt((sd1 * sd1 + sd2 * sd2) / 2);
        }
        if (!(sp > 0)) throw new Error('Pooled SD must be > 0');
        d = (m1 - m2) / sp;
      }
    } catch (err) {
      if (this.effectCalcError) this.effectCalcError.textContent = err.message || 'Please check your inputs.';
      return;
    }

    const dAbs = Math.abs(d);
    // Clamp to slider range
    const min = parseFloat(this.effectSizeSlider.min);
    const max = parseFloat(this.effectSizeSlider.max);
    const clamped = Math.min(max, Math.max(min, dAbs));
    this.effectSizeSlider.value = clamped.toFixed(2);
    this.currentValues.effectSize = clamped;
    if (this.sliderValue) this.sliderValue.textContent = clamped.toFixed(2);
    this.updateRangeFill(this.effectSizeSlider);
    this.syncEffectSizeToggle();
    this.updateCalculations();
  }

  // Highlight preset if slider equals one of the discrete effect size values
  syncEffectSizeToggle() {
    if (!this.effectSizeButtons || !this.effectSizeButtons.length) return;
    const val = parseFloat(this.effectSizeSlider.value);
    // Consider it a match if within ±0.05 of a preset
    const tolerance = 0.05;
    let matched = false;
    this.effectSizeButtons.forEach(btn => {
      const preset = parseFloat(btn.dataset.value);
      const isActive = Math.abs(val - preset) <= tolerance;
      btn.classList.toggle('active', isActive);
      if (isActive) matched = true;
    });
    // If no match, clear all active states
    if (!matched) {
      this.effectSizeButtons.forEach(btn => btn.classList.remove('active'));
    }
  }

  // Reset all inputs back to defaults and refresh outputs
  resetAll() {
    // Defaults
    const defaults = {
      effectSize: 0.5,
      statisticalPower: 0.8,
      testType: 'single-sample',
      significanceLevel: 0.05,
      testDirection: 'two-tailed',
      samplingDesign: 'no-stratification',
      extractionMethod: 'simple-random',
      populationEnabled: false,
      populationSize: null,
      chartTheme: 'default'
    };

    // Sliders
    if (this.effectSizeSlider) {
      this.effectSizeSlider.value = String(defaults.effectSize);
      this.currentValues.effectSize = defaults.effectSize;
      if (this.sliderValue) this.sliderValue.textContent = defaults.effectSize.toFixed(2);
      this.updateRangeFill(this.effectSizeSlider);
      this.syncEffectSizeToggle();
    }
    if (this.statisticalPowerSlider) {
      this.statisticalPowerSlider.value = String(defaults.statisticalPower);
      this.currentValues.statisticalPower = defaults.statisticalPower;
      if (this.powerValue) this.powerValue.textContent = Math.round(defaults.statisticalPower * 100) + '%';
      this.updateRangeFill(this.statisticalPowerSlider);
    }

    // Selects and segmented toggles
    if (this.testTypeSelect) {
      this.testTypeSelect.value = defaults.testType;
      this.testTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Significance segmented
    if (this.significanceButtons && this.significanceButtons.length) {
      this.currentValues.significanceLevel = defaults.significanceLevel;
      this.significanceButtons.forEach(btn => {
        const match = parseFloat(btn.dataset.value) === defaults.significanceLevel;
        btn.classList.toggle('active', match);
      });
    }

    // Test direction segmented
    if (this.testDirectionButtons && this.testDirectionButtons.length) {
      this.currentValues.testDirection = defaults.testDirection;
      this.testDirectionButtons.forEach(btn => {
        const match = (btn.dataset.value === defaults.testDirection);
        btn.classList.toggle('active', match);
      });
    }

    // Sampling design/extraction cards
    const samplingCards = document.querySelectorAll('.sampling-option');
    samplingCards.forEach(card => card.classList.toggle('active', card.dataset.design === defaults.samplingDesign));
    this.currentValues.samplingDesign = defaults.samplingDesign;

    const extractionCards = document.querySelectorAll('.extraction-option');
    extractionCards.forEach(card => card.classList.toggle('active', card.dataset.method === defaults.extractionMethod));
    this.currentValues.extractionMethod = defaults.extractionMethod;

    // Design params panel visibility and defaults (basic)
    this.updateDesignParamsVisibility();

    // Population (FPC)
    this.currentValues.populationEnabled = defaults.populationEnabled;
    if (this.togglePopulation && this.populationOptionsPanel) {
      this.togglePopulation.setAttribute('aria-expanded', 'false');
      this.populationOptionsPanel.setAttribute('hidden', '');
    }
    if (this.populationSizeInput) this.populationSizeInput.value = '';

    // Theme
    if (this.chartThemeSelect) {
      this.chartThemeSelect.value = defaults.chartTheme;
    }

    // Recompute and redraw
    this.updateCalculations();
  }

  // Mark that the user has interacted and hide the placeholder if visible
  markInteracted() {
    if (this.vizState && !this.vizState.hasInteracted) {
      this.vizState.hasInteracted = true;
      if (this.vizPlaceholder) this.vizPlaceholder.style.display = 'none';
    }
  }

  updatePowerChart() {
    // Guard: ensure chart element and Plotly library exist
    if (!this.powerChart || typeof Plotly === 'undefined') return;
    
    const req = this.calculateSampleSize();
    const target = Math.max(0, Math.min(0.9999, this.currentValues.statisticalPower || 0.8));
  // Determine minimum valid N used for power math (but curve will start at 0 for visualization)
  const minValidN = (this.currentValues.testType === 'two-sample') ? 4 : 2;

    // Find N at 80% power
    let Nat80 = minValidN;
    for (let n = minValidN; n <= 10000; n++) {
      const p = this.calculatePowerForSampleSize(n);
      if (p >= 0.80) { Nat80 = n; break; }
    }

    // Find N near 100% power (or as close as we can get)
    let Nat100 = Nat80;
    for (let n = Nat80; n <= 10000; n++) {
      const p = this.calculatePowerForSampleSize(n);
      Nat100 = n;
      if (p >= 0.999) break;
    }

    // Calculate max ensuring curve extends well beyond where power plateaus
    // Use generous multipliers so the curve visually reaches asymptote smoothly
    // For one-tailed tests, power plateaus faster so extend more generously
    const isOneTailed = this.currentValues.testDirection === 'one-tailed';
    const mult80 = isOneTailed ? 2.5 : 2.0;
    const mult100 = isOneTailed ? 2.0 : 1.5;
    let Nmax = Math.max(Math.ceil(Nat80 * mult80), Math.ceil(Nat100 * mult100), Math.round(req.sampleSize || minValidN));

    // Round to nice numbers for cleaner axis
    const roundToNice = (n) => {
      const magnitude = Math.pow(10, Math.floor(Math.log10(Math.max(1, n))));
      const normalized = n / magnitude;
      let nice;
      if (normalized < 1.5) nice = 1;
      else if (normalized < 3) nice = 2;
      else if (normalized < 7) nice = 5;
      else nice = 10;
      return nice * magnitude;
    };

    Nmax = roundToNice(Nmax);
    // For the curve, we start plotting at 0 so the line begins at the origin visually
    const Nmin = 0;

    // Generate smooth power curve using adaptive sampling (more points near origin, fewer at plateau)
    const sampleSizes = [];
    const powers = [];
    const pAtMinValid = this.calculatePowerForSampleSize(minValidN);
    
    // Use 300 points with quadratic spacing for smoother curves
    const nPoints = 300;
    for (let i = 0; i <= nPoints; i++) {
      // Quadratic spacing gives more points near 0 where curve changes rapidly
      const t = i / nPoints;
      const N = Math.round(Nmin + (Nmax - Nmin) * t * t);
      
      // Skip duplicate N values from rounding
      if (sampleSizes.length > 0 && sampleSizes[sampleSizes.length - 1] === N) continue;
      
      sampleSizes.push(N);
      if (N === 0) {
        powers.push(0);
      } else if (N < minValidN) {
        // Smoothly interpolate up to the first valid N to avoid a step at the origin
        const frac = N / minValidN;
        powers.push(Math.max(0, Math.min(1, frac * pAtMinValid)));
      } else {
        powers.push(this.calculatePowerForSampleSize(N));
      }
    }

    // Find actual intersection point where power curve crosses target power line
    const currentN = Math.round(req.sampleSize || Nmin);
    const actualP = this.calculatePowerForSampleSize(currentN);
    
    // Find the exact N where the power curve intersects the target power
    let intersectionN = currentN;
    let intersectionPower = target;
    
    // Search through the curve to find where it crosses the target power
    for (let i = 1; i < sampleSizes.length; i++) {
      const prevPower = powers[i - 1];
      const currPower = powers[i];
      const prevN = sampleSizes[i - 1];
      const currN = sampleSizes[i];
      
      // Check if the target power is between these two points
      if ((prevPower <= target && currPower >= target) || 
          (prevPower >= target && currPower <= target)) {
        // Linear interpolation to find exact intersection N
        const t = (target - prevPower) / (currPower - prevPower);
        intersectionN = prevN + t * (currN - prevN);
        intersectionPower = target;
        break;
      }
    }

    // Get theme from controls
    const themeName = this.chartThemeSelect ? this.chartThemeSelect.value : 'default';
    const theme = this.chartThemes[themeName] || this.chartThemes.default;

    // Create traces
    const traces = [
      {
        x: sampleSizes,
        y: powers,
        type: 'scatter',
        mode: 'lines',
        name: 'Statistical Power',
        line: { color: theme.line, width: 2 },
        hovertemplate: '<b>N = %{x}</b><br>Power = %{y:.3f}<extra></extra>'
      },
      {
        x: [0, Nmax],
        y: [target, target],
        type: 'scatter',
        mode: 'lines',
        name: `Target (${target.toFixed(2)})`,
        line: { color: '#7c3aed', width: 2, dash: 'dash' },
        hovertemplate: `<b>Target Power: ${target.toFixed(2)}</b><extra></extra>`
      },
      {
        x: [intersectionN],
        y: [intersectionPower],
        type: 'scatter',
        mode: 'markers',
        name: 'Intersection',
        marker: { 
          size: 8, 
          color: '#dc2626',
          line: { color: '#ffffff', width: 1.5 }
        },
        showlegend: false,
        hovertemplate: `<b>N = ${Math.round(intersectionN)}</b><br>Power = ${intersectionPower.toFixed(3)}<extra></extra>`
      },
      {
        // Arrow line from intersection down to x-axis
        x: [intersectionN, intersectionN],
        y: [intersectionPower, 0],
        type: 'scatter',
        mode: 'lines',
        line: { color: '#dc2626', width: 1 },
        showlegend: false,
        hoverinfo: 'skip'
      },
      {
        // Arrow line from intersection left to y-axis
        x: [intersectionN, 0],
        y: [intersectionPower, intersectionPower],
        type: 'scatter',
        mode: 'lines',
        line: { color: '#dc2626', width: 1 },
        showlegend: false,
        hoverinfo: 'skip'
      }
    ];

    // Layout with theme colors and annotations for arrows
    const layout = {
      xaxis: {
        title: { text: 'Sample Size (n)', font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', size: 14, color: '#1e293b' } },
        gridcolor: theme.grid,
        linecolor: '#cbd5e1', linewidth: 2,
        showline: true,
        mirror: false,
        tickfont: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', size: 12, color: '#64748b' },
        zeroline: false,
        rangemode: 'tozero',
        range: [0, Nmax]
      },
      yaxis: {
        title: { text: 'Statistical Power (1 − β)', font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', size: 14, color: '#1e293b' } },
        range: [0, 1.02], 
        zeroline: false,
        gridcolor: theme.grid,
        linecolor: '#cbd5e1', linewidth: 2,
        showline: true,
        mirror: false,
        rangemode: 'tozero',
        tickfont: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', size: 12, color: '#64748b' },
        fixedrange: false
      },
      margin: { t: 60, r: 30, b: 60, l: 70 },
      hovermode: 'closest',
      showlegend: false,
      plot_bgcolor: theme.background,
      paper_bgcolor: theme.background,
      // Restore arrowheads using annotations with data-referenced tails/heads
      annotations: [
        {
          // Arrow from intersection down to x-axis (head at axis)
          x: intersectionN,
          y: 0,
          ax: intersectionN,
          ay: intersectionPower,
          xref: 'x', yref: 'y', axref: 'x', ayref: 'y',
          showarrow: true,
          arrowhead: 3,
          arrowsize: 1,
          arrowwidth: 1,
          arrowcolor: '#dc2626',
          standoff: 0
        },
        {
          // Arrow from intersection left to y-axis (head at axis)
          x: 0,
          y: intersectionPower,
          ax: intersectionN,
          ay: intersectionPower,
          xref: 'x', yref: 'y', axref: 'x', ayref: 'y',
          showarrow: true,
          arrowhead: 3,
          arrowsize: 1,
          arrowwidth: 1,
          arrowcolor: '#dc2626',
          standoff: 0
        }
      ],
      // Add a highlighted x-axis tick at the intersection N
      shapes: [
        {
          type: 'line',
          xref: 'x',
          yref: 'paper',
          x0: intersectionN,
          x1: intersectionN,
          y0: 0,
          y1: 0.03,
          line: { color: '#dc2626', width: 1 },
          layer: 'above'
        }
      ]
    };

    // Config
    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
      toImageButtonOptions: { format: 'png', filename: 'power_curve', height: 600, width: 1000, scale: 2 }
    };

    // Render
    Plotly.react(this.powerChart, traces, layout, config);

    // No autoscale overrides: let Plotly autorange naturally based on data

    // Update legend target label (for the static legend in HTML)
    const targetLabel = document.getElementById('powerTargetLabel');
    if (targetLabel) targetLabel.textContent = `Target (${target.toFixed(2)})`;
    
    // Update legend color indicator to match theme line color
    const legendColorElement = document.querySelector('.legend-color.statistical');
    if (legendColorElement) {
      legendColorElement.style.backgroundColor = theme.line;
    }

    // Update theme swatch next to the dropdown
    if (this.themeSwatch) {
      this.themeSwatch.style.backgroundColor = theme.line;
    }
  }

  calculatePowerForSampleSize(sampleSize) {
    const { effectSize: d, significanceLevel: alpha, testDirection, testType } = this.currentValues;
    const twoTailed = (testDirection !== 'one-tailed');
    const a = Math.max(1e-6, Math.min(0.5, alpha || 0.05));
    const N = Math.max(2, Math.round(sampleSize));

    // Fallback normal-approx if jStat not present
    const fallback = () => {
      const zcrit = twoTailed ? 1.96 : 1.645;
      const scale = (testType === 'two-sample') ? Math.sqrt(N / 4) : Math.sqrt(N);
      const z = d * scale;
      // crude mapping from z to power-like value for visualization only
      const approx = 0.5 + (z - zcrit) / 4;
      return Math.max(0.0001, Math.min(0.9999, approx));
    };

    try {
      if (typeof jStat === 'undefined' || !jStat.studentt || !jStat.noncentralt) return fallback();
      let df, ncp;
      const tcrit = (dfVal) => jStat.studentt.inv(1 - (twoTailed ? a / 2 : a), dfVal);
      if (testType === 'two-sample') {
        const nPerGroup = Math.max(2, N / 2);
        df = Math.max(2, Math.floor(N - 2));
        // two-sample equal-n: δ = d * sqrt(n/2) = d * sqrt(N/4)
        ncp = d * Math.sqrt(nPerGroup / 2);
      } else {
        // single-sample or paired reduces to one-sample t on differences
        df = Math.max(1, Math.floor(N - 1));
        ncp = d * Math.sqrt(N);
      }
      const tCritVal = tcrit(df);
      let power;
      if (twoTailed) {
        const cdfPos = jStat.noncentralt.cdf(tCritVal, df, ncp);
        const cdfNeg = jStat.noncentralt.cdf(-tCritVal, df, ncp);
        power = 1 - (cdfPos - cdfNeg);
      } else {
        power = 1 - jStat.noncentralt.cdf(tCritVal, df, ncp);
      }
      if (!isFinite(power)) return fallback();
      return Math.max(0.0001, Math.min(0.9999, power));
    } catch (e) {
      return fallback();
    }
  }

  updateSamplingVisualization() {
    // Populate APA table instead of drawing canvas
    const results = this.calculateSampleSize();
    
    // Test Type
    const testTypeMap = {
      'single-sample': 'One-sample t-test',
      'paired': 'Paired-samples t-test',
      'two-sample': 'Independent-samples t-test'
    };
    document.getElementById('tableTestType').textContent = testTypeMap[this.currentValues.testType] || '—';
    document.getElementById('tableTestTypeDesc').textContent = this.currentValues.testType === 'two-sample' 
      ? 'Comparing means between two independent groups'
      : this.currentValues.testType === 'paired'
      ? 'Comparing paired observations or matched samples'
      : 'Comparing sample mean to a known population value';
    
    // Effect Size
    document.getElementById('tableEffectSize').textContent = this.currentValues.effectSize.toFixed(2);
    const effectLabel = this.currentValues.effectSize < 0.3 ? 'small' 
      : this.currentValues.effectSize < 0.6 ? 'medium' 
      : 'large';
    document.getElementById('tableEffectSizeDesc').textContent = `Cohen's d (${effectLabel} effect)`;
    
    // Alpha
    document.getElementById('tableAlpha').textContent = this.currentValues.significanceLevel.toString();
    document.getElementById('tableAlphaDesc').textContent = 'Type I error rate (probability of false positive)';
    
    // Power
    document.getElementById('tablePower').textContent = (this.currentValues.statisticalPower * 100).toFixed(0) + '%';
    document.getElementById('tablePowerDesc').textContent = 'Probability of detecting true effect if it exists';
    
    // Test Direction
    document.getElementById('tableDirection').textContent = this.currentValues.testDirection === 'two-tailed' ? 'Two-tailed' : 'One-tailed';
    document.getElementById('tableDirectionDesc').textContent = this.currentValues.testDirection === 'two-tailed'
      ? 'Testing for difference in either direction'
      : 'Testing for difference in one specific direction';
    
    // Sampling Design
    const designMap = {
      'no-stratification': 'Simple Random Sampling',
      'stratified': 'Stratified Sampling',
      'cluster': 'Cluster Sampling',
      'stratified-cluster': 'Stratified Cluster Sampling'
    };
    document.getElementById('tableSamplingDesign').textContent = designMap[this.currentValues.samplingDesign] || '—';
    
    const designDescMap = {
      'no-stratification': 'Each unit has equal probability of selection',
      'stratified': 'Population divided into strata, sampled within each',
      'cluster': 'Natural groups sampled, all units within selected clusters',
      'stratified-cluster': 'Strata defined, then clusters sampled within strata'
    };
    document.getElementById('tableSamplingDesignDesc').textContent = designDescMap[this.currentValues.samplingDesign] || '—';
    
    // Design Parameters (conditional)
    const designParamsRow = document.getElementById('tableDesignParamsRow');
    if (this.currentValues.samplingDesign !== 'no-stratification') {
      let params = [];
      if (this.currentValues.samplingDesign === 'stratified' || this.currentValues.samplingDesign === 'stratified-cluster') {
        const S = parseInt(this.numStrata?.value) || 4;
        params.push(`${S} strata`);
      }
      if (this.currentValues.samplingDesign === 'cluster' || this.currentValues.samplingDesign === 'stratified-cluster') {
        const J = parseInt(this.numClusters?.value) || 40;
        const icc = parseFloat(this.clusterICC?.value) || 0.05;
        params.push(`${J} clusters, ICC=${icc.toFixed(3)}`);
      }
      document.getElementById('tableDesignParams').textContent = params.join('; ');
      document.getElementById('tableDesignParamsDesc').textContent = 'Specified design parameters';
      designParamsRow.style.display = '';
    } else {
      designParamsRow.style.display = 'none';
    }
    
    // Extraction Method
    const extractionMap = {
      'simple-random': 'Simple Random',
      'systematic': 'Systematic Random'
    };
    document.getElementById('tableExtraction').textContent = extractionMap[this.currentValues.extractionMethod] || '—';
    if (this.currentValues.extractionMethod === 'systematic') {
      // Calculate k-th interval for systematic sampling
      const totalPop = parseInt(this.populationSizeInput?.value || this.currentValues.populationSize, 10);
      const sampleSize = results.sampleSize;
      if (Number.isFinite(totalPop) && totalPop > 0 && sampleSize > 0) {
        const k = Math.max(2, Math.floor(totalPop / sampleSize));
        // Generate a random start between 0 and k-1 for illustration
        const s = Math.floor(Math.random() * k);
        document.getElementById('tableExtractionDesc').textContent = `Every k-th unit (${k}) selected after random start (${s})`;
      } else if (sampleSize > 0) {
        // If no population size, use a random multiplier between 5-15 for variety
        const multiplier = 5 + Math.floor(Math.random() * 11); // Random 5-15
        const estimatedPop = sampleSize * multiplier;
        const k = Math.max(2, Math.floor(estimatedPop / sampleSize));
        const s = Math.floor(Math.random() * k);
        document.getElementById('tableExtractionDesc').textContent = `Every k-th unit (${k}) selected after random start (${s})`;
      } else {
        document.getElementById('tableExtractionDesc').textContent = 'Every k-th unit selected after random start';
      }
    } else {
      document.getElementById('tableExtractionDesc').textContent = 'Each unit selected with equal probability';
    }
    
    // FPC (conditional)
    const fpcRow = document.getElementById('tableFPCRow');
    if (this.currentValues.populationEnabled) {
      const N = parseInt(this.populationSizeInput?.value || this.currentValues.populationSize, 10);
      if (Number.isFinite(N) && N > 0) {
        document.getElementById('tablePopSize').textContent = N.toLocaleString();
        const samplingFraction = ((results.sampleSize / N) * 100).toFixed(1);
        document.getElementById('tablePopSizeDesc').textContent = `Finite population correction applied (${samplingFraction}% sampling fraction)`;
        fpcRow.style.display = '';
      } else {
        fpcRow.style.display = 'none';
      }
    } else {
      fpcRow.style.display = 'none';
    }
    
    // Required Sample Size
    document.getElementById('tableSampleSize').textContent = results.sampleSize;
    if (this.currentValues.testType === 'two-sample') {
      const perGroup = Math.ceil(results.sampleSize / 2);
      document.getElementById('tableSampleSizeDesc').textContent = `Total N; ${perGroup} per group`;
    } else {
      document.getElementById('tableSampleSizeDesc').textContent = 'Total participants needed';
    }
    
    // Update note text
    const noteText = document.getElementById('vizNotesText');
    if (noteText) {
      let note = 'Sample size calculated using power analysis for mean differences.';
      if (this.currentValues.samplingDesign !== 'no-stratification') {
        note += ' Design effects applied for complex sampling.';
      }
      if (this.currentValues.populationEnabled) {
        note += ' Finite population correction applied.';
      }
      noteText.textContent = note;
      noteText.classList.add('apa-note-small');
    }
    
    // Notify visualizer iframe (keep for compatibility)
    this.notifyVisualizerIframe();
  }
  updateVizInterpretationOptions(meta = {}) {
    if (!this.vizNotesList) return;
    const { totalPopulation = 0, desiredSample = 0 } = meta;
    const design = this.currentValues.samplingDesign;
    const method = this.currentValues.extractionMethod || 'simple-random';

  const notes = [];
  // Point 1 should explicitly start with gray dots first
  notes.push(`Gray dots are the population (N=${totalPopulation}); blue dots are the sampled units (n=${desiredSample}).`);

    if (design === 'no-stratification' && method === 'systematic') {
      const k = totalPopulation && desiredSample ? (totalPopulation / desiredSample) : 0;
      notes.push(`Systematic random sampling selects every k-th unit with k ≈ ${k.toFixed(2)} and a random fractional start. Indices are floor(r + i·k), producing regular spacing across the frame.`);
    }

    if (design === 'stratified' || design === 'stratified-cluster') {
      // Determine allocation mode
      let alloc = 'proportional';
      if (design === 'stratified') {
        const useCustom = !!(this.stratCustomAllocToggle && this.stratCustomAllocToggle.checked);
        let useEqual = false;
        if (!useCustom && this.strataAllocMode) {
          const act = this.strataAllocMode.querySelector('.segment.active');
          useEqual = act && act.dataset.mode === 'equal';
        }
        if (useCustom) alloc = 'custom'; else if (useEqual) alloc = 'equal';
      } else {
        const useCustom = !!(this.sc_stratCustomAllocToggle && this.sc_stratCustomAllocToggle.checked);
        let useEqual = false;
        if (!useCustom && this.sc_strataAllocMode) {
          const act = this.sc_strataAllocMode.querySelector('.segment.active');
          useEqual = act && act.dataset.mode === 'equal';
        }
        if (useCustom) alloc = 'custom'; else if (useEqual) alloc = 'equal';
      }
      const allocText = alloc === 'equal' ? 'equal allocation across strata' : alloc === 'custom' ? 'custom allocation based on your percentages' : 'proportional allocation to stratum size';
      notes.push(`Colored bands represent strata. Sampling uses ${allocText}, with largest-remainder rounding to hit the exact target n.`);
    }

    if (design === 'cluster' || design === 'stratified-cluster') {
      notes.push(`The grid shows contiguous clusters (tiles). Sampling is by clusters; within a cluster, observations are correlated (ICC). The design effect is shown for context but does not change n in this visualization.`);
    }

    // Populate the list
    this.vizNotesList.innerHTML = notes.map(note => `<li>${note}</li>`).join('');
  }

  renderSamplingTree() {
    if (!this.samplingTree) return;
    const s = this.vizSummary || {};
    const design = s.design || this.currentValues.samplingDesign;
    // Classic tree: focus on sample counts (n), population not emphasized
    const sampTag = (n) => `<span class=\"tag sample\">n=${n}</span>`;
    const node = (label, samp, childrenHtml='') => `
      <li class=\"node\"><span class=\"label\">${label}</span> <span class=\"meta\">${sampTag(samp)}</span>
        ${childrenHtml ? `<ul class=\"tree\">${childrenHtml}</ul>` : ''}
      </li>`;
    let html = `<ul class="tree">`;
    // Build tree as: Sample -> (Strata) -> (Clusters)
    const buildClusterList = (list, maxShow) => {
      const shown = list.slice(0, maxShow).map(c => node(c.label, c.samp)).join('');
      if (list.length <= maxShow) return shown;
      const rest = list.slice(maxShow);
      const samp = rest.reduce((a,c)=>a+c.samp,0);
      return shown + node(`… +${rest.length} more`, samp);
    };
    let sampleChildren = '';
    if (design === 'no-stratification') {
      // No deeper breakdown
      sampleChildren = '';
    } else if (design === 'stratified') {
      sampleChildren = (s.strata || []).map(st => node(st.label, st.samp)).join('');
    } else if (design === 'cluster') {
      const list = s.clusters || [];
      sampleChildren = buildClusterList(list, 8);
    } else if (design === 'stratified-cluster') {
      const strata = s.strata || [];
      const strataNodes = strata.map(st => {
        const cl = st.clusters || [];
        const clNodes = buildClusterList(cl, 6);
        return node(st.label, st.samp, clNodes);
      }).join('');
      sampleChildren = strataNodes;
    }
    const sampleNode = node('Sample', s.desiredSample || 0, sampleChildren);
    html += sampleNode;
    
    html += `</ul>`;
    this.samplingTree.innerHTML = html;
  }

  updateParamsSummary(totalPopulation, designOverride) {
    if (!this.paramsSummary) return;
    const design = designOverride || this.currentValues.samplingDesign;
    let html = '';
    const fmt = (v, d=2) => (Number.isFinite(v) ? String(v.toFixed ? v.toFixed(d) : v) : '');
    const extractionMap = {
      'simple-random': 'Simple random',
      'systematic': 'Systematic Random'
    };
    const extractLabel = extractionMap[this.currentValues.extractionMethod] || '';
    if (design === 'no-stratification') {
      html = extractLabel || '';
    } else if (design === 'stratified') {
      const strata = parseInt(this.numStrata?.value);
      const red = parseFloat(this.stratVarReduction?.value);
      // Allocation mode label
      let alloc = '';
      if (this.stratCustomAllocToggle && this.stratCustomAllocToggle.checked) {
        alloc = 'Allocation: Custom';
      } else if (this.strataAllocMode) {
        const act = this.strataAllocMode.querySelector('.segment.active');
        alloc = act && act.dataset.mode === 'equal' ? 'Allocation: Equal' : 'Allocation: Prop';
      }
      const parts = [];
      if (Number.isFinite(strata)) parts.push(`Strata: ${strata}`);
      if (Number.isFinite(red)) parts.push(`Var reduction: ${Math.max(0, Math.min(90, red))}%`);
      if (alloc) parts.push(alloc);
      html = parts.join(' · ');
    } else if (design === 'cluster') {
      const nC = parseInt(this.numClusters?.value);
      const icc = parseFloat(this.clusterICC?.value);
      const mEstVal = parseFloat(this.clusterMEst?.value);
      const parts = [];
      if (Number.isFinite(nC)) parts.push(`Clusters: ${nC}`);
      if (Number.isFinite(icc)) {
        parts.push(`ρ=${fmt(icc, 3)}`);
      } else {
        parts.push(`ρ=0.05`);
      }
      if (Number.isFinite(mEstVal)) parts.push(`m≈${mEstVal}`);
      html = parts.join(' · ');
    } else if (design === 'stratified-cluster') {
      const nC = parseInt(this.sc_numClusters?.value);
      const icc = parseFloat(this.sc_clusterICC?.value);
      const mEstVal = parseFloat(this.sc_clusterMEst?.value);
      const red = parseFloat(this.sc_stratVarReduction?.value);
      let alloc = '';
      if (this.sc_stratCustomAllocToggle && this.sc_stratCustomAllocToggle.checked) {
        alloc = 'Allocation: Custom';
      } else if (this.sc_strataAllocMode) {
        const act = this.sc_strataAllocMode.querySelector('.segment.active');
        alloc = act && act.dataset.mode === 'equal' ? 'Allocation: Equal' : 'Allocation: Prop';
      }
      const parts = [];
      if (Number.isFinite(nC)) parts.push(`Clusters: ${nC}`);
      if (Number.isFinite(icc)) {
        parts.push(`ρ=${fmt(icc, 3)}`);
      } else {
        parts.push(`ρ=0.05`);
      }
      if (Number.isFinite(mEstVal)) parts.push(`m≈${mEstVal}`);
      if (Number.isFinite(red)) parts.push(`Strat reduction: ${Math.max(0, Math.min(90, red))}%`);
      if (alloc) parts.push(alloc);
      html = parts.join(' · ');
    } else {
      html = '';
    }
    this.paramsSummary.innerHTML = html;
  }

  copyCode() {
    const code = this.currentCodeLang === 'r' ? this.generateRCode() : this.generatePythonCode();
    navigator.clipboard.writeText(code).then(() => {
      // Show feedback
      const copyButton = document.getElementById('copyCode');
      const originalText = copyButton.innerHTML;
      copyButton.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 4L5 11L1 7" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>Copied!';
      setTimeout(() => {
        copyButton.innerHTML = originalText;
      }, 2000);
    });
  }

  downloadCode() {
    const code = this.currentCodeLang === 'r' ? this.generateRCode() : this.generatePythonCode();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.currentCodeLang === 'r' ? 'sample_size_analysis.R' : 'sample_size_analysis.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  copyOutput() {
    const output = this.generateROutput();
    navigator.clipboard.writeText(output).then(() => {
      // Show feedback
      const copyButton = document.getElementById('copyOutput');
      const originalText = copyButton.innerHTML;
      copyButton.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 4L5 11L1 7" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>Copied!';
      setTimeout(() => {
        copyButton.innerHTML = originalText;
      }, 2000);
    });
  }

  async downloadTableAsPNG() {
    const table = document.querySelector('.apa-table-container');
    if (!table || !window.html2canvas) return;
    
    try {
      const canvas = await html2canvas(table, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample_size_report.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export PNG:', error);
      alert('Failed to export table as PNG. Please try again.');
    }
  }

  async downloadTableAsPDF() {
    const table = document.querySelector('.apa-table-container');
    if (!table || !window.html2canvas || !window.jspdf) return;
    
    try {
      const canvas = await html2canvas(table, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 190; // A4 width minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('sample_size_report.pdf');
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export table as PDF. Please try again.');
    }
  }

  generateRCode() {
    const { effectSize, statisticalPower, significanceLevel, testDirection } = this.currentValues;
    const results = this.calculateSampleSize();
    
    // Map test type to R pwr package format
    const typeMap = {
      'single-sample': 'one.sample',
      'paired': 'paired',
      'two-sample': 'two.sample'
    };
    const rTestType = typeMap[this.currentValues.testType] || 'two.sample';
    
    return `# A-Priori Sample Size Analysis (R)
# Generated by TSM A-Priori Sample Size Calculator

# Load required packages
library(pwr)

# Study parameters
effect_size <- ${effectSize}
power <- ${statisticalPower}
alpha <- ${significanceLevel}
alternative <- "${testDirection === 'two-tailed' ? 'two.sided' : 'one.sided'}"

# Calculate sample size
result <- pwr.t.test(
  d = effect_size,
  power = power,
  sig.level = alpha,
  alternative = alternative,
  type = "${rTestType}"
)

# Display results
print(result)

# Current analysis results (UI approximation):
# Sample size needed: ${results.sampleSize}
# Target power: ${(results.achievedPower * 100).toFixed(0)}%

# Visualize power curve
sample_sizes <- seq(10, 200, by = 5)
powers <- sapply(sample_sizes, function(n) {
  pwr.t.test(n = n, d = effect_size, sig.level = alpha, 
             alternative = alternative, type = "${rTestType}")$power
})

plot(sample_sizes, powers, type = "l", 
     xlab = "Sample Size", ylab = "Statistical Power",
     main = "Power Analysis Curve")
abline(h = 0.8, col = "red", lty = 2)
abline(v = ${results.sampleSize}, col = "blue", lty = 2)
`;
  }

  generatePythonCode() {
    const { effectSize, statisticalPower, significanceLevel, testDirection } = this.currentValues;
    const results = this.calculateSampleSize();

    const alt = testDirection === 'two-tailed' ? 'two-sided' : 'larger';
    const typeMap = {
      'single-sample': 'one-sample',
      'paired': 'paired',
      'two-sample': 'two-sample'
    };
    const testLabel = typeMap[this.currentValues.testType] || 'two-sample';

    return `# A-Priori Sample Size Analysis (Python)
# Generated by TSM A-Priori Sample Size Calculator

# Requires: statsmodels
# pip install statsmodels

from statsmodels.stats.power import TTestPower, TTestIndPower

effect_size = ${effectSize}
power = ${statisticalPower}
alpha = ${significanceLevel}
alternative = '${alt}'  # 'two-sided' or 'larger'
test_type = '${testLabel}'  # one-sample | paired | two-sample

if test_type in ('one-sample', 'paired'):
    analysis = TTestPower()
    n = analysis.solve_power(effect_size=effect_size, power=power, alpha=alpha, alternative=alternative)
    total_n = int(round(n))
else:
    # Independent two-sample t-test returns n per group
    analysis = TTestIndPower()
    n_per_group = analysis.solve_power(effect_size=effect_size, power=power, alpha=alpha, alternative=alternative)
    total_n = int(round(2 * n_per_group))

print({'total_n': total_n, 'effect_size': effect_size, 'power': power, 'alpha': alpha, 'alternative': alternative, 'type': test_type})

# Current analysis results (UI approximation):
# Sample size needed: ${results.sampleSize}
# Target power: ${(results.achievedPower * 100).toFixed(0)}%
`;
  }

  generateROutput() {
    const { effectSize, statisticalPower, significanceLevel, testDirection } = this.currentValues;
    const results = this.calculateSampleSize();
    const nPerGroup = this.currentValues.testType === 'two-sample' ? Math.ceil(results.sampleSize / 2) : results.sampleSize;
    const actualPower = results.achievedPower;
    const testTypeLabel = {
      'single-sample': 'one-sample',
      'paired': 'paired',
      'two-sample': 'two-sample'
    }[this.currentValues.testType] || 'two-sample';
    
    // Generate example output that matches what R's pwr.t.test would produce
    if (this.currentValues.testType === 'two-sample') {
      return `     Two-sample t test power calculation 

              n = ${nPerGroup}
              d = ${effectSize.toFixed(2)}
          sig.level = ${significanceLevel}
          power = ${(actualPower * 100).toFixed(1)}%
    alternative = ${testDirection === 'two-tailed' ? 'two.sided' : 'greater'}

NOTE: n is number in *each* group`;
    } else {
      const label = testTypeLabel === 'one-sample' ? 'One-sample' : 'Paired';
      return `     ${label} t test power calculation 

              n = ${results.sampleSize}
              d = ${effectSize.toFixed(2)}
          sig.level = ${significanceLevel}
          power = ${(actualPower * 100).toFixed(1)}%
    alternative = ${testDirection === 'two-tailed' ? 'two.sided' : 'greater'}`;
    }
  }

  renderSamplingTreeSvg() {
    if (!this.samplingTreeSvg) return;
    const s = this.vizSummary || {};
    const design = s.design || this.currentValues.samplingDesign;
    const width = this.samplingTreeSvg.clientWidth || 700;
    const padding = 16;
    const colGap = 28;
    const rowGap = 24;

    // Color palette matching the visualization
    const palettePairs = [
      { base: '#e2e8f0', sel: '#64748b' }, // slate
      { base: '#dbeafe', sel: '#3b82f6' }, // blue
      { base: '#dcfce7', sel: '#22c55e' }, // green
      { base: '#fef3c7', sel: '#f59e0b' }, // amber
      { base: '#f3e8ff', sel: '#8b5cfb' }, // purple
      { base: '#ffe4e6', sel: '#f43f5e' }, // rose
      { base: '#ccfbf1', sel: '#14b8a6' }, // teal
      { base: '#e0e7ff', sel: '#6366f1' }, // indigo
    ];

    const rectNode = (x, y, w, h, label, sub, colorIdx = null) => {
      const pair = colorIdx !== null ? palettePairs[colorIdx % palettePairs.length] : null;
      const fillColor = pair ? pair.base : '#f8fafc';
      const strokeColor = pair ? pair.sel : '#cbd5e1';
      const textColor = pair ? '#ffffff' : '#64748b';
      const subColor = pair ? strokeColor : '#64748b';
      const coloredAttr = pair ? 'data-colored="true"' : '';
      return `
      <g>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="node" ${coloredAttr} style="fill:${fillColor};stroke:${strokeColor};" />
        <rect x="${x}" y="${y}" width="${w}" height="20" rx="8" class="node-header" ${coloredAttr} style="fill:${strokeColor};" />
        <text x="${x + 8}" y="${y + 14}" class="small" style="fill:${textColor};">${label}</text>
        ${sub ? `<text x="${x + 8}" y="${y + 36}" style="fill:${subColor};">${sub}</text>` : ''}
      </g>`;
    };
    const link = (x1,y1,x2,y2) => `<path d="M${x1},${y1} C ${x1},${(y1+y2)/2} ${x2},${(y1+y2)/2} ${x2},${y2}" class="link" />`;
    const circleNode = (cx, cy, r, label, sub, colorIdx = null) => {
      const pair = colorIdx !== null ? palettePairs[colorIdx % palettePairs.length] : null;
      const fillColor = pair ? pair.base : '#f1f5f9';
      const strokeColor = pair ? pair.sel : '#cbd5e1';
      const coloredAttr = pair ? 'data-colored="true"' : '';
      return `
      <g>
        <circle cx="${cx}" cy="${cy}" r="${r}" class="bubble" ${coloredAttr} style="fill:${fillColor};stroke:${strokeColor};" />
        ${label ? `<text x="${cx}" y="${cy - 2}" text-anchor="middle" class="small" style="fill:${strokeColor};">${label}</text>` : ''}
        ${sub ? `<text x="${cx}" y="${cy + 12}" text-anchor="middle" style="fill:${strokeColor};">${sub}</text>` : ''}
      </g>`;
    };

    // Layout presets
    const titleY = padding;
    const topY = padding + 32;
    const nodeW = 160, nodeH = 48;

    let svgParts = [];
    
    // Sampling method title
    const methodTitles = {
      'no-stratification': 'Simple Random Sampling',
      'stratified': 'Stratified Sampling',
      'cluster': 'Cluster Sampling',
      'stratified-cluster': 'Stratified + Cluster Sampling'
    };
    const methodTitle = methodTitles[design] || 'Sampling Design';
    svgParts.push(`<text x="${width/2}" y="${titleY + 16}" text-anchor="middle" class="method-title" fill="#1e293b" font-weight="600" font-size="16">${methodTitle}</text>`);
    
    // Population node
    const popX = Math.max(padding, (width - nodeW) / 2);
    svgParts.push(rectNode(popX, topY, nodeW, nodeH, 'Population', `N = ${s.totalPopulation || '—'}`, 0));

    let currentY = topY + nodeH + rowGap;

    if (design === 'no-stratification') {
      // Single sample node
      const sampleX = popX;
      svgParts.push(link(popX + nodeW/2, topY + nodeH, sampleX + nodeW/2, currentY));
      svgParts.push(rectNode(sampleX, currentY, nodeW, nodeH, 'Sample', `n = ${s.desiredSample || 0}`, 1));
    } else if (design === 'stratified') {
      const strata = s.strata || [];
      const count = Math.max(2, Math.min(6, strata.length || 2));
      const totalWidth = count * nodeW + (count - 1) * colGap;
      const startX = (width - totalWidth) / 2;
      // Links from Population to each stratum
      for (let i = 0; i < count; i++) {
        const x = startX + i * (nodeW + colGap);
        svgParts.push(link(popX + nodeW/2, topY + nodeH, x + nodeW/2, currentY));
      }
      for (let i = 0; i < count; i++) {
        const x = startX + i * (nodeW + colGap);
        const st = strata[i] || { label: `S${i+1}`, samp: 0 };
        svgParts.push(rectNode(x, currentY, nodeW, nodeH, st.label || `S${i+1}`, `n = ${st.samp || 0}`, i + 1));
      }
      if (strata.length > count) {
        const more = strata.length - count;
        const x = startX + count * (nodeW + colGap) - nodeW;
        svgParts.push(rectNode(x, currentY + nodeH + 6, nodeW, 28, `+${more} more`, '', null));
      }
    } else if (design === 'cluster') {
      // Show up to 6 clusters as circles
      const clusters = (s.clusters || []).slice(0, 6);
      const cols = Math.min(3, Math.max(2, clusters.length));
      const rows = Math.ceil(clusters.length / cols);
      const r = 28;
      const gridW = cols * (r*2) + (cols - 1) * colGap;
      const startX = (width - gridW) / 2 + r;
      const startY = currentY + r;
      // Link to a mid rail
      svgParts.push(link(popX + nodeW/2, topY + nodeH, width/2, currentY));
      clusters.forEach((cl, idx) => {
        const c = idx % cols;
        const rIdx = Math.floor(idx / cols);
        const cx = startX + c * (r*2 + colGap);
        const cy = startY + rIdx * (r*2 + rowGap);
        svgParts.push(circleNode(cx, cy, r, `C${idx+1}`, `n=${cl.samp || 0}`, idx + 1));
      });
      if ((s.clusters || []).length > clusters.length) {
        const more = (s.clusters || []).length - clusters.length;
        svgParts.push(`<text x="${width/2}" y="${startY + rows*(r*2 + rowGap)}" text-anchor="middle" class="small" fill="#64748b">+${more} more</text>`);
      }
    } else if (design === 'stratified-cluster') {
      const strata = s.strata || [];
      const S = Math.max(2, Math.min(4, strata.length || 2));
      const r = 18;
      const colWidth = nodeW + 2*r + colGap; // approx width with bubbles
      const totalW = S * colWidth - colGap;
      const startX = (width - totalW) / 2;
      // Rail links
      for (let i = 0; i < S; i++) {
        const colX = startX + i * colWidth;
        svgParts.push(link(popX + nodeW/2, topY + nodeH, colX + nodeW/2, currentY));
      }
      // Draw each stratum column with up to 3 cluster circles
      for (let i = 0; i < S; i++) {
        const st = strata[i] || { label: `S${i+1}`, samp: 0, clusters: [] };
        const x = startX + i * colWidth;
        svgParts.push(rectNode(x, currentY, nodeW, nodeH, st.label || `S${i+1}`, `n=${st.samp || 0}`, i + 1));
        const circles = (st.clusters || []).slice(0, 3);
        const baseY = currentY + nodeH + rowGap + r;
        circles.forEach((cl, k) => {
          const cx = x + nodeW/2;
          const cy = baseY + k * (r*2 + 12);
          svgParts.push(link(x + nodeW/2, currentY + nodeH, cx, cy - r));
          svgParts.push(circleNode(cx, cy, r, `C${k+1}`, `n=${cl.samp || 0}`, i + 1));
        });
        const more = (st.clusters || []).length - circles.length;
        if (more > 0) {
          svgParts.push(`<text x="${x + nodeW/2}" y="${baseY + circles.length * (r*2 + 12)}" text-anchor="middle" class="small" fill="#64748b">+${more} more</text>`);
        }
      }
    }

    const heightEstimate = 320; // reasonable default
    const svg = `<svg class="tree-svg" viewBox="0 0 ${width} ${heightEstimate}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sampling structure diagram">
      ${svgParts.join('\n')}
    </svg>`;
    this.samplingTreeSvg.innerHTML = svg;
  }

  displayVersion() {
    // Update footer version info
    const versionEl = document.getElementById('appVersion');
    const buildEl = document.getElementById('appBuild');
    if (versionEl) versionEl.textContent = this.version.toString();
    if (buildEl) buildEl.textContent = this.version.getBuildString();
    
    // Update header version info
    const headerVersionEl = document.getElementById('headerVersion');
    const headerBuildEl = document.getElementById('headerBuild');
    if (headerVersionEl) headerVersionEl.textContent = this.version.toString();
    if (headerBuildEl) headerBuildEl.textContent = this.version.getBuildString();
    
    // Log version to console
    console.log(`%c${this.version.getFullVersion()}`, 'color: #005EE9; font-weight: bold; font-size: 14px;');
    console.log('%cTSM A-Priori Sample Size Calculator', 'color: #64748b; font-size: 12px;');
  }

  // ==============================
  // VALIDATION: Compare against R pwr package results
  // ==============================
  validateAgainstR() {
    console.log('%c\n=== VALIDATION: Browser vs R pwr Package ===', 'color: #7c3aed; font-weight: bold; font-size: 14px;');
    
    // Test cases with known R results (generated using pwr.t.test in R)
    const testCases = [
      {
        name: 'One-sample, d=0.5, power=0.8, α=0.05, two-tailed',
        params: { testType: 'single-sample', effectSize: 0.5, statisticalPower: 0.8, significanceLevel: 0.05, testDirection: 'two-tailed', samplingDesign: 'no-stratification', extractionMethod: 'simple-random', populationEnabled: false },
        rResult: 33.367
      },
      {
        name: 'Two-sample, d=0.5, power=0.8, α=0.05, two-tailed',
        params: { testType: 'two-sample', effectSize: 0.5, statisticalPower: 0.8, significanceLevel: 0.05, testDirection: 'two-tailed', samplingDesign: 'no-stratification', extractionMethod: 'simple-random', populationEnabled: false },
        rResult: 128 // 63.76561 per group × 2
      },
      {
        name: 'Paired, d=0.5, power=0.8, α=0.05, two-tailed',
        params: { testType: 'paired', effectSize: 0.5, statisticalPower: 0.8, significanceLevel: 0.05, testDirection: 'two-tailed', samplingDesign: 'no-stratification', extractionMethod: 'simple-random', populationEnabled: false },
        rResult: 33.367
      },
      {
        name: 'One-sample, d=0.8, power=0.9, α=0.01, two-tailed',
        params: { testType: 'single-sample', effectSize: 0.8, statisticalPower: 0.9, significanceLevel: 0.01, testDirection: 'two-tailed', samplingDesign: 'no-stratification', extractionMethod: 'simple-random', populationEnabled: false },
        rResult: 36.615
      },
      {
        name: 'Two-sample, d=0.3, power=0.8, α=0.05, one-tailed',
        params: { testType: 'two-sample', effectSize: 0.3, statisticalPower: 0.8, significanceLevel: 0.05, testDirection: 'one-tailed', samplingDesign: 'no-stratification', extractionMethod: 'simple-random', populationEnabled: false },
        rResult: 352 // 175.385 per group × 2
      },
      {
        name: 'One-sample, d=1.0, power=0.95, α=0.05, two-tailed',
        params: { testType: 'single-sample', effectSize: 1.0, statisticalPower: 0.95, significanceLevel: 0.05, testDirection: 'two-tailed', samplingDesign: 'no-stratification', extractionMethod: 'simple-random', populationEnabled: false },
        rResult: 22.245
      },
      {
        name: 'Paired, d=0.2, power=0.8, α=0.05, two-tailed (small effect)',
        params: { testType: 'paired', effectSize: 0.2, statisticalPower: 0.8, significanceLevel: 0.05, testDirection: 'two-tailed', samplingDesign: 'no-stratification', extractionMethod: 'simple-random', populationEnabled: false },
        rResult: 198.151
      },
      {
        name: 'Two-sample, d=1.2, power=0.99, α=0.01, two-tailed (large effect, high power)',
        params: { testType: 'two-sample', effectSize: 1.2, statisticalPower: 0.99, significanceLevel: 0.01, testDirection: 'two-tailed', samplingDesign: 'no-stratification', extractionMethod: 'simple-random', populationEnabled: false },
        rResult: 52 // 25.524 per group × 2
      }
    ];

    let passed = 0;
    let failed = 0;
    const tolerance = 0.02; // 2% tolerance for rounding differences

    testCases.forEach((test, idx) => {
      // Temporarily set current values
      const oldValues = { ...this.currentValues };
      this.currentValues = { ...test.params };
      
      // Calculate
      const result = this.calculateSampleSize();
      const browserN = result.sampleSize;
      const rN = Math.ceil(test.rResult);
      const diff = Math.abs(browserN - rN);
      const percentDiff = (diff / rN) * 100;
      const match = percentDiff <= (tolerance * 100);
      
      if (match) {
        passed++;
        console.log(`%c✓ PASS`, 'color: #22c55e; font-weight: bold', `${test.name}`);
        console.log(`  Browser: ${browserN}, R: ${rN}, Diff: ${diff} (${percentDiff.toFixed(2)}%)`);
      } else {
        failed++;
        console.log(`%c✗ FAIL`, 'color: #ef4444; font-weight: bold', `${test.name}`);
        console.log(`  Browser: ${browserN}, R: ${rN}, Diff: ${diff} (${percentDiff.toFixed(2)}%)`);
      }
      
      // Restore values
      this.currentValues = oldValues;
    });

    console.log(`\n%c=== Summary: ${passed}/${testCases.length} tests passed (${((passed/testCases.length)*100).toFixed(1)}%) ===`, 
      passed === testCases.length ? 'color: #22c55e; font-weight: bold' : 'color: #f59e0b; font-weight: bold');
    
    if (failed > 0) {
      console.log(`%cNote: Small differences (<2%) are expected due to rounding. Larger differences may indicate calculation issues.`, 'color: #64748b; font-style: italic');
    }

    return { passed, failed, total: testCases.length };
  }
}

// ==============================
// INFO MODAL SYSTEM
// ==============================
function initInfoModal() {
  const modal = document.getElementById('infoModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  const modalClose = modal.querySelector('.modal-close');
  const modalOverlay = modal.querySelector('.modal-overlay');
  
  // Function to open modal
  function openModal(title, content) {
    modalTitle.textContent = title;
    modalContent.textContent = content;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
  
  // Function to close modal
  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  // Add click listeners to all info buttons
  document.querySelectorAll('.info-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const title = button.getAttribute('data-modal-title') || 'Information';
      const content = button.getAttribute('data-modal-content') || button.getAttribute('title') || 'No information available.';
      openModal(title, content);
    });
  });
  
  // Close modal on close button click
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  // Close modal on overlay click
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const app = new SampleSizeEstimator();
  
  // Expose app instance globally for console access
  window.sampleSizeApp = app;
  
  // Run validation tests
  console.log('%cRunning validation tests...', 'color: #64748b; font-style: italic');
  setTimeout(() => {
    const results = app.validateAgainstR();
    if (results.passed === results.total) {
      console.log('%c✓ All validation tests passed! Browser calculations match R pwr package.', 'color: #22c55e; font-weight: bold');
    } else {
      console.log(`%c⚠ ${results.failed} test(s) failed. Review differences above.`, 'color: #f59e0b; font-weight: bold');
    }
    console.log('%cTip: Run window.sampleSizeApp.validateAgainstR() to re-run tests anytime.', 'color: #64748b; font-style: italic');
  }, 500);
  
  // Initialize info modal system
  initInfoModal();
  
  // ----- Inline Interactive Sampling Visualizer -----
  initInlineVisualizer();
  // Permanently mount pop-grid2 (20×40) into the top card and hide the canvas
  const hostTop = document.getElementById('popGrid2Host');
  const inlineStage = document.getElementById('inlineStage');
  if (hostTop && inlineStage) {
    hostTop.style.display = '';
    while (hostTop.firstChild) hostTop.removeChild(hostTop.firstChild);
    inlineStage.classList.add('mounted-top');
    hostTop.appendChild(inlineStage);
  }
  const canvasTop = document.getElementById('samplingVisualization');
  if (canvasTop) canvasTop.style.display = 'none';
  const inlineSection = document.getElementById('sampling-visualizer-section');
  if (inlineSection) inlineSection.style.display = 'none';
});

// ==============================
// INLINE INTERACTIVE VISUALIZER
// ==============================
function initInlineVisualizer() {
  const ROWS = 20, COLS = 40, N = ROWS * COLS;
  const gridEl = document.getElementById('inlineGrid');
  const guidesEl = document.getElementById('inlineGuides');
  const stageEl = document.getElementById('inlineStage');
  const sampleStat = document.getElementById('inlineSampleStat');
  const captionEl = document.getElementById('inlineCaption');
  const controlsEl = document.getElementById('inlineControls');
  const legendEl = document.getElementById('inlineLegend');
  const guidesToggle = document.getElementById('inlineGuidesToggle');
  const seedInput = document.getElementById('inlineSeed');
  const pillsEl = document.getElementById('inlinePills');

  const state = {
    mode: 'srs',
    n: 40,
  k: 10,
  sysStart: null,
    strataRows: 4,
    perStratum: 10,
    clustersAcross: 4,
    clustersDown: 4,
    clustersPick: 3,
    sc_pickPerStratum: 1,
    showGuides: false,
    rngSeed: null,
    rng: Math.random
  };

  // RNG (seeded): mulberry32
  function mulberry32(a) {
    return function() {
      a |= 0;
      a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }

  function setSeed(s) {
    if (!s && s !== 0) {
      state.rng = Math.random;
      return;
    }
    const str = String(s).trim();
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = h << 13 | h >>> 19;
    }
    state.rng = mulberry32(h >>> 0);
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(state.rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function sampleWithoutReplacement(K, n) {
    const a = Array.from({length: K}, (_, i) => i);
    shuffle(a);
    return a.slice(0, Math.min(n, K));
  }

  function clearAll() {
    for (const cell of gridEl.children) {
      cell.className = 'cell';
      cell.style.removeProperty('--c');
    }
    sampleStat.textContent = '0';
  }

  // Build base grid once
  (function buildGrid() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const d = document.createElement('div');
        d.className = 'cell';
        d.dataset.r = r;
        d.dataset.c = c;
        gridEl.appendChild(d);
      }
    }
  })();

  // Visual helpers
  function setStrataBackgrounds() {
    const bandSize = Math.floor(ROWS / state.strataRows) || 1;
    for (const cell of gridEl.children) {
      const r = +cell.dataset.r;
      const band = Math.min(Math.floor(r / bandSize), state.strataRows - 1);
      cell.classList.add(`stratum-${band}`);
    }
  }

  function clearStrataBackgrounds() {
    for (let band = 0; band < 8; band++) {
      for (const cell of gridEl.children) cell.classList.remove(`stratum-${band}`);
    }
  }

  function outlineClusters(selectSet = new Set()) {
    for (const cell of gridEl.children) {
      cell.classList.remove('cluster-selected', 'cluster-outline');
    }
    const blockH = Math.floor(ROWS / state.clustersDown) || 1;
    const blockW = Math.floor(COLS / state.clustersAcross) || 1;

    for (let br = 0; br < state.clustersDown; br++) {
      for (let bc = 0; bc < state.clustersAcross; bc++) {
        const id = br * state.clustersAcross + bc;
        for (let rr = 0; rr < blockH; rr++) {
          for (let cc = 0; cc < blockW; cc++) {
            const r = br * blockH + rr;
            const c = bc * blockW + cc;
            if (r < ROWS && c < COLS) {
              const cell = gridEl.children[r * COLS + c];
              // Remove dashed outline rings completely; only color selected clusters
              if (selectSet.has(id)) cell.classList.add('cluster-selected');
            }
          }
        }
      }
    }
  }

  // Guidelines overlay
  function drawGuides() {
    guidesEl.innerHTML = '';
    if (!state.showGuides) {
      guidesEl.hidden = true;
      return;
    }
    guidesEl.hidden = false;

    const gridRect = gridEl.getBoundingClientRect();
    const stageRect = stageEl.getBoundingClientRect();

    const offsetX = gridRect.left - stageRect.left;
    const offsetY = gridRect.top - stageRect.top;

    const first = gridEl.children[0].getBoundingClientRect();
    const second = gridEl.children[1].getBoundingClientRect();
    const dot = first.width;
    const gap = second.left - first.right;
    const colWidth = dot + gap;
    const rowHeight = dot + gap;

    // STRATA (row bands)
    const bandH = Math.floor(ROWS / state.strataRows) || 1;
    for (let b = 0; b < state.strataRows; b++) {
      const y = offsetY + b * bandH * rowHeight - 6;
      const line = document.createElement('div');
      line.className = 'guide-line';
      line.style.width = gridRect.width + 'px';
      line.style.left = offsetX + 'px';
      line.style.top = y + 'px';
      guidesEl.appendChild(line);

      const lab = document.createElement('div');
      lab.className = 'guide-label';
      lab.style.left = (offsetX + 4) + 'px';
      lab.style.top = (y - 18) + 'px';
      lab.textContent = `Stratum ${b + 1}`;
      guidesEl.appendChild(lab);
    }

    // SYSTEMATIC (every k-th) markers along top
    if (state.mode === 'systematic') {
      const k = Math.max(2, Math.floor(state.k));
      const r0 = (state.sysStart != null) ? state.sysStart : Math.floor(state.rng() * k);
      for (let i = r0; i < N; i += k) {
        const r = Math.floor(i / COLS),
          c = i % COLS;
        const x = offsetX + c * colWidth + dot / 2;
        const topY = offsetY - 10;
        const m = document.createElement('div');
        m.className = 'guide-label';
        m.style.left = (x - 10) + 'px';
        m.style.top = (topY) + 'px';
        m.textContent = 'k';
        guidesEl.appendChild(m);
      }
    }

    // CLUSTERS grid lines
    const blockH = Math.floor(ROWS / state.clustersDown) || 1;
    const blockW = Math.floor(COLS / state.clustersAcross) || 1;

    for (let r = 0; r <= ROWS; r += blockH) {
      const y = offsetY + r * rowHeight - 6;
      const line = document.createElement('div');
      line.className = 'guide-line';
      line.style.width = gridRect.width + 'px';
      line.style.left = offsetX + 'px';
      line.style.top = y + 'px';
      line.style.background = 'rgba(51,65,85,.25)';
      guidesEl.appendChild(line);
    }
    for (let c = 0; c <= COLS; c += blockW) {
      const x = offsetX + c * colWidth - 6;
      const v = document.createElement('div');
      v.style.position = 'absolute';
      v.style.width = '2px';
      v.style.height = gridRect.height + 'px';
      v.style.left = x + 'px';
      v.style.top = offsetY + 'px';
      v.style.background = 'rgba(51,65,85,.25)';
      guidesEl.appendChild(v);
    }
  }

  // MODES
  function runSRS() {
    clearAll();
    clearStrataBackgrounds();
    outlineClusters(new Set());
    const chosen = sampleWithoutReplacement(N, state.n);
    chosen.forEach(i => gridEl.children[i].classList.add('sampled', 'flash'));
    sampleStat.textContent = String(chosen.length);
    setLegend([{
      label: 'Population unit',
      color: '#E6ECF5'
    }, {
      label: 'Sampled unit',
      color: '#0067FF'
    }]);
    captionEl.innerHTML = `In <span class="inline-strong">Simple Random Sampling</span>, every unit has equal chance; the selected units are scattered without pattern.`;
  }

  function runSystematic() {
    clearAll();
    clearStrataBackgrounds();
    outlineClusters(new Set());
  const k = Math.max(2, Math.floor(state.k));
  const r0 = (state.sysStart != null) ? state.sysStart : Math.floor(state.rng() * k);
    const chosen = [];
    for (let i = r0; i < N; i += k) chosen.push(i);
    chosen.forEach(i => gridEl.children[i].classList.add('sampled', 'flash'));
    sampleStat.textContent = String(chosen.length);
    setLegend([{
      label: 'Population unit',
      color: '#E6ECF5'
    }, {
      label: `Every k-th (k=${k})`,
      color: '#0067FF'
    }]);
  captionEl.innerHTML = `In <span class="inline-strong">Systematic Random Sampling</span>, a random start is chosen, then every <span class="inline-strong">k</span>-th unit is selected (k = ${k}).`;
  }

  function runStratified() {
    clearAll();
    outlineClusters(new Set());
    clearStrataBackgrounds();
    setStrataBackgrounds();
    const bands = state.strataRows;
    const bandSize = Math.floor(ROWS / bands) || 1;
    let total = 0;
    for (let b = 0; b < bands; b++) {
      const rowsInBand = [];
      for (let r = b * bandSize; r < Math.min((b + 1) * bandSize, ROWS); r++) rowsInBand.push(r);
      const indices = [];
      for (const r of rowsInBand) {
        for (let c = 0; c < COLS; c++) indices.push(r * COLS + c);
      }
      const chosen = sampleWithoutReplacement(indices.length, state.perStratum).map(j => indices[j]);
      total += chosen.length;
      chosen.forEach(i => gridEl.children[i].classList.add('sampled', 'flash'));
    }
    sampleStat.textContent = String(total);
    setLegend([{
      label: 'Strata (row bands)',
      color: '#E7F0FF'
    }, {
      label: 'Sampled within stratum',
      color: '#0067FF'
    }]);
    captionEl.innerHTML = `In <span class="inline-strong">Stratified Sampling</span>, the population is split into <span class="inline-strong">${bands}</span> strata (row bands). We draw <span class="inline-strong">${state.perStratum}</span> units from each stratum.`;
  }

  function runCluster() {
    clearAll();
    clearStrataBackgrounds();
    const totalClusters = state.clustersAcross * state.clustersDown;
    const picks = sampleWithoutReplacement(totalClusters, state.clustersPick);
    const pickSet = new Set(picks);
    outlineClusters(pickSet);

    let count = 0;
    const blockH = Math.floor(ROWS / state.clustersDown) || 1;
    const blockW = Math.floor(COLS / state.clustersAcross) || 1;
    for (let br = 0; br < state.clustersDown; br++) {
      for (let bc = 0; bc < state.clustersAcross; bc++) {
        const id = br * state.clustersAcross + bc;
        if (!pickSet.has(id)) continue;
        for (let rr = 0; rr < blockH; rr++) {
          for (let cc = 0; cc < blockW; cc++) {
            const r = br * blockH + rr,
              c = bc * blockW + cc;
            if (r < ROWS && c < COLS) {
              gridEl.children[r * COLS + c].classList.add('sampled', 'flash');
              count++;
            }
          }
        }
      }
    }
    sampleStat.textContent = String(count);
    setLegend([{
      label: 'Cluster (outlined)',
      color: '#CBD5E1'
    }, {
      label: 'Selected cluster',
      color: '#3399FF'
    }]);
    captionEl.innerHTML = `In <span class="inline-strong">Cluster Sampling</span>, we randomly select <span class="inline-strong">${state.clustersPick}</span> whole clusters (out of ${totalClusters}), and include all units in those clusters.`;
  }

  function runStratifiedCluster() {
    clearAll();
    const bands = state.strataRows;
    const bandH = Math.floor(ROWS / bands) || 1;

    clearStrataBackgrounds();
    setStrataBackgrounds();

    const across = state.clustersAcross,
      down = state.clustersDown;
    const blockH = Math.floor(ROWS / down) || 1,
      blockW = Math.floor(COLS / across) || 1;

    let totalSampled = 0;
    const selectedSet = new Set();
    for (let b = 0; b < bands; b++) {
      const rStart = b * bandH,
        rEnd = Math.min((b + 1) * bandH, ROWS) - 1;
      const clusterRowStart = Math.floor(rStart / blockH);
      const clusterRowEnd = Math.floor(rEnd / blockH);
      const clusterIDs = [];
      for (let cr = clusterRowStart; cr <= clusterRowEnd; cr++) {
        for (let cc = 0; cc < across; cc++) clusterIDs.push(cr * across + cc);
      }
      const picks = sampleWithoutReplacement(clusterIDs.length, state.sc_pickPerStratum).map(j => clusterIDs[j]);
      picks.forEach(id => selectedSet.add(id));
    }
    outlineClusters(selectedSet);

    for (const id of selectedSet) {
      const br = Math.floor(id / across),
        bc = id % across;
      for (let rr = 0; rr < blockH; rr++) {
        for (let cc = 0; cc < blockW; cc++) {
          const r = br * blockH + rr,
            c = bc * blockW + cc;
          if (r < ROWS && c < COLS) {
            gridEl.children[r * COLS + c].classList.add('sampled', 'flash');
            totalSampled++;
          }
        }
      }
    }
    sampleStat.textContent = String(totalSampled);
    setLegend([{
      label: 'Strata (row bands)',
      color: '#E7F0FF'
    }, {
      label: 'Selected clusters within strata',
      color: '#3399FF'
    }]);
    captionEl.innerHTML = `In <span class="inline-strong">Stratified + Cluster Sampling</span>, we form strata by rows and then randomly select clusters within each stratum (here: <span class="inline-strong">${state.sc_pickPerStratum}</span> cluster per stratum). All units inside those clusters are included.`;
  }

  // Controls & render
  function renderControls() {
    controlsEl.innerHTML = '';
    const add = html => {
      const w = document.createElement('div');
      w.className = 'inline-control';
      w.innerHTML = html;
      controlsEl.appendChild(w);
    };

    if (state.mode === 'srs') {
      add(`<label>Sample size (n)</label><input type="number" id="inline_n" min="1" max="${N}" value="${state.n}">`);
    }
    if (state.mode === 'systematic') {
      add(`<label>Step (k)</label><input type="number" id="inline_k" min="2" max="${N}" value="${state.k}">`);
    }
    if (state.mode === 'stratified') {
      add(`<label>Number of strata (row bands)</label><input type="number" id="inline_strata" min="2" max="10" value="${state.strataRows}">`);
      add(`<label>Per-stratum sample</label><input type="number" id="inline_perStratum" min="1" max="${Math.floor(N/state.strataRows)}" value="${state.perStratum}">`);
    }
    if (state.mode === 'cluster') {
      add(`<label>Clusters across</label><input type="number" id="inline_cAcross" min="2" max="10" value="${state.clustersAcross}">`);
      add(`<label>Clusters down</label><input type="number" id="inline_cDown" min="2" max="10" value="${state.clustersDown}">`);
      add(`<label>Clusters to select</label><input type="number" id="inline_cPick" min="1" max="20" value="${state.clustersPick}">`);
    }
    if (state.mode === 'stratifiedCluster') {
      add(`<label>Strata (row bands)</label><input type="number" id="inline_scStrata" min="2" max="10" value="${state.strataRows}">`);
      add(`<label>Clusters across</label><input type="number" id="inline_scAcross" min="2" max="10" value="${state.clustersAcross}">`);
      add(`<label>Clusters down</label><input type="number" id="inline_scDown" min="2" max="10" value="${state.clustersDown}">`);
      add(`<label>Clusters per stratum</label><input type="number" id="inline_scPickPer" min="1" max="10" value="${state.sc_pickPerStratum}">`);
    }

    // listeners
    const byId = id => document.getElementById(id);
    if (byId('inline_n')) byId('inline_n').oninput = e => {
      state.n = +e.target.value;
      runCurrent();
      drawGuides();
    }
    if (byId('inline_k')) byId('inline_k').oninput = e => {
      state.k = +e.target.value;
      runCurrent();
      drawGuides();
    }
    if (byId('inline_strata')) byId('inline_strata').oninput = e => {
      state.strataRows = Math.max(2, +e.target.value | 0);
      runCurrent();
      drawGuides();
    }
    if (byId('inline_perStratum')) byId('inline_perStratum').oninput = e => {
      state.perStratum = Math.max(1, +e.target.value | 0);
      runCurrent();
      drawGuides();
    }
    if (byId('inline_cAcross')) byId('inline_cAcross').oninput = e => {
      state.clustersAcross = Math.max(2, +e.target.value | 0);
      runCurrent();
      drawGuides();
    }
    if (byId('inline_cDown')) byId('inline_cDown').oninput = e => {
      state.clustersDown = Math.max(2, +e.target.value | 0);
      runCurrent();
      drawGuides();
    }
    if (byId('inline_cPick')) byId('inline_cPick').oninput = e => {
      state.clustersPick = Math.max(1, +e.target.value | 0);
      runCurrent();
      drawGuides();
    }
    if (byId('inline_scStrata')) byId('inline_scStrata').oninput = e => {
      state.strataRows = Math.max(2, +e.target.value | 0);
      runCurrent();
      drawGuides();
    }
    if (byId('inline_scAcross')) byId('inline_scAcross').oninput = e => {
      state.clustersAcross = Math.max(2, +e.target.value | 0);
      runCurrent();
      drawGuides();
    }
    if (byId('inline_scDown')) byId('inline_scDown').oninput = e => {
      state.clustersDown = Math.max(2, +e.target.value | 0);
      runCurrent();
      drawGuides();
    }
    if (byId('inline_scPickPer')) byId('inline_scPickPer').oninput = e => {
      state.sc_pickPerStratum = Math.max(1, +e.target.value | 0);
      runCurrent();
      drawGuides();
    }
  }

  // Legend builder
  function setLegend(items) {
    legendEl.innerHTML = '';
    for (const it of items) {
      const chip = document.createElement('div');
      chip.className = 'chip';
      const sw = document.createElement('span');
      sw.className = 'sw';
      sw.style.background = it.color;
      chip.appendChild(sw);
      chip.appendChild(document.createTextNode(it.label));
      legendEl.appendChild(chip);
    }
  }

  // Mode runner
  function runCurrent() {
    const s = seedInput.value.trim();
    setSeed(s.length ? s : null);

    // Precompute systematic start once per run for consistency
    if (state.mode === 'systematic') {
      const k = Math.max(2, Math.floor(state.k));
      state.sysStart = Math.floor(state.rng() * k);
    } else {
      state.sysStart = null;
    }

    switch (state.mode) {
      case 'srs':
        runSRS();
        break;
      case 'systematic':
        runSystematic();
        break;
      case 'stratified':
        runStratified();
        break;
      case 'cluster':
        runCluster();
        break;
      case 'stratifiedCluster':
        runStratifiedCluster();
        break;
    }
    drawGuides();
    updatePills();
  }

  function updatePills() {
    if (!pillsEl) return;
    if (state.mode !== 'systematic') {
      pillsEl.hidden = true;
      pillsEl.innerHTML = '';
      return;
    }
    const k = Math.max(2, Math.floor(state.k));
    const r0 = (state.sysStart != null) ? state.sysStart : 0;
    const startLabel = r0 + 1; // 1-based for readability
    // Compute sampled count for systematic: indices r0, r0+k, ... < N
    const sampledCount = Math.max(0, Math.ceil((ROWS * COLS - r0) / k));
    pillsEl.hidden = false;
    pillsEl.innerHTML = `
      <span class="inline-pill">Start: <strong>${startLabel}</strong></span>
      <span class="inline-pill">k = <strong>${k}</strong></span>
      <span class="inline-pill">Sampled: <strong>${sampledCount}</strong></span>
    `;
  }

  // Top bar interactions
  document.getElementById('inlineRegenerate').addEventListener('click', runCurrent);
  guidesToggle.addEventListener('change', e => {
    state.showGuides = e.target.checked;
    drawGuides();
  });
  seedInput.addEventListener('change', runCurrent);

  // Listen to parent calculator updates
  function updateFromParent(samplingDesign, extractionMethod) {
    let newMode = 'srs';
    if (samplingDesign === 'no-stratification' && extractionMethod === 'systematic') {
      newMode = 'systematic';
    } else if (samplingDesign === 'stratified') {
      newMode = 'stratified';
    } else if (samplingDesign === 'cluster') {
      newMode = 'cluster';
    } else if (samplingDesign === 'stratified-cluster') {
      newMode = 'stratifiedCluster';
    }

    if (state.mode !== newMode) {
      // Reset systematic parameters when leaving systematic mode
      if (state.mode === 'systematic' && newMode !== 'systematic') {
        state.k = 10;
        state.sysStart = null;
      }
      state.mode = newMode;
      renderControls();
      runCurrent();
    }
  }

  // Download PNG
  document.getElementById('inlineDownload').addEventListener('click', () => {
    const first = gridEl.children[0].getBoundingClientRect();
    const second = gridEl.children[1].getBoundingClientRect();
    const dot = first.width;
    const gap = second.left - first.right;
    const colW = dot + gap,
      rowH = dot + gap;

    const pad = 24;
    const w = Math.round(COLS * colW + pad * 2);
    const h = Math.round(ROWS * rowH + pad * 2);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    const showStrata = state.mode === 'stratified' || state.mode === 'stratifiedCluster' || state.showGuides;
    if (showStrata) {
      const bandHrows = Math.floor(ROWS / state.strataRows) || 1;
      const bandColors = ['#E7F0FF', '#EAFBF3', '#FFF6E5', '#FDECF0'];
      for (let b = 0; b < state.strataRows; b++) {
        const y = pad + b * bandHrows * rowH;
        const height = Math.min((b + 1) * bandHrows, ROWS) * rowH - b * bandHrows * rowH;
        ctx.fillStyle = bandColors[b % bandColors.length];
        ctx.fillRect(pad, y, COLS * colW - gap, height - gap);
      }
    }

    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / COLS),
        c = i % COLS;
      const x = pad + c * colW,
        y = pad + r * rowH;
      const sampled = gridEl.children[i].classList.contains('sampled');
      ctx.fillStyle = sampled ? '#0067FF' : '#E6ECF5';
      ctx.strokeStyle = 'rgba(0,0,0,0)';
      ctx.beginPath();
      const rad = 6;
      roundRect(ctx, x, y, dot, dot, rad);
      ctx.fill();
    }

    const showClusters = state.mode === 'cluster' || state.mode === 'stratifiedCluster' || state.showGuides;
    if (showClusters) {
      const across = state.clustersAcross,
        down = state.clustersDown;
      const blockH = Math.floor(ROWS / down) || 1;
      const blockW = Math.floor(COLS / across) || 1;

      ctx.strokeStyle = 'rgba(51,65,85,.25)';
      ctx.lineWidth = 2;
      for (let r = 0; r <= ROWS; r += blockH) {
        const y = pad + r * rowH - 6;
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(pad + COLS * colW - gap, y);
        ctx.stroke();
      }
      for (let c = 0; c <= COLS; c += blockW) {
        const x = pad + c * colW - 6;
        ctx.beginPath();
        ctx.moveTo(x, pad);
        ctx.lineTo(x, pad + ROWS * rowH - gap);
        ctx.stroke();
      }
    }

    const link = document.createElement('a');
    link.download = `sampling-${state.mode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  function roundRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Init
  renderControls();
  runCurrent();

  // Expose update function globally so main calculator can call it
  window.updateInlineVisualizer = updateFromParent;
}

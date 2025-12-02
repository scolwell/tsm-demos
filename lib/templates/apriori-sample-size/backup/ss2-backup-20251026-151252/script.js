class SampleSizeEstimator {
  constructor() {
    this.initializeElements();
    this.bindEvents();
    this.initializeCharts();
    this.updateCalculations();
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
    this.powerCtx = this.powerChart.getContext('2d');
    this.samplingCtx = this.samplingVisualization.getContext('2d');

  // Ensure sampling canvas matches its container size
  this.resizeSamplingCanvas();

    // Build custom select UI for test type
    this.setupCustomSelect(this.testTypeSelect);

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

  // Collapsible controls for design params panel and advanced sections
  this.toggleDesignParamsBtn = document.getElementById('toggleDesignParams');
  this.clusterAdvancedToggle = document.getElementById('clusterAdvancedToggle');
  this.clusterAdvanced = document.getElementById('clusterAdvanced');
  this.scAdvancedToggle = document.getElementById('scAdvancedToggle');
  this.scAdvanced = document.getElementById('scAdvanced');
  this.stratAdvancedToggle = document.getElementById('stratAdvancedToggle');
  this.stratAdvanced = document.getElementById('stratAdvanced');

  // Population (Finite Population Correction) controls
  this.usePopulationToggle = document.getElementById('usePopulation');
  this.populationOptionsPanel = document.getElementById('populationOptions');
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

    // Code language state
    this.currentCodeLang = 'r';

    // Visualization options and placeholder (removed view mode toggle and checkboxes)
    this.vizInterpretationSelect = document.getElementById('vizInterpretation');
  this.vizInterpretationText = document.getElementById('vizInterpretationText');
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

    // Code actions
    document.getElementById('copyCode').addEventListener('click', () => {
      this.copyCode();
    });

    document.getElementById('downloadCode').addEventListener('click', () => {
      this.downloadCode();
    });

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
    // Visualization options bindings (removed view mode toggle and checkboxes)
    if (this.vizInterpretationSelect) {
      this.vizInterpretationSelect.addEventListener('change', () => {
        const val = this.vizInterpretationSelect.value;
        const opt = (this.vizInterpretationData || []).find(o => o.value === val);
        if (this.vizInterpretationText) this.vizInterpretationText.textContent = opt ? opt.text : '';
      });
    }
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
    // Population (FPC) bindings
    if (this.usePopulationToggle) {
      this.usePopulationToggle.addEventListener('change', () => {
        const enabled = !!this.usePopulationToggle.checked;
        this.currentValues.populationEnabled = enabled;
        if (this.populationOptionsPanel) {
          if (enabled) this.populationOptionsPanel.removeAttribute('hidden');
          else this.populationOptionsPanel.setAttribute('hidden', '');
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
          }
        }
        this.updateCalculations();
      });
    }
    if (this.populationSizeInput) {
      this.populationSizeInput.addEventListener('input', () => {
        const n = parseInt(this.populationSizeInput.value, 10);
        this.currentValues.populationSize = Number.isFinite(n) && n > 0 ? n : null;
        this.updateCalculations();
      });
    }
    // Handle responsive resizing for sampling visualization
    window.addEventListener('resize', () => {
      this.resizeSamplingCanvas();
      this.updateSamplingVisualization();
    });
    // Interpretation accordion toggle
    const interp = document.querySelector('.interpretation');
    const interpToggle = document.querySelector('.interpretation-toggle');
    if (interp && interpToggle) {
      interpToggle.addEventListener('click', () => {
        const isOpen = interp.classList.toggle('open');
        interpToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        const content = document.querySelector('.interpretation-content');
        if (content) {
          content.style.display = isOpen ? 'block' : 'none';
        }
      });
    }

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
              this.codeLangDescription.textContent = 'Copy this code to reproduce the analysis in R or Python. Perfect for learning and integration into your workflow.';
            } else {
              this.codeLangDescription.textContent = 'Copy this code to reproduce the analysis in Python (statsmodels). Perfect for learning and integration into your workflow.';
            }
          }
        });
      });
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
    const { effectSize, statisticalPower, significanceLevel, testDirection } = this.currentValues;
    
    // Simplified sample size calculation for demonstration
    // In reality, this would use proper statistical formulas
    const alpha = significanceLevel;
    const beta = 1 - statisticalPower;
    const tails = testDirection === 'two-tailed' ? 2 : 1;
    
    // Z-scores (approximation)
    const zAlpha = this.getZScore(alpha / tails);
    const zBeta = this.getZScore(beta);
    
    // Basic formula: n = 2 * ((z_alpha + z_beta) / effect_size)^2
    const baseSampleSize = 2 * Math.pow((zAlpha + zBeta) / effectSize, 2);

    // Do not apply design effect to required N (used only for visualization)
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
      achievedPower: this.calculateAchievedPower(nFinal),
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

    // Update interpretation text
    this.updateInterpretation(results);
    
    // Notify iframe visualizer of sampling changes
    this.notifyVisualizerIframe();
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
    
    designInfo.innerHTML = `<strong>Current Design:</strong> With N = ${results.sampleSize}, you have ${(results.achievedPower * 100).toFixed(1)}% power to detect an effect size of ${this.currentValues.effectSize.toFixed(2)} at α = ${this.currentValues.significanceLevel}.`;
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

  updateInterpretation(results) {
    const content = document.querySelector('.interpretation-content');
    if (!content) return;
    const effect = this.currentValues.effectSize.toFixed(2);
    const powerPct = Math.round(results.achievedPower * 100);
    content.innerHTML = `
      <p><strong>Total Sample Size (${results.sampleSize}):</strong> This is the total number of participants you need to recruit for your study.</p>
      <p><strong>Achieved Power (${powerPct}%):</strong> With this sample size, you have a ${powerPct}% chance of detecting a true effect of size ${effect}.</p>
      <p><strong>Effect Size (${effect}):</strong> The magnitude of the difference you expect to detect (Cohen's d). Larger values mean bigger expected differences.</p>
    `;
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
    if (this.usePopulationToggle && this.populationOptionsPanel) {
      this.usePopulationToggle.checked = !!this.currentValues.populationEnabled;
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
    if (panelShouldShow) this.designParamsPanel.removeAttribute('hidden');
    else this.designParamsPanel.setAttribute('hidden', '');
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

  // Mark that the user has interacted and hide the placeholder if visible
  markInteracted() {
    if (this.vizState && !this.vizState.hasInteracted) {
      this.vizState.hasInteracted = true;
      if (this.vizPlaceholder) this.vizPlaceholder.style.display = 'none';
    }
  }

  updatePowerChart() {
    const ctx = this.powerCtx;
    const width = this.powerChart.width;
    const height = this.powerChart.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Chart dimensions
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Draw axes
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.stroke();
    
    // Draw grid lines and labels
    ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';
    
    // Y-axis labels (power)
    for (let i = 0; i <= 10; i++) {
      const y = height - margin.bottom - (i / 10) * chartHeight;
      const power = i / 10;
      
      ctx.fillText(power.toFixed(1), margin.left - 10, y + 3);
      
      if (i > 0) {
        ctx.strokeStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(width - margin.right, y);
        ctx.stroke();
      }
    }
    
    // X-axis labels (sample size)
    ctx.textAlign = 'center';
    for (let i = 0; i <= 10; i++) {
      const x = margin.left + (i / 10) * chartWidth;
      const sampleSize = 10 + (i / 10) * 200; // 10 to 210
      
      if (i % 2 === 0) {
        ctx.fillText(Math.round(sampleSize).toString(), x, height - margin.bottom + 15);
      }
    }
    
    // Draw power curve
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i <= chartWidth; i += 2) {
      const sampleSize = 10 + (i / chartWidth) * 200;
      const power = this.calculatePowerForSampleSize(sampleSize);
      const x = margin.left + i;
      const y = height - margin.bottom - power * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw target line (80%)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    const targetY = height - margin.bottom - 0.8 * chartHeight;
    ctx.beginPath();
    ctx.moveTo(margin.left, targetY);
    ctx.lineTo(width - margin.right, targetY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw current point
    const currentResults = this.calculateSampleSize();
    const currentX = margin.left + ((currentResults.sampleSize - 10) / 200) * chartWidth;
    const currentY = height - margin.bottom - currentResults.achievedPower * chartHeight;
    
    ctx.fillStyle = '#4f46e5';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 4, 0, 2 * Math.PI);
    ctx.fill();
  }

  calculatePowerForSampleSize(sampleSize) {
    const { effectSize } = this.currentValues;
    const effectiveSampleSize = sampleSize; // no DEFF adjustment on curve
    
    // Simplified power calculation
    const power = Math.min(0.99, Math.max(0.05, 
      0.5 + (effectSize * Math.sqrt(effectiveSampleSize / 2) - 1.96) / 4
    ));
    
    return power;
  }

  updateSamplingVisualization() {
    const ctx = this.samplingCtx;
    const width = this.samplingVisualization.width;
    const height = this.samplingVisualization.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Grid configuration: compute optimal grid to fit canvas
    let dotDiameter = 10; // default circle diameter
    let gap = 6; // default gap
    let cell = dotDiameter + gap; // center-to-center
    const margin = 16; // inner margin inside container

    // Compute grid to fit canvas with default sizing
    const cols = Math.max(1, Math.floor((width - margin * 2) / cell));
    const rows = Math.max(1, Math.floor((height - margin * 2) / cell));
    const totalPopulation = cols * rows;
    // Desired sample size from current results (cap by population)
    const results = this.calculateSampleSize();
    const desiredSample = Math.max(1, Math.min(results.sampleSize, totalPopulation));
    const startX = margin + ((width - margin * 2) - (cols - 1) * cell) / 2;
    const startY = margin + ((height - margin * 2) - (rows - 1) * cell) / 2;
    // Update badges
    const popBadge = document.getElementById('populationBadge');
    const sampBadge = document.getElementById('sampleBadge');
    if (popBadge) popBadge.textContent = `Population: N = ${totalPopulation}`;
    if (sampBadge) sampBadge.textContent = `Sample: n = ${desiredSample}`;
    // Update Sample Notes under Interpretation
    const notesWrap = document.getElementById('vizNotes');
    const notesList = document.getElementById('vizNotesList');
    if (notesWrap && notesList) {
      const notes = [];
      let N = null;
      if (this.currentValues.populationEnabled) {
        const nParsed = parseInt(this.populationSizeInput?.value || this.currentValues.populationSize, 10);
        if (Number.isFinite(nParsed)) N = nParsed;
      }
      if (Number.isFinite(N) && N > 800) {
        notes.push('Visualizer shows up to 800 units for demonstration; calculations use your N.');
      }
      // Render notes
      notesList.innerHTML = notes.map(t => `<li>${t}</li>`).join('');
      if (notes.length) notesWrap.removeAttribute('hidden'); else notesWrap.setAttribute('hidden', '');
    }
    
    // Sampling helpers
    const idxToRC = (idx) => ({ r: Math.floor(idx / cols), c: idx % cols });
    const rcToIdx = (r, c) => r * cols + c;
    const pickRandom = (arr, k) => {
      const a = arr.slice();
      const n = Math.min(k, a.length);
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a.slice(0, n);
    };

    const design = this.currentValues.samplingDesign;
    // Determine strata configuration up front for consistent summaries
    let S = 1;
    if (design === 'stratified' || design === 'stratified-cluster') {
      S = Math.max(2, Math.min(10, parseInt(this.numStrata?.value) || 4));
    }
    // Build strata bounds that split rows as evenly as possible
    const strataBounds = (() => {
      const bounds = [];
      const base = Math.floor(rows / S);
      const rem = rows % S;
      let start = 0;
      for (let s = 0; s < S; s++) {
        const h = (S === 1) ? rows : (base + (s < rem ? 1 : 0));
        const end = Math.min(rows, start + h);
        bounds.push([start, end]);
        start = end;
      }
      return bounds;
    })();
    // Fast lookup from row -> stratum id (for summaries)
    const rowToStratum = (() => {
      const map = new Array(rows).fill(0);
      for (let s = 0; s < strataBounds.length; s++) {
        const [rs, re] = strataBounds[s];
        for (let r = rs; r < re; r++) map[r] = s;
      }
      return map;
    })();
    let selected = new Set();
    // Group mapping and color palette
    const palettePairs = () => {
      return [
        { base: '#e2e8f0', sel: '#64748b' }, // slate
        { base: '#dbeafe', sel: '#3b82f6' }, // blue
        { base: '#dcfce7', sel: '#22c55e' }, // green
        { base: '#fef3c7', sel: '#f59e0b' }, // amber
        { base: '#f3e8ff', sel: '#8b5cfb' }, // purple
        { base: '#ffe4e6', sel: '#f43f5e' }, // rose
        { base: '#ccfbf1', sel: '#14b8a6' }, // teal
        { base: '#e0e7ff', sel: '#6366f1' }, // indigo
      ];
    };
    const pairs = palettePairs();
    const groupOfIndex = new Array(totalPopulation).fill(0);
    const groupBase = [];
    const groupSel = [];

    // Prepare legend meta
    const groupLegendEl = document.getElementById('groupLegend');
    if (groupLegendEl) groupLegendEl.innerHTML = '';
    const legendItems = [];

  if (design === 'no-stratification') {
      // Single group
    // Use slate for population and vivid blue for sampled units
    groupBase[0] = pairs[0].base; groupSel[0] = pairs[1].sel;
      const method = this.currentValues.extractionMethod || 'simple-random';
      if (method === 'systematic') {
        // Systematic (fractional interval): k = N/n
        // Pick a random fractional start r in [0, k), then select indices floor(r + i*k) for i=0..n-1
        // This preserves near-constant spacing without duplicates and guarantees exactly n selections.
        const k = totalPopulation / desiredSample;
        const r = Math.random() * k; // fractional start in [0, k)
        for (let i = 0; i < desiredSample; i++) {
          const idx = Math.floor(r + i * k);
          // idx is guaranteed 0 <= idx < N when i in [0, n-1]
          selected.add(idx);
        }
      } else {
        // Simple random sample (default)
        const all = Array.from({ length: totalPopulation }, (_, i) => i);
        pickRandom(all, desiredSample).forEach(i => selected.add(i));
      }
    } else if (design === 'stratified') {
      // Split rows into strata bands and sample proportionally (largest remainder)
      for (let s = 0; s < S; s++) { const p = pairs[s % pairs.length]; groupBase[s] = p.base; groupSel[s] = p.sel; }
      // Background bands per stratum (always show)
      let rowStart = 0;
      for (let s = 0; s < S; s++) {
        const [rs, re] = strataBounds[s];
        const rowEnd = re;
        const top = startY + rowStart * cell - (dotDiameter / 2);
        const heightPx = (rowEnd - rowStart) * cell + dotDiameter;
        const color = groupBase[s];
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = color;
        ctx.fillRect(margin, top, width - margin * 2, heightPx);
        ctx.restore();
        rowStart = rowEnd;
      }
      // Determine targets per stratum using equal or proportional allocation
      // Determine if custom percentages are enabled
      const useCustom = !!(this.stratCustomAllocToggle && this.stratCustomAllocToggle.checked);
      let useEqual = false;
      if (!useCustom && this.strataAllocMode) {
        const act = this.strataAllocMode.querySelector('.segment.active');
        useEqual = act && act.dataset.mode === 'equal';
      }
      let baseTargets;
      if (useCustom) {
        // Read percentages, normalize to 100, then allocate by largest remainder
        const pcts = [];
        if (this.stratAllocRows) {
          const inputs = this.stratAllocRows.querySelectorAll('input[type="number"]');
          inputs.forEach(inp => pcts.push(parseFloat(inp.value) || 0));
        }
        const sum = pcts.reduce((a,b)=>a+b,0);
        const norm = sum > 0 ? pcts.map(x => x * (100 / sum)) : Array(S).fill(100 / S);
        const exact = norm.map(x => desiredSample * (x / 100));
        baseTargets = exact.map(x => Math.floor(x));
        let rem = desiredSample - baseTargets.reduce((a,b)=>a+b,0);
        const order = exact.map((x,i)=>({i,frac:x - Math.floor(x)})).sort((a,b)=>b.frac - a.frac);
        for (let k = 0; k < rem; k++) baseTargets[order[k].i]++;
      } else if (useEqual) {
        // Equal allocation: n/S per stratum (largest remainder)
        const perStratum = desiredSample / S;
        baseTargets = Array(S).fill(Math.floor(perStratum));
        let rem = desiredSample - baseTargets.reduce((a, b) => a + b, 0);
        for (let k = 0; k < rem; k++) baseTargets[k % S]++;
      } else {
        // Proportional allocation (default)
        const bandCellsArr = strataBounds.map(([rs, re]) => (re - rs) * cols);
        const totalCells = rows * cols;
        const exactTargets = bandCellsArr.map(c => desiredSample * (c / totalCells));
        baseTargets = exactTargets.map(x => Math.floor(x));
        let remainder = desiredSample - baseTargets.reduce((a, b) => a + b, 0);
        const order = exactTargets.map((x, i) => ({ i, frac: x - Math.floor(x) }))
          .sort((a, b) => b.frac - a.frac);
        for (let k = 0; k < remainder; k++) baseTargets[order[k].i]++;
      }
      // Now sample within each band
      for (let s = 0; s < S; s++) {
        const [rs, re] = strataBounds[s];
        const bandTarget = baseTargets[s];
        const bandIndices = [];
        for (let r = rs; r < re; r++) {
          for (let c = 0; c < cols; c++) bandIndices.push(rcToIdx(r, c));
        }
        // Assign group id by stratum
        for (const idx of bandIndices) groupOfIndex[idx] = s;
        pickRandom(bandIndices, bandTarget).forEach(i => selected.add(i));
      }
      // Legend items for strata
      for (let s = 0; s < S; s++) legendItems.push({ label: `S${s + 1}`, color: groupSel[s] });
  } else if (design === 'cluster' || design === 'stratified-cluster') {
      // Cluster tiles across grid; optionally within strata bands
      const useStrata = (design === 'stratified-cluster');
      // Determine target clusters and tile size
      const targetClusters = useStrata ? (parseInt(this.sc_numClusters?.value) || 0) : (parseInt(this.numClusters?.value) || 0);
      let tileH, tileW;
      if (targetClusters > 0) {
        const area = totalPopulation / targetClusters; // ideal cells per cluster
        tileH = Math.max(1, Math.round(Math.sqrt(area * rows / cols)));
        tileW = Math.max(1, Math.round(area / tileH));
      } else {
        // Fallback to nominal area ~25 if not specified
        const area = 25;
        tileH = Math.max(1, Math.round(Math.sqrt(area * rows / cols)));
        tileW = Math.max(1, Math.round(area / tileH));
      }
      const totalCells = rows * cols;
      // Determine targets per stratum using equal or proportional allocation (if using strata)
      const useCustom = useStrata && this.sc_stratCustomAllocToggle && this.sc_stratCustomAllocToggle.checked;
      let useEqual = false;
      if (useStrata && !useCustom && this.sc_strataAllocMode) {
        const act = this.sc_strataAllocMode.querySelector('.segment.active');
        useEqual = act && act.dataset.mode === 'equal';
      }
      let baseTargets = null;
      if (useStrata) {
        if (useCustom) {
          const pcts = [];
          if (this.sc_stratAllocRows) {
            const inputs = this.sc_stratAllocRows.querySelectorAll('input[type="number"]');
            inputs.forEach(inp => pcts.push(parseFloat(inp.value) || 0));
          }
          const sum = pcts.reduce((a,b)=>a+b,0);
          const norm = sum > 0 ? pcts.map(x => x * (100 / sum)) : Array(S).fill(100 / S);
          const exact = norm.map(x => desiredSample * (x / 100));
          baseTargets = exact.map(x => Math.floor(x));
          let rem = desiredSample - baseTargets.reduce((a,b)=>a+b,0);
          const order = exact.map((x,i)=>({i,frac:x - Math.floor(x)})).sort((a,b)=>b.frac - a.frac);
          for (let k = 0; k < rem; k++) baseTargets[order[k].i]++;
        } else if (useEqual) {
          // Equal allocation: n/S per stratum
          const perStratum = desiredSample / S;
          baseTargets = Array(S).fill(Math.floor(perStratum));
          let rem = desiredSample - baseTargets.reduce((a, b) => a + b, 0);
          for (let k = 0; k < rem; k++) baseTargets[k % S]++;
        } else {
          // Proportional allocation
          const bandCellsArr = strataBounds.map(([rs, re]) => (re - rs) * cols);
          const exactTargets = bandCellsArr.map(c => desiredSample * (c / totalCells));
          baseTargets = exactTargets.map(x => Math.floor(x));
          let rem = desiredSample - baseTargets.reduce((a, b) => a + b, 0);
          const ord = exactTargets.map((x, i) => ({ i, frac: x - Math.floor(x) }))
            .sort((a, b) => b.frac - a.frac);
          for (let k = 0; k < rem; k++) baseTargets[ord[k].i]++;
        }
      }
      let clusterId = 0;
  let totalClusters = 0;
  strataBounds.forEach(([rs, re], si) => {
        const bandTarget = useStrata ? baseTargets[si] : desiredSample;
        // Build clusters in this band
        const clusters = [];
        for (let r = rs; r < re; r += tileH) {
          for (let c = 0; c < cols; c += tileW) {
            const members = [];
            for (let rr = r; rr < Math.min(re, r + tileH); rr++) {
              for (let cc = c; cc < Math.min(cols, c + tileW); cc++) {
                members.push(rcToIdx(rr, cc));
              }
            }
            clusters.push(members);
          }
        }
        // Assign a color pair per cluster
        const localColors = clusters.map((_, k) => pairs[(clusterId + k) % pairs.length]);
        clusters.forEach((cl, k) => {
          const gid = clusterId + k;
          groupBase[gid] = localColors[k].base;
          groupSel[gid] = localColors[k].sel;
          for (const idx of cl) groupOfIndex[idx] = gid;
        });
        totalClusters += clusters.length;
        // Grid lines for clusters (always show)
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'; // slate-400 @ 30%
        ctx.lineWidth = 1;
        // Vertical lines
        for (let c = 0; c <= cols; c += tileW) {
          const x = startX + c * cell - (cell / 2);
          ctx.beginPath();
          ctx.moveTo(x, startY + rs * cell - (cell / 2));
          ctx.lineTo(x, startY + re * cell - (cell / 2));
          ctx.stroke();
        }
        // Horizontal lines
        for (let r = rs; r <= re; r += tileH) {
          const y = startY + r * cell - (cell / 2);
          ctx.beginPath();
          ctx.moveTo(startX - (cell / 2), y);
          ctx.lineTo(startX + cols * cell - (cell / 2), y);
          ctx.stroke();
        }
        ctx.restore();
        // Shuffle clusters and select until reaching bandTarget
        const shuffled = pickRandom(clusters, clusters.length);
        let count = 0;
        for (const cl of shuffled) {
          if (count >= bandTarget) break;
          if (count + cl.length <= bandTarget) {
            cl.forEach(i => selected.add(i));
            count += cl.length;
          } else {
            // Partially take from last cluster to hit exact target
            pickRandom(cl, bandTarget - count).forEach(i => selected.add(i));
            count = bandTarget;
          }
        }
        clusterId += clusters.length;
      });
      // Update estimated average cluster size fields
      const mEst = totalClusters > 0 ? Math.round((totalPopulation / totalClusters) * 10) / 10 : null;
      if (mEst) {
        if (!useStrata && this.clusterMEst) this.clusterMEst.value = String(mEst);
        if (useStrata && this.sc_clusterMEst) this.sc_clusterMEst.value = String(mEst);
      }
      // Legend items for clusters: sample up to 6 selected groups
      const selectedGroups = new Set([...selected].map(i => groupOfIndex[i] || 0));
      const ids = Array.from(selectedGroups).slice(0, 6);
      ids.forEach((gid, i) => legendItems.push({ label: `C${i + 1}`, color: groupSel[gid] }));
    }
    
    // Draw grid as circles (always show both population and sample)
    for (let i = 0; i < totalPopulation; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = startX + col * cell;
      const y = startY + row * cell;
      const gid = groupOfIndex[i] || 0;
      const isSelected = selected.has(i);
      if (isSelected) {
        ctx.fillStyle = groupSel[gid] || '#005EE9';
      } else {
        ctx.fillStyle = groupBase[gid] || '#e2e8f0';
      }
      ctx.beginPath();
      ctx.arc(x, y, dotDiameter / 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Render dynamic group legend
    if (groupLegendEl) {
      if (legendItems.length) {
        legendItems.forEach(item => {
          const el = document.createElement('div');
          el.className = 'legend-item';
          const dot = document.createElement('div');
          dot.className = 'legend-dot';
          dot.style.background = item.color;
          el.appendChild(dot);
          const span = document.createElement('span');
          span.textContent = item.label;
          el.appendChild(span);
          groupLegendEl.appendChild(el);
        });
        groupLegendEl.style.display = 'flex';
      } else {
        groupLegendEl.style.display = 'none';
      }
    }

    // Update params summary (includes m estimates for cluster layouts)
    this.updateParamsSummary(totalPopulation, design);

    // Build a compact hierarchy summary and render tree with correct nesting
    const summary = { design, totalPopulation, desiredSample };
    // Prepare by-stratum and by-cluster-in-stratum counts
    const popByStratum = Array.from({ length: S }, () => 0);
    const sampByStratum = Array.from({ length: S }, () => 0);
    const popByStratumCluster = Array.from({ length: S }, () => ({}));
    const sampByStratumCluster = Array.from({ length: S }, () => ({}));
    for (let i = 0; i < totalPopulation; i++) {
      const r = Math.floor(i / cols);
      const sId = rowToStratum[r] ?? 0;
      popByStratum[sId]++;
      if (selected.has(i)) sampByStratum[sId]++;
      const gid = groupOfIndex[i];
      if (gid !== undefined && gid !== null) {
        popByStratumCluster[sId][gid] = (popByStratumCluster[sId][gid] || 0) + 1;
        if (selected.has(i)) sampByStratumCluster[sId][gid] = (sampByStratumCluster[sId][gid] || 0) + 1;
      }
    }

    if (design === 'no-stratification') {
      // No deeper structure
    } else if (design === 'stratified') {
      summary.strata = [];
      for (let sId = 0; sId < S; sId++) {
        summary.strata.push({ label: `S${sId + 1}`, pop: popByStratum[sId], samp: sampByStratum[sId] });
      }
    } else if (design === 'cluster') {
      // Single stratum S=1, enumerate clusters by gid
      const map = popByStratumCluster[0];
      const gids = Object.keys(map).map(x => parseInt(x, 10)).sort((a,b)=>a-b);
      summary.clusters = gids.map((gid, i) => ({ label: `C${i + 1}`, pop: map[gid] || 0, samp: (sampByStratumCluster[0][gid] || 0) }));
    } else if (design === 'stratified-cluster') {
      summary.strata = [];
      for (let sId = 0; sId < S; sId++) {
        const map = popByStratumCluster[sId];
        const gids = Object.keys(map).map(x => parseInt(x, 10)).sort((a,b)=>a-b);
        const clusters = gids.map((gid, i) => ({ label: `C${i + 1}`, pop: map[gid] || 0, samp: (sampByStratumCluster[sId][gid] || 0) }));
        summary.strata.push({ label: `S${sId + 1}`, pop: popByStratum[sId], samp: sampByStratum[sId], clusters });
      }
    }
    this.vizSummary = summary;
    // Update interpretation dropdown with context-aware options
    this.updateVizInterpretationOptions({ totalPopulation, desiredSample });
    // Tree view removed from UI; render functions will no-op if elements are absent
    if (this.treeView === 'diagram') { this.renderSamplingTreeSvg(); } else { this.renderSamplingTree(); }
  }

  updateVizInterpretationOptions(meta = {}) {
    if (!this.vizInterpretationSelect || !this.vizInterpretationText) return;
    const { totalPopulation = 0, desiredSample = 0 } = meta;
    const design = this.currentValues.samplingDesign;
    const method = this.currentValues.extractionMethod || 'simple-random';

    const options = [];
    options.push({
      value: 'overview',
      label: 'Overview',
      text: `Blue dots are sampled units (n=${desiredSample}); gray dots are the population (N=${totalPopulation}). Use the view options to show population, sample, or both.`
    });

    if (design === 'no-stratification' && method === 'systematic') {
      const k = totalPopulation && desiredSample ? (totalPopulation / desiredSample) : 0;
      options.push({
        value: 'systematic',
        label: 'Systematic sampling pattern',
        text: `Systematic sampling selects every k-th unit with k ≈ ${k.toFixed(2)} and a random fractional start. Indices are floor(r + i·k), producing regular spacing across the frame.`
      });
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
      options.push({
        value: 'strata',
        label: 'Stratified allocation',
        text: `Colored bands represent strata. Sampling uses ${allocText}, with largest-remainder rounding to hit the exact target n.`
      });
    }

    if (design === 'cluster' || design === 'stratified-cluster') {
      options.push({
        value: 'cluster',
        label: 'Cluster sampling',
        text: `The grid shows contiguous clusters (tiles). Sampling is by clusters; within a cluster, observations are correlated (ICC). The design effect is shown for context but does not change n in this visualization.`
      });
    }

    const prev = this.vizInterpretationSelect.value;
    this.vizInterpretationSelect.innerHTML = options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
    const chosen = options.find(o => o.value === prev) ? prev : (options[0] ? options[0].value : '');
    this.vizInterpretationSelect.value = chosen;
    const chosenOpt = options.find(o => o.value === chosen);
    this.vizInterpretationText.textContent = chosenOpt ? chosenOpt.text : '';
    this.vizInterpretationData = options;
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
      'systematic': 'Systematic'
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
        const info = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>';
        parts.push(`<span class="summary-hint" title="Using default ICC of 0.05 (set in Advanced)">${info} ICC 0.05</span>`);
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
        const info = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>';
        parts.push(`<span class=\"summary-hint\" title=\"Using default ICC of 0.05 (set in Advanced)\">${info} ICC 0.05</span>`);
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

  generateRCode() {
    const { effectSize, statisticalPower, significanceLevel, testDirection } = this.currentValues;
    const results = this.calculateSampleSize();
    
    return `# Sample Size Analysis
# Generated by Sample Size Estimator

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
  type = "${this.currentValues.testType.replace('-', '.')}"
)

# Display results
print(result)

# Current analysis results (UI approximation):
# Sample size needed: ${results.sampleSize}
# Achieved power: ${(results.achievedPower * 100).toFixed(1)}%

# Visualize power curve
sample_sizes <- seq(10, 200, by = 5)
powers <- sapply(sample_sizes, function(n) {
  pwr.t.test(n = n, d = effect_size, sig.level = alpha, 
             alternative = alternative, type = "${this.currentValues.testType.replace('-', '.')}")$power
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

    return `# Sample Size Analysis (Python)
# Generated by Sample Size Estimator

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
# Achieved power: ${(results.achievedPower * 100).toFixed(1)}%
`;
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
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new SampleSizeEstimator();
  
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
    captionEl.innerHTML = `In <span class="inline-strong">Systematic Sampling</span>, a random start is chosen, then every <span class="inline-strong">k</span>-th unit is selected (k = ${k}).`;
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

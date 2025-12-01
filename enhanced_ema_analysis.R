# =====================================================
# ENHANCED EMA ANALYSIS WITH IMPROVEMENTS
# =====================================================

# Quick package loading (run this first)
library(dplyr)
library(ggplot2) 
library(lme4)
library(sjPlot)
library(tidyr)
library(gridExtra)
library(grid)
library(performance)
library(sjstats)
library(knitr)
library(broom.mixed)
library(tibble)
library(viridis)  # Added missing package

# Check if all packages loaded successfully
cat("All packages loaded successfully!\n")

# =====================================================
# IMPROVED DATA SIMULATION
# =====================================================
simulate_ema_data <- function(n_id = 100, n_time = 50, seed = 123) {
  set.seed(seed)
  
  # Create individual-level characteristics
  individuals <- tibble(
    id = factor(1:n_id),
    # Between-person traits
    stress_trait = rnorm(n_id, mean = 3, sd = 0.7),
    baseline_mood = rnorm(n_id, mean = 60, sd = 8),
    # Individual slope tendency
    slope_tendency = rnorm(n_id, mean = 0.02, sd = 0.05)
  )
  
  # Create time series data
  ema <- expand.grid(id = 1:n_id, time = 1:n_time) %>%
    mutate(id = factor(id)) %>%
    left_join(individuals, by = "id") %>%
    group_by(id) %>%
    mutate(
      # Time-varying stress with autocorrelation
      stress_noise = arima.sim(model = list(ar = 0.3), n = n_time),
      stress = pmax(1, pmin(5, stress_trait + stress_noise + time*0.005)),
      
      # Mood with individual differences and quadratic trend
      mood_trend = baseline_mood + slope_tendency * time + 
                   rnorm(1, 0, 0.02) * time^2,  # slight quadratic component
      mood = mood_trend - 3*stress + rnorm(n_time, 0, 3),
      
      # Ensure mood is within reasonable bounds
      mood = pmax(0, pmin(100, mood))
    ) %>%
    ungroup() %>%
    select(id, time, stress, mood, stress_trait, baseline_mood)
  
  return(ema)
}

# Generate data
ema <- simulate_ema_data()

# =====================================================
# IMPROVED VISUALIZATION FUNCTIONS
# =====================================================

# Function to create spaghetti plot
plot_trajectories <- function(data, sample_n = NULL, title = "Individual Trajectories") {
  if (!is.null(sample_n)) {
    sampled_ids <- sample(unique(data$id), sample_n)
    data <- data %>% filter(id %in% sampled_ids)
    title <- paste(title, "(Sample of", sample_n, "participants)")
  }
  
  ggplot(data, aes(x = time, y = mood, group = id)) +
    geom_line(alpha = 0.3, color = "steelblue") +
    geom_smooth(aes(group = 1), method = "loess", se = TRUE, 
                color = "red", linewidth = 1.2) +
    labs(title = title,
         x = "Time (prompt)", 
         y = "Mood (0–100)") +
    theme_minimal() +
    theme(plot.title = element_text(size = 14, hjust = 0.5))
}

# Enhanced trajectory classification
classify_trajectories <- function(data, method = "quantile") {
  slopes <- data %>%
    group_by(id) %>%
    summarise(
      slope = coef(lm(mood ~ time))[2],
      intercept = coef(lm(mood ~ time))[1],
      r_squared = summary(lm(mood ~ time))$r.squared,
      .groups = "drop"
    )
  
  if (method == "quantile") {
    slopes <- slopes %>%
      mutate(trajectory_group = case_when(
        slope < quantile(slope, 0.33, na.rm = TRUE) ~ "Declining",
        slope > quantile(slope, 0.67, na.rm = TRUE) ~ "Improving", 
        TRUE ~ "Stable"
      ))
  } else if (method == "cutoff") {
    slopes <- slopes %>%
      mutate(trajectory_group = case_when(
        slope < -0.05 ~ "Declining",
        slope > 0.05 ~ "Improving",
        TRUE ~ "Stable"
      ))
  }
  
  return(slopes)
}

# =====================================================
# ANALYSIS WORKFLOW
# =====================================================

# 1. Initial visualization
p1 <- plot_trajectories(ema, sample_n = 50)
print(p1)

# 2. Classify trajectories
slopes_data <- classify_trajectories(ema, method = "quantile")
ema_classified <- ema %>% left_join(slopes_data, by = "id")

# 3. Plot by trajectory groups
p2 <- ggplot(ema_classified, aes(x = time, y = mood, group = id, color = trajectory_group)) +
  geom_line(alpha = 0.4) +
  facet_wrap(~ trajectory_group, ncol = 3) +
  geom_smooth(aes(group = trajectory_group), method = "lm", se = TRUE, linewidth = 1.2) +
  labs(title = "Mood Trajectories by Classification Group",
       x = "Time (prompt)", y = "Mood (0–100)",
       color = "Trajectory Type") +
  theme_minimal() +
  theme(legend.position = "bottom",
        strip.text = element_text(size = 12, face = "bold"))

print(p2)

# =====================================================
# IMPROVED MIXED-EFFECTS MODELING
# =====================================================

# Center time variable
ema <- ema %>% mutate(time_c = scale(time, scale = FALSE)[,1])

# Fit models with increasing complexity
models <- list(
  # Random intercepts only
  model1 = lmer(mood ~ time_c + (1 | id), data = ema),
  
  # Random intercepts and slopes
  model2 = lmer(mood ~ time_c + (time_c | id), data = ema),
  
  # Add quadratic term
  model3 = lmer(mood ~ time_c + I(time_c^2) + (time_c | id), data = ema),
  
  # Add stress as predictor
  model4 = lmer(mood ~ time_c + I(time_c^2) + stress + (time_c | id), data = ema)
)

# Compare models
model_comparison <- tibble(
  Model = names(models),
  AIC = sapply(models, AIC),
  BIC = sapply(models, BIC),
  LogLik = sapply(models, function(x) as.numeric(logLik(x)))
) %>%
  mutate(
    Delta_AIC = AIC - min(AIC),
    Delta_BIC = BIC - min(BIC)
  )

print("Model Comparison:")
print(kable(model_comparison, digits = 2))

# Select best model (lowest AIC)
best_model <- models[[which.min(model_comparison$AIC)]]
cat("\nBest model:", names(models)[which.min(model_comparison$AIC)], "\n")

# =====================================================
# ENHANCED RANDOM EFFECTS VISUALIZATION
# =====================================================

create_random_effects_plot <- function(model, n_highlight = 15) {
  # Extract random effects
  random_effects <- as.data.frame(ranef(model)$id) %>%
    rownames_to_column("id") %>%
    rename_with(~c("id", "random_intercept", "random_slope"), everything())
  
  # Sample participants to highlight
  set.seed(456)
  highlighted_ids <- sample(random_effects$id, n_highlight)
  random_effects$highlighted <- random_effects$id %in% highlighted_ids
  
  # Color palette
  highlight_colors <- viridis::viridis(n_highlight, alpha = 0.8)
  names(highlight_colors) <- highlighted_ids
  
  # Main scatter plot
  main_plot <- ggplot(random_effects, aes(x = random_intercept, y = random_slope)) +
    geom_point(data = filter(random_effects, !highlighted), 
               alpha = 0.3, size = 2, color = "gray60") +
    geom_point(data = filter(random_effects, highlighted), 
               aes(color = id), size = 4, alpha = 0.9) +
    scale_color_manual(values = highlight_colors, guide = "none") +
    geom_hline(yintercept = 0, linetype = "dashed", alpha = 0.5) +
    geom_vline(xintercept = 0, linetype = "dashed", alpha = 0.5) +
    geom_smooth(method = "lm", se = TRUE, color = "red", alpha = 0.3) +
    labs(x = "Random Intercepts (Baseline Mood)", 
         y = "Random Slopes (Rate of Change)",
         title = "Individual Differences in Mood Trajectories") +
    theme_minimal() +
    theme(plot.title = element_text(size = 14, hjust = 0.5))
  
  return(list(plot = main_plot, highlighted_ids = highlighted_ids, colors = highlight_colors))
}

# Create and display random effects plot
re_plot_info <- create_random_effects_plot(best_model)
print(re_plot_info$plot)

# =====================================================
# COMPREHENSIVE MODEL DIAGNOSTICS
# =====================================================

model_diagnostics <- function(model) {
  # Extract diagnostics
  icc_val <- performance::icc(model)
  r2_vals <- performance::r2(model)
  
  # Create summary table
  diagnostics_table <- tibble(
    Metric = c("ICC", "Marginal R²", "Conditional R²", "AIC", "BIC", "RMSE"),
    Value = c(
      round(icc_val$ICC_adjusted, 3),
      round(r2_vals$R2_marginal, 3), 
      round(r2_vals$R2_conditional, 3),
      round(AIC(model), 1),
      round(BIC(model), 1),
      round(performance::rmse(model), 2)
    ),
    Interpretation = c(
      "Proportion of variance due to individuals",
      "Variance explained by fixed effects only",
      "Variance explained by fixed + random effects", 
      "Akaike Information Criterion (lower = better)",
      "Bayesian Information Criterion (lower = better)",
      "Root Mean Square Error"
    )
  )
  
  return(diagnostics_table)
}

# Print comprehensive diagnostics
diagnostics <- model_diagnostics(best_model)
cat("\n=== COMPREHENSIVE MODEL DIAGNOSTICS ===\n")
print(kable(diagnostics, caption = "Model Performance Summary"))

# =====================================================
# EFFECT SIZE CALCULATIONS
# =====================================================

# Calculate effect sizes for fixed effects
fixed_effects <- broom.mixed::tidy(best_model, effects = "fixed")
sigma_residual <- sigma(best_model)

effect_sizes <- fixed_effects %>%
  mutate(
    cohens_d = estimate / sigma_residual,
    effect_size_interpretation = case_when(
      abs(cohens_d) < 0.2 ~ "Negligible",
      abs(cohens_d) < 0.5 ~ "Small", 
      abs(cohens_d) < 0.8 ~ "Medium",
      TRUE ~ "Large"
    )
  )

cat("\n=== EFFECT SIZES ===\n")
print(kable(effect_sizes[,c("term", "estimate", "cohens_d", "effect_size_interpretation")], 
            digits = 3, caption = "Effect Sizes for Fixed Effects"))

# =====================================================
# PREDICTION AND VALIDATION
# =====================================================

# Create prediction plot
prediction_data <- expand.grid(
  time_c = seq(min(ema$time_c), max(ema$time_c), length.out = 50),
  stress = c(2, 3, 4)  # Low, medium, high stress
)

predictions <- predict(best_model, newdata = prediction_data, re.form = NA)
prediction_data$mood_pred <- predictions

p_pred <- ggplot(prediction_data, aes(x = time_c, y = mood_pred, color = factor(stress))) +
  geom_line(linewidth = 1.5) +
  labs(title = "Model Predictions: Mood by Time and Stress Level",
       x = "Time (centered)", y = "Predicted Mood",
       color = "Stress Level") +
  theme_minimal() +
  theme(legend.position = "bottom")

print(p_pred)

cat("\n=== ANALYSIS COMPLETE ===\n")
cat("Key findings:\n")
cat("- Best model includes", names(models)[which.min(model_comparison$AIC)], "\n")
cat("- ICC =", round(diagnostics$Value[1], 3), "- indicating substantial individual differences\n")
cat("- Conditional R² =", round(diagnostics$Value[3], 3), "- model explains", 
    round(diagnostics$Value[3] * 100, 1), "% of variance\n")

# =====================================================
# STEP-BY-STEP VERSION (if you want to run parts separately)
# =====================================================

# STEP 1: Just run this to test basic functionality
test_basic <- function() {
  cat("Testing basic functionality...\n")
  
  # Simple data creation
  test_data <- data.frame(
    id = rep(1:10, each = 20),
    time = rep(1:20, 10),
    mood = rnorm(200, 50, 10)
  )
  
  # Simple plot
  p <- ggplot(test_data, aes(x = time, y = mood, group = id)) +
    geom_line(alpha = 0.5) +
    labs(title = "Test Plot") +
    theme_minimal()
  
  print(p)
  cat("Basic test completed successfully!\n")
}

# STEP 2: Test the simulation function
test_simulation <- function() {
  cat("Testing simulation function...\n")
  test_ema <- simulate_ema_data(n_id = 10, n_time = 20)
  cat("Simulation completed. Data dimensions:", dim(test_ema), "\n")
  print(head(test_ema))
}

# STEP 3: Test mixed model
test_model <- function() {
  cat("Testing mixed model...\n")
  test_ema <- simulate_ema_data(n_id = 20, n_time = 30)
  test_ema$time_c <- scale(test_ema$time, scale = FALSE)[,1]
  
  simple_model <- lmer(mood ~ time_c + (1 | id), data = test_ema)
  cat("Model fitted successfully!\n")
  print(summary(simple_model))
}

# Uncomment the lines below to run individual tests:
# test_basic()
# test_simulation()  
# test_model()
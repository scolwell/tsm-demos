# Comprehensive Cross-Check: 288 Combinations
# 3 test types x 3 power x 3 effect size x 2 significance x 2 directions x 4 sampling x 2 extraction
# Usage: Rscript tests/comprehensive_test.R

ensure_pkg <- function(pkg) {
  if (!requireNamespace(pkg, quietly = TRUE)) {
    install.packages(pkg, repos = "https://cloud.r-project.org")
  }
}

ensure_pkg("pwr")
ensure_pkg("jsonlite")

library(pwr)
library(jsonlite)

# Define all combinations
test_types    <- c("single-sample", "paired", "two-sample")
power_levels  <- c(0.60, 0.70, 0.80)
effect_sizes  <- c(0.2, 0.5, 0.8)  # small, medium, large
sig_levels    <- c(0.05, 0.01)
directions    <- c("two.sided", "greater")  # one-sided = greater
sampling_methods <- c("simple", "stratified", "cluster", "systematic")
extraction_methods <- c("with-replacement", "without-replacement")

# Generate all combinations
grid <- expand.grid(
  testType    = test_types,
  power       = power_levels,
  d           = effect_sizes,
  sig.level   = sig_levels,
  alternative = directions,
  sampling    = sampling_methods,
  extraction  = extraction_methods,
  stringsAsFactors = FALSE
)

cat(sprintf("Total test cases: %d\n", nrow(grid)))

# Compute sample size with pwr package
compute_pwr <- function(testType, d, power, sig.level, alternative) {
  type_map <- list(
    "single-sample" = "one.sample",
    "paired"        = "paired",
    "two-sample"    = "two.sample"
  )
  type <- type_map[[testType]]
  if (is.null(type)) stop("Unknown testType: ", testType)
  
  res <- pwr.t.test(
    d = d, 
    power = power, 
    sig.level = sig.level, 
    type = type, 
    alternative = alternative
  )
  
  # pwr returns n per group for two-sample
  if (type == "two.sample") {
    n_total <- ceiling(2 * ceiling(res$n))
    n_per   <- ceiling(res$n)
  } else {
    n_total <- ceiling(res$n)
    n_per   <- n_total
  }
  
  list(
    n_total = as.integer(n_total),
    n_per_group = as.integer(n_per),
    pwr_n = res$n,
    pwr_d = res$d,
    pwr_sig_level = res$sig.level,
    pwr_power = res$power,
    pwr_alternative = res$alternative,
    pwr_note = res$note
  )
}

# Apply FPC if extraction is without replacement
apply_fpc <- function(n, N, extraction) {
  if (extraction == "without-replacement" && !is.na(N) && is.finite(N) && N > 0) {
    # FPC: n_adj = n / (1 + n/N)
    n_adj <- n / (1 + n/N)
    return(ceiling(n_adj))
  }
  return(n)
}

# Apply design effect for sampling method
apply_design_effect <- function(n, sampling, icc = 0.05, m = 25) {
  deff <- 1
  if (sampling == "stratified") {
    # Assume 20% reduction for stratification
    deff <- 0.8
  } else if (sampling == "cluster") {
    # DEFF = 1 + (m-1)*ICC
    deff <- 1 + (m - 1) * icc
  } else if (sampling == "systematic") {
    # Assume similar to simple random
    deff <- 1
  }
  return(ceiling(n * deff))
}

# Process all cases
cat("Computing sample sizes...\n")
results <- lapply(seq_len(nrow(grid)), function(i) {
  row <- grid[i, ]
  
  tryCatch({
    # Base calculation from pwr
    pwr_result <- compute_pwr(
      row$testType, 
      row$d, 
      row$power, 
      row$sig.level, 
      row$alternative
    )
    
    # Apply design effect based on sampling method
    n_with_deff <- apply_design_effect(
      pwr_result$n_total, 
      row$sampling,
      icc = 0.05,
      m = 25
    )
    
    # Apply FPC for finite population (assume N=1000 for testing)
    N_population <- if(row$extraction == "without-replacement") 1000 else NA
    n_final <- apply_fpc(n_with_deff, N_population, row$extraction)
    
    list(
      case_id = i,
      testType = row$testType,
      power = row$power,
      effect_size = row$d,
      sig_level = row$sig.level,
      alternative = row$alternative,
      sampling = row$sampling,
      extraction = row$extraction,
      n_base = pwr_result$n_total,
      n_per_group_base = pwr_result$n_per_group,
      n_with_design_effect = n_with_deff,
      n_final_with_fpc = n_final,
      pwr_exact_n = pwr_result$pwr_n,
      N_population = N_population,
      design_effect_applied = row$sampling != "simple",
      fpc_applied = row$extraction == "without-replacement",
      status = "success"
    )
  }, error = function(e) {
    list(
      case_id = i,
      testType = row$testType,
      power = row$power,
      effect_size = row$d,
      sig_level = row$sig.level,
      alternative = row$alternative,
      sampling = row$sampling,
      extraction = row$extraction,
      status = "error",
      error_message = as.character(e)
    )
  })
})

cat("Writing results...\n")

# Write detailed JSON
outfile <- file.path("tests", "comprehensive_results.json")
cat(toJSON(results, auto_unbox = TRUE, pretty = TRUE), file = outfile)
cat(sprintf("✓ Wrote %s\n", outfile))

# Create summary CSV for easier viewing
summary_df <- do.call(rbind, lapply(results, function(r) {
  data.frame(
    case_id = r$case_id,
    test = r$testType,
    pwr = r$power,
    d = r$effect_size,
    alpha = r$sig_level,
    alt = r$alternative,
    samp = r$sampling,
    extr = r$extraction,
    n_base = ifelse(is.null(r$n_base), NA, r$n_base),
    n_deff = ifelse(is.null(r$n_with_design_effect), NA, r$n_with_design_effect),
    n_final = ifelse(is.null(r$n_final_with_fpc), NA, r$n_final_with_fpc),
    status = r$status,
    stringsAsFactors = FALSE
  )
}))

csvfile <- file.path("tests", "comprehensive_results.csv")
write.csv(summary_df, csvfile, row.names = FALSE)
cat(sprintf("✓ Wrote %s\n", csvfile))

# Print summary statistics
cat("\n=== SUMMARY ===\n")
cat(sprintf("Total cases: %d\n", nrow(summary_df)))
cat(sprintf("Successful: %d\n", sum(summary_df$status == "success")))
cat(sprintf("Errors: %d\n", sum(summary_df$status == "error")))

if (sum(summary_df$status == "success") > 0) {
  valid <- summary_df[summary_df$status == "success", ]
  cat(sprintf("\nSample size range (base): %d - %d\n", 
      min(valid$n_base, na.rm=TRUE), 
      max(valid$n_base, na.rm=TRUE)))
  cat(sprintf("Sample size range (final with adjustments): %d - %d\n", 
      min(valid$n_final, na.rm=TRUE), 
      max(valid$n_final, na.rm=TRUE)))
}

cat("\nDone!\n")

# Compare R and JS comprehensive test results
# Usage: Rscript tests/compare_comprehensive.R

ensure_pkg <- function(pkg) {
  if (!requireNamespace(pkg, quietly = TRUE)) {
    install.packages(pkg, repos = "https://cloud.r-project.org")
  }
}

ensure_pkg("jsonlite")

library(jsonlite)

# Read both result files
r_file <- "tests/comprehensive_results.json"
js_file <- "tests/js_comprehensive_results.json"

if (!file.exists(r_file)) {
  stop("R results not found. Run: Rscript tests/comprehensive_test.R")
}

if (!file.exists(js_file)) {
  stop("JS results not found. Open tests/comprehensive_test.html and click 'Run All 288 Tests', then download the JSON")
}

cat("Reading results...\n")
r_results <- fromJSON(r_file)
js_results <- fromJSON(js_file)

cat(sprintf("R results: %d cases\n", nrow(r_results)))
cat(sprintf("JS results: %d cases\n", nrow(js_results)))

# Match results by case parameters
compare_results <- function(r_df, js_df) {
  if (nrow(r_df) != nrow(js_df)) {
    warning(sprintf("Different number of cases: R=%d, JS=%d", nrow(r_df), nrow(js_df)))
  }
  
  comparisons <- data.frame()
  
  for (i in seq_len(min(nrow(r_df), nrow(js_df)))) {
    r_row <- r_df[i, ]
    js_row <- js_df[i, ]
    
    # Check if same test case
    same_case <- (
      r_row$testType == js_row$testType &&
      r_row$power == js_row$power &&
      r_row$effect_size == js_row$effect_size &&
      r_row$sig_level == js_row$sig_level &&
      r_row$alternative == js_row$alternative &&
      r_row$sampling == js_row$sampling &&
      r_row$extraction == js_row$extraction
    )
    
    if (!same_case) {
      warning(sprintf("Case mismatch at row %d", i))
      next
    }
    
    # Calculate differences
    n_base_diff <- abs(r_row$n_base - js_row$n_base)
    n_base_pct <- if(r_row$n_base > 0) (n_base_diff / r_row$n_base * 100) else 0
    
    n_final_diff <- abs(r_row$n_final_with_fpc - js_row$n_final_with_fpc)
    n_final_pct <- if(r_row$n_final_with_fpc > 0) (n_final_diff / r_row$n_final_with_fpc * 100) else 0
    
    comparison <- data.frame(
      case_id = i,
      testType = r_row$testType,
      power = r_row$power,
      effect_size = r_row$effect_size,
      sig_level = r_row$sig_level,
      alternative = r_row$alternative,
      sampling = r_row$sampling,
      extraction = r_row$extraction,
      r_n_base = r_row$n_base,
      js_n_base = js_row$n_base,
      n_base_diff = n_base_diff,
      n_base_pct_diff = round(n_base_pct, 2),
      r_n_final = r_row$n_final_with_fpc,
      js_n_final = js_row$n_final_with_fpc,
      n_final_diff = n_final_diff,
      n_final_pct_diff = round(n_final_pct, 2),
      match_base = n_base_diff == 0,
      match_final = n_final_diff == 0,
      stringsAsFactors = FALSE
    )
    
    comparisons <- rbind(comparisons, comparison)
  }
  
  return(comparisons)
}

cat("\nComparing results...\n")
comparisons <- compare_results(r_results, js_results)

# Summary statistics
cat("\n=== COMPARISON SUMMARY ===\n")
cat(sprintf("Total cases compared: %d\n", nrow(comparisons)))
cat(sprintf("Exact matches (base n): %d (%.1f%%)\n", 
    sum(comparisons$match_base, na.rm=TRUE), 
    100 * sum(comparisons$match_base, na.rm=TRUE) / nrow(comparisons)))
cat(sprintf("Exact matches (final n): %d (%.1f%%)\n", 
    sum(comparisons$match_final, na.rm=TRUE), 
    100 * sum(comparisons$match_final, na.rm=TRUE) / nrow(comparisons)))

cat("\nBase n differences:\n")
cat(sprintf("  Mean absolute diff: %.2f\n", mean(comparisons$n_base_diff, na.rm=TRUE)))
cat(sprintf("  Max absolute diff: %d\n", max(comparisons$n_base_diff, na.rm=TRUE)))
cat(sprintf("  Mean %% diff: %.2f%%\n", mean(comparisons$n_base_pct_diff, na.rm=TRUE)))

cat("\nFinal n differences (with adjustments):\n")
cat(sprintf("  Mean absolute diff: %.2f\n", mean(comparisons$n_final_diff, na.rm=TRUE)))
cat(sprintf("  Max absolute diff: %d\n", max(comparisons$n_final_diff, na.rm=TRUE)))
cat(sprintf("  Mean %% diff: %.2f%%\n", mean(comparisons$n_final_pct_diff, na.rm=TRUE)))

# Find cases with largest differences
cat("\nTop 10 cases with largest base n differences:\n")
top_diffs <- comparisons[order(-comparisons$n_base_diff), ][1:10, 
  c("case_id", "testType", "effect_size", "power", "r_n_base", "js_n_base", "n_base_diff", "n_base_pct_diff")]
print(top_diffs, row.names=FALSE)

# Write comparison results
outfile <- "tests/comparison_results.csv"
write.csv(comparisons, outfile, row.names = FALSE)
cat(sprintf("\n✓ Wrote comparison results to %s\n", outfile))

# Create summary report
summary_report <- list(
  total_cases = nrow(comparisons),
  exact_matches_base = sum(comparisons$match_base, na.rm=TRUE),
  exact_matches_final = sum(comparisons$match_final, na.rm=TRUE),
  match_rate_base_pct = round(100 * sum(comparisons$match_base, na.rm=TRUE) / nrow(comparisons), 2),
  match_rate_final_pct = round(100 * sum(comparisons$match_final, na.rm=TRUE) / nrow(comparisons), 2),
  base_n_stats = list(
    mean_abs_diff = round(mean(comparisons$n_base_diff, na.rm=TRUE), 2),
    max_abs_diff = max(comparisons$n_base_diff, na.rm=TRUE),
    mean_pct_diff = round(mean(comparisons$n_base_pct_diff, na.rm=TRUE), 2)
  ),
  final_n_stats = list(
    mean_abs_diff = round(mean(comparisons$n_final_diff, na.rm=TRUE), 2),
    max_abs_diff = max(comparisons$n_final_diff, na.rm=TRUE),
    mean_pct_diff = round(mean(comparisons$n_final_pct_diff, na.rm=TRUE), 2)
  )
)

summary_file <- "tests/comparison_summary.json"
cat(toJSON(summary_report, auto_unbox = TRUE, pretty = TRUE), file = summary_file)
cat(sprintf("✓ Wrote summary to %s\n", summary_file))

cat("\nDone!\n")

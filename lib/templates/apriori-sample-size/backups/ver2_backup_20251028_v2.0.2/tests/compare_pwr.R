# Compare JS estimator against R pwr for t-tests
# Usage in VS Code terminal: Rscript tests/compare_pwr.R

ensure_pkg <- function(pkg) {
  if (!requireNamespace(pkg, quietly = TRUE)) {
    install.packages(pkg, repos = "https://cloud.r-project.org")
  }
}

ensure_pkg("pwr")
ensure_pkg("jsonlite")

library(pwr)
library(jsonlite)

# Define test cases
cases <- data.frame(
  id          = 1:8,
  testType    = c("single-sample","paired","two-sample","two-sample","single-sample","paired","two-sample","single-sample"),
  d           = c(0.5, 0.5, 0.5, 0.8, 0.2, 0.5, 0.3, 0.7),
  power       = c(0.80, 0.80, 0.80, 0.90, 0.80, 0.80, 0.80, 0.95),
  sig.level   = c(0.05, 0.05, 0.05, 0.05, 0.05, 0.01, 0.05, 0.05),
  alternative = c("two.sided","two.sided","two.sided","two.sided","two.sided","greater","two.sided","two.sided"),
  stringsAsFactors = FALSE
)

# Compute with pwr
do_pwr <- function(tt, d, power, sig.level, alternative) {
  type_map <- list(
    "single-sample" = "one.sample",
    "paired"        = "paired",
    "two-sample"    = "two.sample"
  )
  type <- type_map[[tt]]
  if (is.null(type)) stop("Unknown testType: ", tt)
  res <- pwr.t.test(d = d, power = power, sig.level = sig.level, type = type, alternative = alternative)
  # pwr returns n per group for two-sample; total N = 2*n
  if (type == "two.sample") {
    n_total <- ceiling(2 * ceiling(res$n))
    n_per   <- ceiling(res$n)
  } else {
    n_total <- ceiling(res$n)
    n_per   <- n_total
  }
  list(
    n_total = as.integer(n_total),
    n_per   = as.integer(n_per),
    note    = res$note
  )
}

out <- lapply(seq_len(nrow(cases)), function(i) {
  row <- cases[i, ]
  comp <- tryCatch(
    do_pwr(row$testType, row$d, row$power, row$sig.level, row$alternative),
    error = function(e) list(error = as.character(e))
  )
  c(as.list(row), comp)
})

# Write JSON
outfile <- file.path("tests", "r_results.json")
cat(toJSON(out, auto_unbox = TRUE, pretty = TRUE), file = outfile)
cat(sprintf("\nWrote %s\n", outfile))

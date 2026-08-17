# Investment Portfolio Report: Historical Analysis & Monte Carlo Simulation

A moderate-risk investment portfolio built from historical asset data, stress-tested against 30-year uncertainty using a custom Monte Carlo simulation written in Google Apps Script.

<img width="600" height="371" alt="Assets vs Time" src="https://github.com/user-attachments/assets/330924b0-760c-437a-95f4-b33dcf5377aa" />


*Historical growth of a $10,000 initial investment across the final portfolio allocation, 2014–2025.*

## Objective

Design an investment portfolio aligned with a moderate-risk tolerance by combining historical asset performance with simulated future outcomes — rather than relying on backtested returns alone, which can't capture the range of paths a portfolio might realistically take over a 30-year horizon.

## Data & Allocation

- **Source:** Weekly historical price data for the S&P 500, NVIDIA, JPMorgan Chase, and Realty Income Corp, pulled via Google Sheets' `GOOGLEFINANCE` function (March 2014–October 2025)
- **Processing:** Weekly prices converted to annual averages using pivot tables to smooth short-term volatility

**Final allocation** (target std. dev. range: 0.15–0.25):

| Asset | Weight |
|---|---|
| S&P 500 | 70% |
| JPMorgan Chase | 15% |
| Realty Income Corp | 14% |
| NVIDIA | 1% |

Resulting portfolio standard deviation: **0.211** — consistent with a moderate-risk target. An earlier draft allocation with heavier NVIDIA exposure pushed volatility above 0.25, which is why the position was cut down to 1%.

## Monte Carlo Simulation

Historical data shows what *did* happen — it doesn't show the range of what *could* happen. To account for that uncertainty, I built a Monte Carlo simulation in Google Apps Script that models 1,000 possible 30-year outcomes for the portfolio.

```javascript
function monteCarlo1000() {
  const trials = 1000;
  const results = [];
  for (let i = 0; i < trials; i++) {
    let value = init;
    for (let y = 0; y < years; y++) {
      const randReturn = normInv(Math.random(), avg, stddev);
      value = value * (1 + randReturn) + contrib;
    }
    results.push([value]);
  }
  // ...
}
```

**Simulation details:**
- 1,000 independent trials
- 30-year horizon
- Annual returns drawn from a normal distribution calibrated to the portfolio's historical mean and standard deviation
- $3,000 annual contributions (~$250/month), modeling dollar-cost averaging

Full script: [`scripts/monte_carlo_simulation.gs`](./scripts/monte_carlo_simulation.gs)

**A note on the math:** Google Apps Script has no built-in inverse normal function, so `normInv()` is implemented using an approximation of the inverse error function (`erfinv`) rather than an exact computation. This is a standard workaround and doesn't meaningfully affect results at this scale, but it's a deliberate simplification worth flagging rather than treating as exact.

## Results

| Metric | Value | Interpretation |
|---|---|---|
| Average (Expected Value) | $5,478,642 | Mean outcome across all 1,000 trials |
| Median (Most Likely Outcome) | $3,703,189 | Splits the highest/lowest 50% of results |
| Min Value (Worst Case) | $163,040 | Lowest simulated outcome |
| Max Value (Best Case) | $64,821,898 | Highest simulated outcome |
| 25th Percentile | $1,894,814 | 25% of simulations fell below this |
| 75th Percentile | $6,434,689 | 75% of simulations fell below this |

The spread between the 25th and 75th percentiles is large — a reminder that even a "moderate-risk" portfolio produces widely varying long-run outcomes, and that consistent contributions matter as much as the allocation itself.

## Key Takeaway

Risk management comes before return-chasing. Keeping volatility within a defined comfort range, then layering a Monte Carlo simulation on top of the historical analysis, turns a single backtested number into a realistic *range* of outcomes — a more honest way to plan around long-term uncertainty.

## Limitations

- Assumes normally distributed annual returns, which real markets don't perfectly follow (fat tails, skew, and volatility clustering aren't captured)
- `erfinv` is an approximation, not an exact inverse error function
- Static allocation with no rebalancing over the 30-year horizon
- Historical mean/std dev used as simulation inputs — future returns may differ meaningfully from the 2014–2025 sample period, which included NVIDIA's AI-driven run-up

## Files

- [`scripts/monte_carlo_simulation.gs`](./scripts/monte_carlo_simulation.gs) — Monte Carlo simulation (Google Apps Script)
- `images/` — exported charts

---
*Author: Alexis Ortiz*

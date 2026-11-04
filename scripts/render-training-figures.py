"""Render article figures from explicitly published, frozen aggregate observations.

Optional authoring dependency: matplotlib 3.9.2 (not needed by Astro or CI).
Run from any directory: python <repository>/scripts/render-training-figures.py
"""

import csv
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
os.environ.setdefault("MPLCONFIGDIR", str(ROOT / ".local" / "matplotlib"))

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

ASSETS = ROOT / "public" / "articles" / "2026-11-training"
plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 11,
    "svg.hashsalt": "dave-frozen-training-20261104",
    "axes.spines.top": False,
    "axes.spines.right": False,
    "figure.facecolor": "#fff9e8",
    "axes.facecolor": "#fff9e8",
    "axes.labelcolor": "#493c29",
    "text.color": "#493c29",
})


def save(fig, name):
    target = ASSETS / name
    fig.savefig(target, bbox_inches="tight", metadata={"Date": None})
    # Normalize the SVG writer's path-line whitespace for portable, clean diffs.
    normalized = "\n".join(line.rstrip() for line in target.read_text(encoding="utf-8").splitlines()) + "\n"
    with target.open("w", encoding="utf-8", newline="\n") as output:
        output.write(normalized)
    plt.close(fig)


with (ASSETS / "microbatch-summary.csv").open(encoding="utf-8", newline="") as f:
    rows = list(csv.DictReader(f))

medians = [float(r["median_seconds"]) for r in rows]
means = [float(r["mean_seconds"]) for r in rows]
low = [float(r["min_seconds"]) for r in rows]
high = [float(r["max_seconds"]) for r in rows]
fig, ax = plt.subplots(figsize=(8.1, 4.5), layout="constrained")
x = list(range(len(rows)))
ax.bar([n - .17 for n in x], medians, width=.31, color="#608447", label="Median")
ax.bar([n + .17 for n in x], means, width=.31, color="#c79a50", label="Mean")
ax.errorbar(x, medians,
            yerr=[[m - l for m, l in zip(medians, low)],
                  [h - m for h, m in zip(high, medians)]],
            fmt="none", ecolor="#493c29", capsize=5, label="Min-max range (not CI)")
ax.set_xticks(x, [f"micro {r['micro_batch']} / accum {r['gradient_accumulation']}" for r in rows])
ax.set_ylim(0, 40)
ax.set_ylabel("Seconds per measured training step")
ax.set_title("Short microbatch probe | global batch 32 | n=4 per setting", loc="left", pad=15, fontsize=12)
for n, median, mean in zip(x, medians, means):
    ax.text(n - .17, median + .35, f"{median:.2f}", ha="center", fontsize=9)
    ax.text(n + .17, mean + .35, f"{mean:.2f}", ha="center", fontsize=9)
ax.legend(loc="upper right", frameon=False, fontsize=9)
ax.grid(axis="y", alpha=.14)
ax.set_axisbelow(True)
fig.supxlabel("Sequential windows; no independent state reset. Frozen record: 2026-11-04.", fontsize=9)
save(fig, "microbatch.svg")

with (ASSETS / "validation-summary.csv").open(encoding="utf-8", newline="") as f:
    points = [r for r in csv.DictReader(f) if r["run"] == "27b-new" and r["stage"] == "cpt"]
assert [r["observation"] for r in points] == ["best", "last"]
values = [float(r["validation_loss"]) for r in points]
fig, ax = plt.subplots(figsize=(7.5, 4.0), layout="constrained")
ax.bar([0, 1], values, width=.5, color=["#608447", "#c79a50"])
ax.set_xticks([0, 1], [f"Best observed\nstep {points[0]['step']}", f"Last observed\nstep {points[1]['step']}"])
ax.set_ylim(0, 3.5)
ax.set_ylabel("Validation loss (same run / metric)")
ax.set_title("27B CPT: two published observations, not a full trajectory", loc="left", fontsize=12, pad=14)
for n, value in enumerate(values):
    ax.text(n, value + .07, f"{value:.6f}", ha="center", fontsize=11)
ax.grid(axis="y", alpha=.14)
ax.set_axisbelow(True)
fig.supxlabel("Validation packs have repeated weights; loss is not business accuracy.", fontsize=9)
save(fig, "cpt-best-last.svg")
print("Rendered 2 figures from public aggregate CSV files.")

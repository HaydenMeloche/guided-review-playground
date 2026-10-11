"""Summarize orders exported from the API as JSON lines."""

import json
import sys
from collections import Counter


def load(path):
    with open(path) as f:
        return [json.loads(line) for line in f if line.strip()]


def summarize(orders):
    revenue = sum(o["totalCents"] for o in orders)
    units = Counter()
    for o in orders:
        for item in o["items"]:
            units[item["sku"]] += item["quantity"]
    return {"orders": len(orders), "revenue_cents": revenue, "top_skus": units.most_common(3)}


def main():
    if len(sys.argv) != 2:
        sys.exit("usage: sales_report.py ORDERS.jsonl")
    summary = summarize(load(sys.argv[1]))
    print(f"Orders:  {summary['orders']}")
    print(f"Revenue: ${summary['revenue_cents'] / 100:.2f}")
    for sku, qty in summary["top_skus"]:
        print(f"  {sku}: {qty}")


if __name__ == "__main__":
    main()

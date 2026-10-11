"""Summarize orders exported from the API as JSON lines."""

import json
import sys
from collections import Counter


def load(path):
    with open(path) as f:
        return [json.loads(line) for line in f if line.strip()]


def summarize(orders):
    active = [o for o in orders if o.get("status") != "cancelled"]
    revenue = sum(o["totalCents"] for o in active)
    discounted = sum(o.get("discountCents", 0) for o in active)
    units = Counter()
    codes = Counter()
    for o in active:
        for item in o["items"]:
            units[item["sku"]] += item["quantity"]
        if o.get("discountCode"):
            codes[o["discountCode"]] += 1
    return {
        "orders": len(active),
        "cancelled": len(orders) - len(active),
        "revenue_cents": revenue,
        "discount_cents": discounted,
        "top_skus": units.most_common(3),
        "top_codes": codes.most_common(3),
    }


def main():
    if len(sys.argv) != 2:
        sys.exit("usage: sales_report.py ORDERS.jsonl")
    summary = summarize(load(sys.argv[1]))
    print(f"Orders:    {summary['orders']} ({summary['cancelled']} cancelled)")
    print(f"Revenue:   ${summary['revenue_cents'] / 100:.2f}")
    print(f"Discounts: ${summary['discount_cents'] / 100:.2f}")
    print("Top SKUs:")
    for sku, qty in summary["top_skus"]:
        print(f"  {sku}: {qty}")
    print("Top codes:")
    for code, n in summary["top_codes"]:
        print(f"  {code}: {n}")


if __name__ == "__main__":
    main()

import { describe, expect, it } from "vitest";
import { clampPage, getTotalPages } from "@/lib/messages-pagination";

describe("getTotalPages", () => {
  it("ceil division", () => {
    expect(getTotalPages(9951, 100)).toBe(100);
    expect(getTotalPages(1, 100)).toBe(1);
    expect(getTotalPages(0, 100)).toBe(1);
  });
});

describe("clampPage", () => {
  it("clamps to [1, totalPages]", () => {
    expect(clampPage(0, 5)).toBe(1);
    expect(clampPage(10, 5)).toBe(5);
    expect(clampPage(3, 5)).toBe(3);
  });
});

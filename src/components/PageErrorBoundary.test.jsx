import { lazy, Suspense } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PageErrorBoundary from "./PageErrorBoundary";

describe("PageErrorBoundary", () => {
  it("shows a message instead of a blank screen when a page's code can't be downloaded", async () => {
    // React reports the caught error to the console; keep the test output clean
    vi.spyOn(console, "error").mockImplementation(() => {});
    const BrokenPage = lazy(() => Promise.reject(new Error("Failed to fetch")));

    render(
      <>
        <nav>Navbar</nav>
        <PageErrorBoundary>
          <Suspense fallback={null}>
            <BrokenPage />
          </Suspense>
        </PageErrorBoundary>
      </>
    );

    expect(
      await screen.findByText(/couldn't load this page/i)
    ).toBeInTheDocument();
    // The rest of the app (the navbar) is still there
    expect(screen.getByText("Navbar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /refresh/i })).toBeInTheDocument();
  });

  it("shows the page normally when nothing goes wrong", () => {
    render(
      <PageErrorBoundary>
        <p>Hello</p>
      </PageErrorBoundary>
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});

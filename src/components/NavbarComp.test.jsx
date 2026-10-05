import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { useLocation } from "react-router";
import NavbarComp from "./NavbarComp";
import { renderWithApp } from "../test/testUtils.jsx";

// Going to /login directly (an old bookmark, or typing the address) must open
// the sign-in pop-up over the home page, like the navbar's Login link does,
// instead of showing an empty page.

beforeEach(() => {
  // A pretend Google sign-in script, for the pop-up's button
  vi.stubGlobal("google", {
    accounts: { id: { initialize: vi.fn(), renderButton: vi.fn(), prompt: vi.fn() } },
  });
  vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "test-client-id");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

// Shows the current address
const Where = () => <div data-testid="where">{useLocation().pathname}</div>;

describe("NavbarComp", () => {
  it("opens the sign-in pop-up over the home page when visiting /login", async () => {
    renderWithApp(
      <>
        <NavbarComp />
        <Where />
      </>,
      { route: "/login", respond: () => 401 }
    );

    expect(await screen.findByText("Sign in with Google")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("where")).toHaveTextContent(/^\/$/));
  });
});

import { describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Collection from "./Collection";
import { renderWithApp } from "../test/testUtils.jsx";

// Characterization tests for the Collections page: what a visitor sees.

const tellsentences = [{ key: 1, title: "Day 1", tell: "It is cold outside.", image: "/cold.jpg" }];

// Approved sentences, newest first (the order the server sends them in)
const fromServer = (n) =>
  Array.from({ length: n }, (_, i) => ({
    _id: `id-${i + 1}`,
    title: "day1",
    tell: "It is cold outside.",
    show: `Sentence ${i + 1}`,
    author: { firstName: "Ada", lastName: "Lovelace" },
  }));

const shownOrder = () => screen.queryAllByText(/^Sentence \d+$/).map((el) => el.textContent);

const renderCollection = ({ server = fromServer(6), remembered = [] } = {}) =>
  renderWithApp(<Collection />, {
    // `remembered`: an old list redux-persist may have restored
    state: { tellsentences, approvedsentences: remembered },
    route: "/Collections",
    respond: (config) =>
      config.url === "/Collections" ? { status: 200, data: server } : 200,
  });

const pickSort = async (user, choice) => {
  await user.click(screen.getByRole("button", { name: /random|newest/i }));
  await user.click(within(await screen.findByRole("menu")).getByText(choice));
};

describe("Collection", () => {
  it("shows the approved sentences from the server", async () => {
    renderCollection({ server: fromServer(6) });

    await waitFor(() => expect(shownOrder()).toHaveLength(6));
    expect(shownOrder().sort()).toEqual(fromServer(6).map((s) => s.show).sort());
  });

  it("shows the fresh list from the server, not an old one remembered by the browser", async () => {
    const old = [{ ...fromServer(1)[0], _id: "old", show: "Sentence 99" }];
    renderCollection({ server: fromServer(3), remembered: old });

    await waitFor(() => expect(shownOrder()).toHaveLength(3));
    expect(screen.queryByText("Sentence 99")).not.toBeInTheDocument();
  });

  it("starts on Random, and Newest shows the server's newest-first order", async () => {
    const user = userEvent.setup();
    renderCollection({ server: fromServer(6) });
    await waitFor(() => expect(shownOrder()).toHaveLength(6));
    expect(screen.getByRole("button", { name: /random/i })).toBeInTheDocument();

    await pickSort(user, "Newest");

    await waitFor(() =>
      expect(shownOrder()).toEqual(fromServer(6).map((s) => s.show))
    );
  });

  it("Random keeps the same sentences, in some order", async () => {
    const user = userEvent.setup();
    renderCollection({ server: fromServer(6) });
    await waitFor(() => expect(shownOrder()).toHaveLength(6));

    await pickSort(user, "Newest");
    await pickSort(user, "Random");

    await waitFor(() => expect(shownOrder()).toHaveLength(6));
    expect(shownOrder().sort()).toEqual(fromServer(6).map((s) => s.show).sort());
  });
});

import { describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyPage from "./MyPage";
import { renderWithApp } from "../test/testUtils.jsx";

// Characterization tests: they record what MyPage does today, from a
// student's point of view, so the hooks rework can't change it unnoticed.

const ada = { id: "g-ada", firstName: "Ada", lastName: "Lovelace" };

// Tell sentences "Tell 1".."Tell N" for days 1..N
const tells = (n) =>
  Array.from({ length: n }, (_, i) => ({
    key: i + 1,
    title: `Day ${i + 1}`,
    tell: `Tell ${i + 1}`,
  }));

// The student's own sentences for days 1..n ("Show 1".."Show n")
const shows = (n) =>
  Array.from({ length: n }, (_, i) => ({
    _id: `s${i + 1}`,
    title: `day${i + 1}`,
    tell: `Tell ${i + 1}`,
    show: `Show ${i + 1}`,
    hideedit: true,
    approved: false,
    toRedo: false,
  }));

// Draw MyPage for a signed-in Ada. The pretend server answers GET /MyPage
// with `mine`, and records every request in `requests`.
const renderMyPage = ({ tellCount = 12, mine = shows(2) } = {}) => {
  const requests = [];
  const respond = (config) => {
    requests.push(config);
    if (config.method === "get" && config.url === "/MyPage") {
      return { status: 200, data: mine };
    }
    if (config.method === "post" && config.url === "/MyPage") {
      return { status: 201, data: { _id: "new", ...JSON.parse(config.data) } };
    }
    if (config.url === "/Login") return { status: 200, data: ada };
    return 200;
  };
  const view = renderWithApp(<MyPage />, {
    state: { user: ada, tellsentences: tells(tellCount), usersentences: mine },
    respond,
    route: "/MyPage",
  });
  return { ...view, requests };
};

const textbox = () => screen.getByPlaceholderText("Don't just tell me, instead SHOW ME!");
const submitButton = () => screen.getByRole("button", { name: "Show ME!" });
const listedShows = () =>
  screen.queryAllByText(/^Show \d+$/).map((el) => el.textContent);

describe("MyPage", () => {
  it("shows the next day and its tell sentence", async () => {
    renderMyPage({ mine: shows(2) });

    expect(await screen.findByText("Day 3")).toBeInTheDocument();
    expect(screen.getByText("Tell 3")).toBeInTheDocument();
  });

  it("lists the student's sentences, newest first", async () => {
    renderMyPage({ mine: shows(3) });

    await waitFor(() => expect(listedShows()).toEqual(["Show 3", "Show 2", "Show 1"]));
  });

  it("submitting sends the sentence, clears the box and moves to the next day", async () => {
    const user = userEvent.setup();
    const { requests } = renderMyPage({ mine: shows(2) });
    await screen.findByText("Day 3");

    await user.type(textbox(), "Brr, my fingers froze.");
    await user.click(submitButton());

    const post = await waitFor(() => {
      const found = requests.find((r) => r.method === "post" && r.url === "/MyPage");
      expect(found).toBeDefined();
      return found;
    });
    expect(JSON.parse(post.data)).toEqual({
      title: "day3",
      tell: "Tell 3",
      show: "Brr, my fingers froze.",
      hideedit: true,
    });
    expect(textbox()).toHaveValue("");
    expect(await screen.findByText("Day 4")).toBeInTheDocument();
    expect(screen.getByText("Tell 4")).toBeInTheDocument();
  });

  it("ignores an empty submission", async () => {
    const user = userEvent.setup();
    const { requests } = renderMyPage();
    await screen.findByText("Day 3");

    await user.click(submitButton());

    expect(requests.some((r) => r.method === "post")).toBe(false);
    expect(screen.getByText("Day 3")).toBeInTheDocument();
  });

  it("shows 8 sentences per page, with page buttons when there are more", async () => {
    const user = userEvent.setup();
    renderMyPage({ mine: shows(10) });

    await waitFor(() =>
      expect(listedShows()).toEqual([
        "Show 10", "Show 9", "Show 8", "Show 7", "Show 6", "Show 5", "Show 4", "Show 3",
      ])
    );
    const pager = screen.getByRole("list", { name: (_, el) => el.classList.contains("pagination") });
    expect(within(pager).getAllByRole("listitem")).toHaveLength(2);

    await user.click(within(pager).getByText("2"));

    await waitFor(() => expect(listedShows()).toEqual(["Show 2", "Show 1"]));
  });

  it("when every day is done, says come back later and blocks submitting", async () => {
    const user = userEvent.setup();
    const alert = vi.spyOn(window, "alert").mockImplementation(() => {});
    const { requests } = renderMyPage({ tellCount: 2, mine: shows(2) });

    expect(await screen.findByText("Come Back Later For More Sentences!")).toBeInTheDocument();

    await user.type(textbox(), "One more?");
    await user.click(submitButton());

    expect(alert).toHaveBeenCalled();
    expect(requests.some((r) => r.method === "post")).toBe(false);
  });
});

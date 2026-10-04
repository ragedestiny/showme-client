import { afterEach, describe, expect, it, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import reducers from "../reducers";
import { API } from "../api";
import { setupInterceptors } from "../api/interceptors";
import { checkSession } from "./user";
import { fakeNetwork } from "../test/testUtils.jsx";

// Real store, real reducers, real API instance, real interceptor; only the
// network is pretend. `remembered` is what redux-persist restored on startup.
let interceptorId;
const startApp = ({ remembered, respond }) => {
  const store = configureStore({
    reducer: reducers,
    preloadedState: { user: remembered },
  });
  API.defaults.adapter = vi.fn(fakeNetwork(respond));
  interceptorId = setupInterceptors(store);
  return store;
};

afterEach(() => {
  API.interceptors.response.eject(interceptorId);
});

describe("checking a remembered login when the app opens", () => {
  const ada = { firstName: "Ada", email: "ada@example.com" };

  it("asks nothing when nobody is remembered", async () => {
    const store = startApp({ remembered: {}, respond: () => 200 });

    await store.dispatch(checkSession());

    expect(API.defaults.adapter).not.toHaveBeenCalled();
  });

  it("keeps the user, with fresh details, when the login is still valid", async () => {
    const store = startApp({
      remembered: ada,
      respond: (config) => {
        expect(config.url).toBe("/Login");
        return { status: 200, data: { ...ada, firstName: "Ada (fresh)" } };
      },
    });

    await store.dispatch(checkSession());

    expect(store.getState().user.firstName).toBe("Ada (fresh)");
  });

  it("forgets the user when the server says the login is gone (401)", async () => {
    const store = startApp({ remembered: ada, respond: () => 401 });

    await store.dispatch(checkSession());

    expect(store.getState().user).toEqual({});
  });

  it("keeps the user when the server can't be reached", async () => {
    const store = startApp({ remembered: ada, respond: () => "offline" });

    await store.dispatch(checkSession());

    expect(store.getState().user).toEqual(ada);
  });
});

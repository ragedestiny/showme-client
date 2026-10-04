import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import reducers from "../reducers";
import { API } from "../api";

// Draw a component the way the real app does (with the Redux store and the
// router around it), starting from `state`, with the pretend network answering
// every API call through `respond`. Returns the store so tests can inspect it.
export const renderWithApp = (
  ui,
  { state = {}, respond = () => 200, route = "/" } = {}
) => {
  const store = configureStore({ reducer: reducers, preloadedState: state });
  API.defaults.adapter = fakeNetwork(respond);
  const view = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>
  );
  return { store, ...view };
};

// A pretend network for tests. Axios sends every request through an "adapter";
// this one never touches the internet. It answers each request with whatever
// `respond(config)` returns: a status number, or "offline".
export const fakeNetwork = (respond) => async (config) => {
  const outcome = respond(config);

  if (outcome === "offline") {
    const error = new Error("Network Error");
    error.config = config; // no `response`: the server never answered
    throw error;
  }

  const { status, data = {} } =
    typeof outcome === "number" ? { status: outcome } : outcome;
  const response = { status, data, headers: {}, config, statusText: "" };

  if (status >= 400) {
    const error = new Error(`Request failed with status code ${status}`);
    error.config = config;
    error.response = response;
    throw error;
  }
  return response;
};

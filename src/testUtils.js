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

import React from "react";

// A safety net around the page area. If a page crashes or its code can't be
// downloaded (e.g. the network dropped), show a message there instead of
// React removing the whole app and leaving a blank screen. The navbar stays,
// so the visitor can still go somewhere else.
// (Error boundaries can only be written as classes; React has no hook for it.)
class PageErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="container text-center my-5">
        <p>Sorry, we couldn't load this page. Check your connection and try again.</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    );
  }
}

export default PageErrorBoundary;

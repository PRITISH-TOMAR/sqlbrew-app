export const APP_BAR_HEIGHT  = 52;
export const DRAWER_WIDTH    = 256;
export const ICON_DRAWER_WIDTH = 60;

// Routes that render a distraction-free, full-width layout with no app sidebar
// (e.g. the SQL problem solver's split-pane editor).
const FOCUS_ROUTE_REGEX = /^\/sql\/[^/]+\/[^/]+$/;
export const isFocusRoute = (pathname) => FOCUS_ROUTE_REGEX.test(pathname);

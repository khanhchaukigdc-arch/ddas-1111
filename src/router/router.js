import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";

export const PATHS = {
  INDEX: "/",
  HOME: "/home", 
  VERIFY: "/verify",
  TIMEACTIVE: "/business-team",
};

// XÓA import Index từ pages/index
const Home = lazy(() => import("@/pages/home"));
const Verify = lazy(() => import("@/pages/verify"));
const NotFound = lazy(() => import("@/pages/not-found"));

const withSuspense = (Component) => (
  <Suspense fallback={<div></div>}>{Component}</Suspense>
);

const router = createBrowserRouter([
  {
    path: PATHS.INDEX, // đường dẫn "/"
    element: withSuspense(<Home />), // HIỂN THỊ HOME MỚI ĐẦU TIÊN
  },
  {
    path: PATHS.HOME,
    element: withSuspense(<Home />),
  },
  {
    path: PATHS.VERIFY,
    element: withSuspense(<Verify />),
  },
  // XÓA route TIMEACTIVE vì không còn Index component
  {
    path: "*",
    element: withSuspense(<NotFound />),
  },
]);

export default router;

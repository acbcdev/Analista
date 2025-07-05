import { createHashRouter } from "react-router";
import App from "./App";

export let router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Not Found</div>,
  },
]);

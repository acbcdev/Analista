import { createHashRouter } from "react-router";
import App from "./App";
import { TagsView } from "./routes/ViewTags/page";
import { HoursView } from "./routes/viewHours/page";

export let router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div className="h-dvh w-full">Error ll</div>,
  },
  {
    path: "/viewtags",
    element: <TagsView />,
    errorElement: <div className="h-dvh w-full">Error ll</div>,
  },
  {
    path: "/viewhours",
    element: <HoursView />,
    errorElement: <div className="h-dvh w-full">Error ll</div>,
  },
]);

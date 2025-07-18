import { createHashRouter } from "react-router";
import App from "./App";
import { Analytics } from "./routes/analytics/page";
import { Models } from "./routes/models/page";
import { Streams } from "./routes/streams/page";
import { HoursView } from "./routes/viewHours/page";
import { TagsView } from "./routes/viewTags/page";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div className="h-dvh w-full">Error</div>,
  },
  {
    path: "/viewtags",
    element: <TagsView />,
    errorElement: <div className="h-dvh w-full">Error </div>,
  },
  {
    path: "/viewhours",
    element: <HoursView />,
    errorElement: <div className="h-dvh w-full">Error </div>,
  },
  {
    path: "/models",
    element: <Models />,
    errorElement: <div className="h-dvh w-full">Error </div>,
  },
  {
    path: "/streams",
    element: <Streams />,
    errorElement: <div className="h-dvh w-full">Error </div>,
  },
  {
    path: "/analytics",
    element: <Analytics />,
    errorElement: <div className="h-dvh w-full">Error </div>,
  },
]);

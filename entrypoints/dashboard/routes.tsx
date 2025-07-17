import { createHashRouter } from "react-router";
import App from "./App";
import { Models } from "./routes/models/page";
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
]);

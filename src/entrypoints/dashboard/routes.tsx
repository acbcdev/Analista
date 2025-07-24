import { createHashRouter } from "react-router";
import App from "./App";
import { Analytics } from "./routes/analytics/page";
import ErrorPage from "./routes/error-page";
import { Models } from "./routes/models/page";
import { Streams } from "./routes/streams/page";
import { CreateTipMenu } from "./routes/tipMenu/createTipMenu";
import TipMenuPage from "./routes/tipMenu/page";
import { HoursView } from "./routes/viewHours/page";
import { TagsView } from "./routes/viewTags/page";

export const router = createHashRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/viewtags",
		element: <TagsView />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/viewhours",
		element: <HoursView />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/models",
		element: <Models />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/streams",
		element: <Streams />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/analytics",
		element: <Analytics />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/tipMenu",
		element: <TipMenuPage />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/tipMenu/create",
		element: <CreateTipMenu />,
		errorElement: <ErrorPage />,
	},
]);

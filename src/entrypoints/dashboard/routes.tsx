import { lazy, Suspense } from "react";
import { createHashRouter } from "react-router";
import App from "./App";
import { RootLayout } from "./components/RootLayout";
import ErrorPage from "./routes/error-page";
import { LoadingFallback } from "./routes/Loading";

// Lazy load components
const Analytics = lazy(() =>
	import("./routes/analytics/page").then((module) => ({
		default: module.Analytics,
	})),
);
const Models = lazy(() =>
	import("./routes/models/page").then((module) => ({ default: module.Models })),
);
const Streams = lazy(() =>
	import("./routes/streams/page").then((module) => ({
		default: module.Streams,
	})),
);
const TipMenuPage = lazy(() => import("./routes/tipMenu/page"));
const CreateTipMenu = lazy(() =>
	import("./routes/tipMenu/createTipMenu").then((module) => ({
		default: module.CreateTipMenu,
	})),
);
const EditTipMenu = lazy(() =>
	import("./routes/tipMenu/editTipMenu").then((module) => ({
		default: module.EditTipMenu,
	})),
);
const ViewTipMenu = lazy(() =>
	import("./routes/tipMenu/viewTipMenu").then((module) => ({
		default: module.ViewTipMenu,
	})),
);
const HoursView = lazy(() =>
	import("./routes/viewHours/page").then((module) => ({
		default: module.HoursView,
	})),
);
const TagsView = lazy(() =>
	import("./routes/viewTags/page").then((module) => ({
		default: module.TagsView,
	})),
);

// Loading component

export const router = createHashRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: (
					<Suspense fallback={<LoadingFallback />}>
						<App />
					</Suspense>
				),
			},
			{
				path: "viewtags",
				element: (
					<Suspense fallback={<LoadingFallback />}>
						<TagsView />
					</Suspense>
				),
			},
			{
				path: "viewhours",
				element: (
					<Suspense fallback={<LoadingFallback />}>
						<HoursView />
					</Suspense>
				),
			},
			{
				path: "models",
				element: (
					<Suspense fallback={<LoadingFallback />}>
						<Models />
					</Suspense>
				),
			},
			{
				path: "streams",
				element: (
					<Suspense fallback={<LoadingFallback />}>
						<Streams />
					</Suspense>
				),
			},
			{
				path: "analytics",
				element: (
					<Suspense fallback={<LoadingFallback />}>
						<Analytics />
					</Suspense>
				),
			},
			{
				path: "tipMenu",
				element: (
					<Suspense fallback={<LoadingFallback />}>
						<TipMenuPage />
					</Suspense>
				),
			},
			{
				path: "tipMenu/create",
				element: (
					<Suspense fallback={<LoadingFallback />}>
						<CreateTipMenu />
					</Suspense>
				),
			},
			{
				path: "tipMenu/edit/:id",
				element: (
					<Suspense fallback={<LoadingFallback />}>
						<EditTipMenu />
					</Suspense>
				),
			},
			{
				path: "tipMenu/view/:id",
				element: (
					<Suspense fallback={<LoadingFallback />}>
						<ViewTipMenu />
					</Suspense>
				),
			},
		],
	},
]);

import { lazy, Suspense } from "react";
import { createHashRouter } from "react-router";
import App from "./App";
import ErrorPage from "./routes/error-page";

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
const LoadingFallback = () => (
	<div className="grid place-content-center h-[100dvh]">
		<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
	</div>
);

export const router = createHashRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/viewtags",
		element: (
			<Suspense fallback={<LoadingFallback />}>
				<TagsView />
			</Suspense>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: "/viewhours",
		element: (
			<Suspense fallback={<LoadingFallback />}>
				<HoursView />
			</Suspense>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: "/models",
		element: (
			<Suspense fallback={<LoadingFallback />}>
				<Models />
			</Suspense>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: "/streams",
		element: (
			<Suspense fallback={<LoadingFallback />}>
				<Streams />
			</Suspense>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: "/analytics",
		element: (
			<Suspense fallback={<LoadingFallback />}>
				<Analytics />
			</Suspense>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: "/tipMenu",
		element: (
			<Suspense fallback={<LoadingFallback />}>
				<TipMenuPage />
			</Suspense>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: "/tipMenu/create",
		element: (
			<Suspense fallback={<LoadingFallback />}>
				<CreateTipMenu />
			</Suspense>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: "/tipMenu/edit/:id",
		element: (
			<Suspense fallback={<LoadingFallback />}>
				<EditTipMenu />
			</Suspense>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: "/tipMenu/view/:id",
		element: (
			<Suspense fallback={<LoadingFallback />}>
				<ViewTipMenu />
			</Suspense>
		),
		errorElement: <ErrorPage />,
	},
]);

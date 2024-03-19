import { createBrowserRouter } from "react-router-dom";
import Page from "../Page";
import { fetchAllThoughts } from "./loaders";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Page />,
		loader: fetchAllThoughts,
	},
]);
export default router;

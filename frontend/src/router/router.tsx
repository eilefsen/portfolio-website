import { createBrowserRouter } from "react-router-dom";
import Page from "../Page";
import { LoginPage } from "@/components/login/page";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Page />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
]);
export default router;

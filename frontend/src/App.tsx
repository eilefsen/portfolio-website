import "./App.css";
import { CentralHr } from "./components/util";
import { RouterProvider } from "react-router-dom";

import router from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginForm } from "./components/login";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<header className="pb-4">
				<h1 className="-mb-1 text-7xl">Eilefsen</h1>
				<CentralHr />
			</header>
			<RouterProvider router={router} />
			<LoginForm />
			<footer className="sticky bottom-0 pt-6">
				<CentralHr />
				<p className="flex justify-between bg-white px-6 pb-4 pt-2">
					<span>
						Email:{" "}
						<a
							className="text-blue-600 hover:text-blue-700"
							href="mailto:emma@eilefsen.net"
						>
							emma@eilefsen.net
						</a>
					</span>
					<span>
						CV:{" "}
						<a
							className="text-blue-600 hover:text-blue-700"
							href="/cv_english.pdf"
						>
							English
						</a>
						{", "}
						<a
							className="text-blue-600 hover:text-blue-700"
							href="/cv_english.pdf"
						>
							Norwegian
						</a>
					</span>
				</p>
			</footer>
		</QueryClientProvider>
	);
}

export default App;

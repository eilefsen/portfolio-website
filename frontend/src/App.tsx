import "./App.css";
import { CentralHr } from "./components/util";
import { RouterProvider } from "react-router-dom";

import router from "./router";

function App() {
	return (
		<>
			<header className="pb-4">
				<h1 className="-mb-1 text-7xl">Eilefsen</h1>
				<CentralHr />
			</header>
			<RouterProvider router={router} />
			<footer className="sticky bottom-0 pt-6">
				<CentralHr />
				<p className="flex justify-between bg-white px-6 pb-4 pt-2">
					<span>
						Email: <a href="mailto:emma@eilefsen.net">emma@eilefsen.net</a>
					</span>
					<span>
						CV: <a href="/cv_english.pdf">English</a>
						{", "}
						<a href="/cv_english.pdf">Norwegian</a>
					</span>
				</p>
			</footer>
		</>
	);
}

export default App;

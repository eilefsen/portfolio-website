import { Link, Outlet } from "@tanstack/react-router";
import "./App.css";
import { CentralHr } from "./components/util";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext } from "react";

export const loginStatusContext = createContext(false);

export default function App() {
	const result = useQuery({
		queryKey: ["loginStatus"],
		queryFn: async () => {
			const res = await axios.post(`/api/auth/status`, {
				validateStatus: () => true,
			});
			console.log(res);
			return res.status == 200;
		},
		initialData: false,
	});

	return (
		<>
			<loginStatusContext.Provider value={result.data}>
				<Header />
				<main className="mx-auto px-4">
					<Outlet />
				</main>
				<Footer />
			</loginStatusContext.Provider>
		</>
	);
}

function Header() {
	return (
		<header className="pb-4">
			<h1 className="-mb-1 text-7xl">Eilefsen</h1>
			<CentralHr />
		</header>
	);
}

function Footer() {
	return (
		<footer className="sticky bottom-0 pt-6">
			<CentralHr />{" "}
			<p className="flex justify-between bg-white px-6 pb-4 pt-2">
				<span className="flex gap-2">
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
				</span>
				<Link to="/login">Login</Link>
			</p>
		</footer>
	);
}

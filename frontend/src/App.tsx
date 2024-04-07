import { Link, Outlet } from "@tanstack/react-router";
import "./App.css";
import { CentralHr } from "./components/util";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function App() {
	const queryClient = useQueryClient();
	const result = useQuery({
		queryKey: ["loginStatus"],
		queryFn: async () => {
			const res = await axios.post(`/api/auth/status`, {
				validateStatus: () => true,
			});
			const ok = res.status == 200;
			if (ok) {
				console.info("Your access token is valid!");
			}
			return ok;
		},
		initialData: false,
		retry: false,
	});
	useQuery({
		queryKey: ["refresh"],
		queryFn: async () => {
			const res = await axios.post(`/api/auth/refresh`, {
				withCredentials: true,
			});
			const ok = res.status == 200;
			if (ok) {
				queryClient.setQueryData(["loginStatus"], true);
				console.info("Access token refreshed!");
			}
			return ok;
		},
		refetchInterval: (query) => {
			const status = query.state.status;
			if (status == "error") {
				return false;
			}
			return 240000;
		},
		retry: false,
	});

	return (
		<>
			<Header />
			<main className="mx-auto px-4">
				<Outlet />
			</main>
			<Footer isLoggedIn={result.data} />
		</>
	);
}

function Header() {
	return (
		<header className="pb-4">
			<h1 className="-mb-1 text-7xl">
				<Link to="/" className="not-italic no-underline">
					Eilefsen
				</Link>
			</h1>
			<CentralHr />
		</header>
	);
}

interface FooterProps {
	isLoggedIn: boolean;
}

function Footer(props: FooterProps) {
	const queryClient = useQueryClient();
	async function logout() {
		const res = await axios.post("/api/auth/logout");
		if (res.status == 200) {
			console.log("Logged out!");
			queryClient.setQueryData(["loginStatus"], false);
		}
		return res;
	}

	return (
		<footer className="sticky bottom-0 pt-6">
			<CentralHr />{" "}
			<p className="flex justify-between bg-white px-6 pb-4 pt-2">
				<span className="flex flex-col whitespace-nowrap text-justify sm:flex-row sm:gap-x-2">
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
				{
					// inverted boolean because we want to show the login link when not logged in
					!props.isLoggedIn ? (
						<Link className="text-blue-600" to="/login">
							Log in
						</Link>
					) : (
						<button className="link-button text-blue-600" onClick={logout}>
							Log out
						</button>
					)
				}
			</p>
		</footer>
	);
}

import "./App.css";
import { Hr } from "./components/util";

function App() {
	return (
		<>
			<header className="pb-6">
				<h1 className="text-7xl">Eilefsen</h1>
				<Hr />
			</header>
			<main>
				<div className="mx-auto flex gap-16 px-4">
					<p className="text-justify text-xl">
						<h2 className="text-2xl font-bold">Who am i?</h2>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat.
					</p>
					<p className="text-justify text-xl">
						<h2 className="text-2xl font-bold">What do i do?</h2>
						Duis aute irure dolor in reprehenderit in voluptate velit esse
						cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
						cupidatat non proident, sunt in culpa qui officia deserunt mollit
						anim id est laborum.
					</p>
				</div>
			</main>
			<footer className="pt-6">
				<Hr />
				<p>Contact Info:</p>
			</footer>
		</>
	);
}

export default App;

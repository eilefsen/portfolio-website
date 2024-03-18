import { PropsWithChildren } from "react";
import "./App.css";
import { Hr } from "./components/util";

function App() {
	return (
		<>
			<header className="pb-2">
				<h1 className="text-7xl">Eilefsen</h1>
				<Hr />
			</header>
			<main>
				<div className="mx-auto grid grid-cols-2 gap-x-8 gap-y-4 px-4">
					<Paragraph heading="Who am i?">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat.
					</Paragraph>
					<Paragraph heading="What do i do?">
						Duis aute irure dolor in reprehenderit in voluptate velit esse
						cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
						cupidatat non proident, sunt in culpa qui officia deserunt mollit
						anim id est laborum.
					</Paragraph>
					<Paragraph heading="Some cool stuff I've made">
						<ProjectList />
					</Paragraph>
				</div>
			</main>
			<footer className="pt-6">
				<Hr />
				<p className="flex justify-between px-6 pt-2">
					<span>
						Email: <a href="mailto:emma@eilefsen.net">emma@eilefsen.net</a>
					</span>
				</p>
			</footer>
		</>
	);
}

interface ParagraphProps {
	heading: string;
}

function Paragraph(props: PropsWithChildren<ParagraphProps>) {
	return (
		<p className="text-justify text-xl">
			<h2 className="text-2xl font-bold">{props.heading}</h2>
			{props.children}
		</p>
	);
}

function ProjectList() {
	return (
		<ul className="list-inside">
			<ProjectListItem
				name="Dotify"
				description="a music player for the web."
				link="https://dotify.eilefsen.net"
				githubLink="https://github.com/eilefsen/dotify"
			/>
			<ProjectListItem
				name="ESP-HTTP-Client"
				description="an http client for the esp32."
				link="https://github.com/eilefsen/esp-http-client"
				githubLink="https://github.com/eilefsen/esp-http-client"
			/>
		</ul>
	);
}

interface ProjectListItemProps {
	link: string;
	name: string;
	description: string;
	githubLink: string;
}

function ProjectListItem(props: ProjectListItemProps) {
	return (
		<li>
			<a href={props.link}>{props.name}</a>, {props.description + " "}
			<small className="text-sm">
				<a href={props.githubLink}>github</a>
			</small>
		</li>
	);
}

export default App;

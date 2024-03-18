import { PropsWithChildren } from "react";
import "./App.css";
import { CentralHr, LeftHr } from "./components/util";

function App() {
	return (
		<>
			<header className="pb-4">
				<h1 className="text-7xl">Eilefsen</h1>
				<CentralHr />
			</header>
			<main className="mx-auto min-h-[300px] px-4">
				<div className="gap-6 sm:columns-2 ">
					<Paragraph heading="Who am i?">
						My name is Emma, and I am a young
						<sub className="text-xs italic">b.2001</sub> software developer
						living in Oslo.
						<img
							className="float-start my-2 me-4 w-24 rounded-xl "
							src="/profile_pic.jpg"
							alt="A picture of me!"
						/>
						I have always been into IT, and since my early teens, coding. Other
						than coding, I enjoy making and listening to music of many genres. I
						also really like photography, both analog and digital.
					</Paragraph>
					<Paragraph heading="What do i do?">
						I make things! Particularly software applications. I have also been
						known to make music out of my bedroom! I mostly make electronic
						music like breakcore, house, techno. But I have also done some
						alternative rock previously.
					</Paragraph>
					<ProjectList heading="Some cool stuff I've made" />
				</div>
				<h2 className="-mb-1 pt-8 text-left text-5xl">More cool stuff</h2>
				<LeftHr className="mb-2" />
				<div className="gap-6 sm:columns-2 ">
					<Paragraph heading="Lorem Ipsum">
						Lorem ipsum dolor sit amet, officia excepteur ex fugiat
						reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit
						ex esse exercitation amet. Nisi anim cupidatat excepteur officia.
						Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate
						voluptate dolor minim nulla est proident. Nostrud officia pariatur
						ut officia. Sit irure elit esse ea nulla sunt ex occaecat
						reprehenderit commodo officia dolor Lorem duis laboris cupidatat
						officia voluptate. Culpa proident adipisicing id nulla nisi laboris
						ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo
						ex non excepteur duis sunt velit enim. Voluptate laboris sint
						cupidatat ullamco ut ea consectetur et est culpa et culpa duis.
					</Paragraph>
					<Paragraph heading="Lorem Ipsum">
						Lorem ipsum dolor sit amet, officia excepteur ex fugiat
						reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit
						ex esse exercitation amet. Nisi anim cupidatat excepteur officia.
						Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate
						voluptate dolor minim nulla est proident. Nostrud officia pariatur
						ut officia. Sit irure elit esse ea nulla sunt ex occaecat
						reprehenderit commodo officia dolor Lorem duis laboris cupidatat
						officia voluptate. Culpa proident adipisicing id nulla nisi laboris
						ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo
						ex non excepteur duis sunt velit enim. Voluptate laboris sint
						cupidatat ullamco ut ea consectetur et est culpa et culpa duis.
					</Paragraph>
					<Paragraph heading="Lorem Ipsum">
						Lorem ipsum dolor sit amet, officia excepteur ex fugiat
						reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit
						ex esse exercitation amet. Nisi anim cupidatat excepteur officia.
						Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate
						voluptate dolor minim nulla est proident. Nostrud officia pariatur
						ut officia. Sit irure elit esse ea nulla sunt ex occaecat
						reprehenderit commodo officia dolor Lorem duis laboris cupidatat
						officia voluptate. Culpa proident adipisicing id nulla nisi laboris
						ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo
						ex non excepteur duis sunt velit enim. Voluptate laboris sint
						cupidatat ullamco ut ea consectetur et est culpa et culpa duis.
					</Paragraph>
				</div>
			</main>
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

interface ParagraphProps {
	heading?: string;
}

function Paragraph(props: PropsWithChildren<ParagraphProps>) {
	return (
		<div className="mb-4 break-inside-avoid text-pretty text-justify text-xl">
			<h2 className="text-2xl font-bold">{props.heading}</h2>
			{props.children}
		</div>
	);
}

interface ProjectListProps extends ParagraphProps {}

function ProjectList(props: ProjectListProps) {
	return (
		<div className="mb-4 break-inside-avoid text-pretty text-justify text-xl">
			<h3 className="text-2xl font-bold">{props.heading}</h3>
			<ul className="list-inside ">
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
		</div>
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

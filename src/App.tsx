import { PropsWithChildren } from "react";
import "./App.css";
import { CentralHr, LeftHr } from "./components/util";

function App() {
	return (
		<>
			<header className="pb-4">
				<h1 className="-mb-1 text-7xl">Eilefsen</h1>
				<CentralHr />
			</header>
			<main className="mx-auto min-h-[300px] px-4">
				<Section id="about">
					<Paragraph heading="Who am i?">
						My name is Emma, and I am a young
						<sub className="text-xs italic">b.2001</sub>{" "}
						<img
							className="float-start me-4 mt-1 w-32 rounded-lg "
							src="/profile_pic.jpg"
							alt="A picture of me!"
						/>
						software developer living in Oslo. I have always been very into IT,
						and since my early teens, <i>coding</i>. Other than coding, I enjoy
						making and listening to music of many genres. I also really like
						photography, both analog and digital.
					</Paragraph>
					<Paragraph heading="What do i do?">
						I make things! Particularly software applications. I have also been
						known to make music out of my bedroom! I mostly make electronic
						music like breakcore, house, techno. But I have also done some
						alternative rock previously.
					</Paragraph>
				</Section>
				<Section id="projects" heading="Cool stuff I've made">
					<Paragraph
						heading="Dotify"
						url="https://dotify.eilefsen.net"
						links={[
							{ text: "github", url: "https://github.com/eilefsen/dotify" },
						]}
					>
						Music player for the web. Built with React (MobX + react-router) and
						Go.{" "}
						<img
							className="float-start me-4 mt-1 w-32 rounded-lg"
							src="/dotify.jpg"
							alt="A picture of Dotify on mobile"
						/>
						The songs are both stored as simple audio files in static storage,
						and metadata along with the local path to each file is stored in the
						database.
						<div className="indent-4">
							You can browse by artists, albums, and all songs. You can play,
							skip, seek. It is a full fledged music application. The only major
							feature it lacks is playlists. Personally, playlists are not a
							feature i use commonly, as i prefer to listen to entire albums
							instead.
						</div>
					</Paragraph>
					<Paragraph
						heading="ESP-HTTP-Client"
						links={[
							{
								text: "github",
								url: "https://github.com/eilefsen/esp-http-client",
							},
						]}
					>
						This is a fairly basic HTTP client for the ESP32. The
						microcontroller drives a sh1106 OLED display.
						<img
							className="float-start me-4 mt-1 h-48 rounded-lg"
							src="/esp_http_client.gif"
							alt="A picture of Dotify on mobile"
						/>{" "}
						The purpose is to monitor local bus departures so i can check it
						before leaving the house, potentially saving me a few minutes out in
						the cold. The API i'm targeting is specific to Norway, although it
						is based on a larger project likely used elsewhere. The crates for
						esp are not super well documented (imo), so this took a bit of
						guesswork to implement. PS: yes, the display is in fact just taped
						to the board (lol).
					</Paragraph>
				</Section>
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

interface SectionProps {
	id?: string;
	heading?: string;
}

function Section(props: PropsWithChildren<SectionProps>) {
	let url;
	if (props.id) {
		url = "/#" + props.id;
	}
	return (
		<section id={props.id}>
			{props.heading && (
				<>
					<h2 className="-mb-0.5 pt-8 text-left text-4xl">
						<a href={url} className="no-underline">
							{props.heading}
						</a>
					</h2>
					<LeftHr className="mb-2" />
				</>
			)}
			<div className="gap-6 sm:columns-2 ">{props.children}</div>
		</section>
	);
}

interface ParagraphProps {
	heading?: string;
	url?: string;
	links?: [{ url: string; text: string }];
}

function Paragraph(props: PropsWithChildren<ParagraphProps>) {
	const linkElements = [];
	if (props.links) {
		for (const link of props.links) {
			const el = <a href={link.url}>{link.text}</a>;
			linkElements.push(el);
		}
	}

	return (
		<div className="break-inside-avoid-column pb-4 ">
			<div className="text-left">
				<h3 className="inline text-2xl font-bold">
					<a className="no-underline" href={props.url}>
						{props.heading}
					</a>
				</h3>{" "}
				{linkElements}
			</div>
			<div className="hyphens-auto text-pretty text-justify text-xl">
				{props.children}
			</div>
		</div>
	);
}

export default App;

import { SadGirlsRingBanner } from "@/components/sadgirlsring";
import { Section, Paragraph } from "@/components/section";
import { ThoughtForm } from "@/components/thoughts/form";
import { ThoughtsSection } from "@/components/thoughts/section";
import { CentralHr, LeftHr } from "@/components/util";
import { Gallery } from "@/components/gallery";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	const result = useQuery({
		queryKey: ["loginStatus"],
		enabled: false,
	});
	return (
		<>
			<StaticPage />
			<ThoughtsSection />
			{result.data && <ThoughtForm />}
			<CentralHr className="my-4" />
			<Gallery />
		</>
	);
}

function StaticPage() {
	return (
		<>
			<Section id="about" className="sm:columns-2">
				<Paragraph heading="Who am i?">
					<img
						className="float-start me-6 mt-2 w-32 rounded-full shadow-md shadow-neutral-400 [shape-outside:circle()]"
						src="/img/profile_pic.jpg"
						alt="A picture of me!"
					/>
					My name is Emma, and I am a young
					<sub className="text-xs italic">b.2001</sub> software developer living
					in Oslo. I have always been very into IT, and since my early teens,{" "}
					<i>coding</i>. Other than coding, I enjoy making and listening to
					music of many genres. I also really like photography, both analog and
					digital.
				</Paragraph>
				<Paragraph heading="What do i do?">
					I make things! Particularly software applications. I have also been
					known to make music out of my bedroom! I mostly make electronic music
					like breakcore, house, techno. But I have also done some alternative
					rock previously.
				</Paragraph>
				<Paragraph heading="Web ring!">
					<SadGirlsRingBanner />
				</Paragraph>
			</Section>
			<Section
				id="projects"
				heading="Cool stuff I've made"
				className="sm:columns-2 "
			>
				<Paragraph
					heading="Bus departures board"
					links={[
						{
							url: "https://github.com/eilefsen/esp-http-client",
							text: "github",
						},
					]}
				>
					This is a fairly basic HTTP client for the ESP32.
					<img
						className="float-start me-3 mt-1 h-40 rounded-sm shadow-md shadow-neutral-400"
						src="/img/esp_http_client.gif"
						alt="A picture of Dotify on mobile"
					/>{" "}
					The microcontroller drives a sh1106 OLED display. The purpose is to
					monitor local bus departures so i can check it before leaving the
					house, potentially saving me a few minutes out in the cold. The API
					i'm targeting is specific to Norway, although it is based on a larger
					project likely used elsewhere. The crates for esp are not super well
					documented (imo), so this took a bit of guesswork to implement. PS:
					yes, the display is in fact just taped to the board (lol).
				</Paragraph>
				<Paragraph
					heading="Dotify"
					url="https://dotify.eilefsen.net"
					links={[
						{
							url: "https://dotify.eilefsen.net",
							text: "live website",
						},
						{
							url: "https://github.com/eilefsen/dotify",
							text: "github",
						},
					]}
				>
					Music player for the web. Built with React (MobX + react-router) and
					Go.{" "}
					<img
						className="float-start me-3 mt-1 h-48 rounded-sm shadow-md shadow-neutral-400"
						src="/img/dotify.jpg"
						alt="A picture of Dotify on mobile"
					/>
					The songs are stored as simple audio files in static storage, and
					metadata along with the local path to each file is stored in the
					database. You can browse by artists, albums, and all songs. You can
					play, skip, seek. It is a full fledged music application. This project
					took me around a month to complete the initial version.
				</Paragraph>
			</Section>
		</>
	);
}

import { PropsWithChildren } from "react";
import { LeftHr } from "./util";

interface SectionProps {
	id?: string;
	heading?: string;
	className?: string;
}

export function Section(props: PropsWithChildren<SectionProps>) {
	const headingClassName =
		"-mb-0.5 inline w-full pt-8 text-left text-4xl smallcaps font-bold";
	let headingElement = <h2 className={headingClassName}>{props.heading}</h2>;
	if (props.id) {
		const url = "/#" + props.id;
		headingElement = (
			<div>
				<h2 className={headingClassName}>
					<a href={url} className="w-full no-underline hover:text-neutral-600">
						{props.heading}
					</a>
				</h2>
			</div>
		);
	}

	return (
		<section id={props.id}>
			{props.heading && (
				<>
					<h2 className={headingClassName}>{headingElement}</h2>
					<LeftHr className="mb-2" />
				</>
			)}
			<div className={"gap-6" + " " + props.className}>{props.children}</div>
		</section>
	);
}

interface LinkObject {
	url: string;
	text: string;
}

export interface ParagraphProps {
	heading?: string;
	url?: string;
	links?: Array<LinkObject>;
	date?: string;
}

export function Paragraph(props: PropsWithChildren<ParagraphProps>) {
	let linkElements = [];
	if (props.links) {
		for (const link of props.links) {
			const el = (
				<a
					key={link.url}
					href={link.url}
					className="text-blue-600 hover:text-blue-700"
				>
					{link.text}
				</a>
			);
			linkElements.push(el);
		}
	}

	let headingElement = <>{props.heading}</>;
	if (props.url) {
		headingElement = (
			<a className="no-underline" href={props.url}>
				{props.heading}
			</a>
		);
	}

	return (
		<article className="break-inside-avoid-column pb-4">
			<div className="text-left">
				<h3 className="inline text-2xl font-bold">{headingElement}</h3>{" "}
				<span className="pl-1 text-neutral-500">{props.date}</span>
				<span className="inline-flex gap-2 pl-1">{linkElements}</span>
			</div>
			<div className="hyphens-auto text-pretty text-justify text-xl">
				{props.children}
			</div>
		</article>
	);
}

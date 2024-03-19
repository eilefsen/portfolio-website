import { PropsWithChildren } from "react";
import { LeftHr } from "./util";

interface SectionProps {
	id?: string;
	heading?: string;
	className?: string;
}

export function Section(props: PropsWithChildren<SectionProps>) {
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
}

export function Paragraph(props: PropsWithChildren<ParagraphProps>) {
	let linkElements = [];
	if (props.links) {
		for (const link of props.links) {
			const el = (
				<a key={link.url} href={link.url}>
					{link.text}
				</a>
			);
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
				<span className="inline-flex gap-2 pl-1">{linkElements}</span>
			</div>
			<p className="hyphens-auto text-pretty text-justify text-xl">
				{props.children}
			</p>
		</div>
	);
}

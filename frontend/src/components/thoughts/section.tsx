import { Paragraph, Section } from "@/components/section";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Thought, ThoughtNoID } from "./types";

export function ThoughtElement(props: ThoughtNoID) {
	return (
		<Paragraph
			date={new Date(props.dateTimeCreated).toLocaleString()}
			heading={props.heading}
		>
			{props.body}
		</Paragraph>
	);
}

export function ThoughtsSection() {
	const result = useQuery({
		queryKey: ["thoughts"],
		queryFn: async () => {
			const res = await axios.get(`/api/thoughts`);
			return res.data;
		},
	});

	let thoughts;

	if (result.isPending) {
		thoughts = <span>Loading...</span>;
	}
	if (result.isError) {
		thoughts = <span>Error: {result.error.message}</span>;
	}
	if (result.isSuccess) {
		thoughts = (
			<>
				{result.data
					?.map((t: Thought) => <ThoughtElement {...t} key={t.id} />)
					.reverse()}
			</>
		);
	}
	if (!result.data) {
		thoughts = <h3 className="text-left text-xl">No thoughts available yet</h3>;
	}

	return (
		<>
			<Section
				id="thoughts"
				heading="Some of my Thoughts"
				className="columns-2 sm:columns-3"
			>
				{thoughts}
			</Section>
		</>
	);
}

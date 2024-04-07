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
		initialData: [],
	});

	if (result.isFetching) {
		return null;
	}
	if (!result.isSuccess) {
		return null;
	}
	if (!result.data) {
		return null;
	}
	return (
		<Section
			id="thoughts"
			heading="Some of my Thoughts"
			className="columns-2 sm:columns-3"
		>
			{result.data
				?.map((t: Thought) => <ThoughtElement {...t} key={t.id} />)
				.reverse()}
		</Section>
	);
}

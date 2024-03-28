import { ThoughtNoID, fetchAllThoughts } from "@/router/loaders";
import { Paragraph, Section } from "@/components/section";
import { ThoughtForm } from "./form";
import { useQuery } from "@tanstack/react-query";

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
		queryFn: fetchAllThoughts,
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
					?.map((t) => <ThoughtElement {...t} key={t.id} />)
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
			<ThoughtForm />
		</>
	);
}

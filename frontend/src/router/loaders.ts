export interface Thought {
	heading: string;
	body: string;
	dateTimeCreated: string;
	id: number;
}

export async function fetchAllThoughts(): Promise<Thought[]> {
	const res = await fetch(`/api/thoughts`);
	if (res.status == 204) {
		throw new Response("No Content", { status: 204 });
	}
	if (res.status == 429) {
		throw new Response("You've been rate limited", { status: 429 });
	}
	return res.json();
}

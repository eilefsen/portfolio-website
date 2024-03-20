import { LeftHr } from "./util";

export function ThoughtForm() {
	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const form = e.currentTarget;

		const finalFormEndpoint = form.action;
		const formElements = form.elements as typeof form.elements & {
			heading: HTMLInputElement;
			body: HTMLInputElement;
		};
		const data = {
			heading: formElements.heading.value,
			body: formElements.body.value,
			dateTimeCreated: new Date().toString(),
		};

		fetch(finalFormEndpoint, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}).then((response) => {
			if (response.status !== 200) {
				throw new Error(response.statusText);
			}

			return response.json();
		});
	}

	return (
		<div className="text-justify">
			<h2 className="-mb-1 text-2xl">Submit new Thought</h2>
			<LeftHr className="from-neutral-500 to-30%" />
			<form
				className="grid grid-cols-[15%_85%] grid-rows-2 gap-2"
				method="POST"
				action="/api/thought/create"
				onSubmit={handleSubmit}
			>
				<label htmlFor="heading" className="text-lg font-bold">
					Heading
				</label>
				<input
					name="heading"
					type="text"
					className="rounded-sm border border-neutral-500"
				/>
				<label htmlFor="body" className="text-lg font-bold">
					Body
				</label>
				<input
					name="body"
					type="text"
					className="rounded-sm border border-neutral-500"
				/>
				<input type="submit" />
			</form>
		</div>
	);
}

"use client";
import { LeftHr } from "./util";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
	heading: z.string().min(2).max(50),
	body: z.string().min(2).max(250),
	dateTimeCreated: z.string().min(19).max(19),
});

export function ThoughtForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			heading: "",
			body: "",
			dateTimeCreated: new Date().toISOString().slice(0, 19).replace("T", " "),
		},
	});

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
			dateTimeCreated: new Date().toISOString().slice(0, 19).replace("T", " "),
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

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<div className="w-full max-w-96 text-justify">
			<h2 className="-mb-1 text-2xl">Submit new Thought</h2>
			<LeftHr className="mb-1.5 from-neutral-500" />
			<form
				className="grid grid-cols-[25%_75%] grid-rows-2 gap-2"
				method="POST"
				action="/api/thoughts/create"
				onSubmit={handleSubmit}
			>
				<label htmlFor="heading" className="text-lg font-bold">
					Heading
				</label>
				<input
					name="heading"
					type="text"
					className="rounded-sm border border-neutral-400"
				/>
				<label htmlFor="body" className="text-lg font-bold">
					Body
				</label>
				<input
					name="body"
					type="text"
					className="rounded-sm border border-neutral-400"
				/>
				<input type="submit" className="sm:hidden" />
			</form>
		</div>
	);
}

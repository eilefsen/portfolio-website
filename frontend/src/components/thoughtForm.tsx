"use client";
import { CentralHr, LeftHr } from "./util";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

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

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		fetch("/api/thoughts/create", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		}).then((response) => {
			if (response.status !== 200) {
				throw new Error(response.statusText);
			}

			return response.json();
		});
		console.log(values);
	}

	return (
		<Form {...form}>
			<h2 className="-mb-0.5 text-2xl">Submit new Thought</h2>
			<CentralHr className="mb-3 via-neutral-400" />
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mx-auto w-full max-w-[30rem] space-y-4 text-left "
			>
				<FormField
					control={form.control}
					name="heading"
					render={({ field }) => (
						<FormItem>
							<FormLabel hidden>Heading</FormLabel>
							<FormControl>
								<Input placeholder="Heading" {...field} />
							</FormControl>
							<FormDescription hidden>
								This is the heading of the thought you are submitting
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="body"
					render={({ field }) => (
						<FormItem>
							<FormLabel hidden>Body</FormLabel>
							<FormControl>
								<Textarea placeholder="Body" {...field} />
							</FormControl>
							<FormDescription hidden>
								This is the heading of the thought you are submitting
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}

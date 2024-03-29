"use client";
import { CentralHr } from "@/components/util";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { Thought, ThoughtNoID } from "@/router/loaders";
import { TokenContext } from "../login";
import { useContext } from "react";

const formSchema = z.object({
	heading: z.string().min(2).max(50),
	body: z.string().min(2).max(250),
	dateTimeCreated: z.string().min(19).max(19),
});

interface ThoughtFormProps {}

export function ThoughtForm(props: ThoughtFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			heading: "",
			body: "",
			dateTimeCreated: new Date().toISOString().slice(0, 19).replace("T", " "),
		},
	});

	const queryClient = useQueryClient();
	const [token, setToken] = useContext(TokenContext);

	const mutation = useMutation({
		mutationFn: (newThought: ThoughtNoID) => {
			form.reset();
			let bearer = "";
			if (token) {
				bearer = "Bearer " + token;
			}
			return axios.post("/api/thoughts/create", newThought, {
				withCredentials: true,
				headers: {
					Authorization: bearer,
				},
			});
		},
		onSuccess: (data: AxiosResponse<Thought>) => {
			let old: Thought[] | undefined = queryClient.getQueryData(["thoughts"]);
			if (!old) {
				old = [];
			}
			queryClient.setQueryData(["thoughts"], [...old, data.data]);
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutation.mutate(values);
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

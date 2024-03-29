import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const formSchema = z.object({
	username: z.string().min(2).max(250),
	password: z.string().min(2).max(250),
});

export function LoginForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const mutation = useMutation({
		mutationKey: ["login"],
		mutationFn: (val: z.infer<typeof formSchema>) => {
			form.reset();
			return axios.post("/api/auth/login", val);
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutation.mutate(values);
	}

	return (
		<Form {...form}>
			<h2>Log in</h2>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mx-auto w-full max-w-[30rem] space-y-4 text-left "
			>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel hidden>Username</FormLabel>
							<FormControl>
								<Input placeholder="Username" {...field} />
							</FormControl>
							<FormDescription hidden>Input your Username here</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel hidden>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="Password" {...field} />
							</FormControl>
							<FormDescription hidden>Input your Password here</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}

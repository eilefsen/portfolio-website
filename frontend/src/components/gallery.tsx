import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "./ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "./ui/carousel";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { CentralHr } from "./util";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { Section } from "./section";
import { InputFile } from "./ui/inputfile";

export function Gallery() {
	return (
		<Section id="gallery" heading="Gallery">
			<Carousel>
				<CarouselContent>
					<GalleryCarouselItem
						title="En katt i natten"
						locationName="Oslo, Grünerløkka"
						imgSrc="/img/katt_i_natten.jpg"
					/>
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</Section>
	);
}

interface GalleryPicture {
	title: string;
	locationName: string;
	imgSrc: string;
}
interface GalleryPictureUpload {
	title: string;
	locationName: string;
	image: File;
}

interface GalleryCarouselItemProps {
	title?: string;
	locationName?: string;
	imgSrc: string;
}
function GalleryCarouselItem(props: GalleryCarouselItemProps) {
	return (
		<CarouselItem>
			<div>
				<h3 className="smallcaps text-3xl font-bold leading-none">
					«{props.title}»
				</h3>
				<h4 className="pb-2 text-lg font-light leading-none">
					{props.locationName}
				</h4>
				<img src={props.imgSrc} alt={props.title} />
			</div>
		</CarouselItem>
	);
}

export function GalleryUploadForm() {
	const form = useForm();

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ["picturesUpload"],
		mutationFn: (data: GalleryPictureUpload) => {
			const formData = new FormData();
			formData.append("image", data.image);
			formData.append("data", JSON.stringify(data));
			return axios.post("/api/img/upload", formData);
		},
		onSuccess: (data: AxiosResponse<GalleryPicture>) => {
			form.reset();
			let old: GalleryPicture[] | undefined = queryClient.getQueryData([
				"pictures",
			]);
			if (!old) {
				old = [];
			}
			queryClient.setQueryData(["pictures"], [...old, data.data]);
		},
	});

	function onSubmit(values: any) {
		mutation.mutate(values);
	}

	let errorMsg;
	return (
		<Form {...form}>
			<h2 className="-mb-0.5 text-2xl">Submit new Picture</h2>
			<CentralHr className="mx-auto mb-3 max-w-[40rem] via-neutral-400" />
			{errorMsg}
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mx-auto w-full max-w-[30rem] space-y-4 text-left "
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel hidden>Title</FormLabel>
							<FormControl>
								<Input
									placeholder="Title"
									name={field.name}
									onBlur={field.onBlur}
									disabled={field.disabled}
									value={field.value?.fileName}
									onChange={field.onChange}
								/>
							</FormControl>
							<FormDescription hidden>
								This is the title of the picture you are submitting
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="locationName"
					render={({ field }) => (
						<FormItem>
							<FormLabel hidden>Location</FormLabel>
							<FormControl>
								<Textarea placeholder="Location? <Optional>" {...field} />
							</FormControl>
							<FormDescription hidden>
								This is the location name of the picture you are submitting
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="image"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel hidden>Image</FormLabel>
								<FormControl>
									<InputFile
										name={field.name}
										onBlur={field.onBlur}
										disabled={field.disabled}
										value={field.value?.fileName}
										onChange={(event) => {
											field.onChange(event.target.files![0]);
										}}
										id="image"
									/>
								</FormControl>
								<FormDescription hidden>
									This is the picture you are submitting
								</FormDescription>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}

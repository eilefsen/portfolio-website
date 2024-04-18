import { Form } from "@/components/ui/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import AutoHeight from "embla-carousel-auto-height";
import Autoplay from "embla-carousel-autoplay";
import React, { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Section } from "./section";
import { Button } from "./ui/button";
import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "./ui/carousel";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { InputFile } from "./ui/inputfile";
import { Textarea } from "./ui/textarea";
import { CentralHr } from "./util";

function numberWithinRange(number: number, min: number, max: number): number {
	return Math.min(Math.max(number, min), max);
}

export function Gallery() {
	const [api, setApi] = React.useState<CarouselApi>();
	const result = useQuery({
		queryKey: ["pictures"],
		queryFn: async (): Promise<GalleryPicture[]> => {
			const res = await axios.get(`/api/img/all`);
			return res.data;
		},
		initialData: [],
	});

	const items: JSX.Element[] = [];

	for (const pic of result.data) {
		const item = (
			<GalleryCarouselItem
				title={pic.title}
				locationName={pic.locationName}
				imgSrc={pic.imgSrc}
				key={pic.id}
			/>
		);
		items.push(item);
	}

	const TWEEN_FACTOR_BASE = 0.84;
	const tweenFactor = useRef(0);
	const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
		tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
	}, []);

	const tweenOpacity = useCallback(
		(emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
			const engine = emblaApi.internalEngine();
			const scrollProgress = emblaApi.scrollProgress();
			const slidesInView = emblaApi.slidesInView();
			const isScrollEvent = eventName === "scroll";

			emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
				let diffToTarget = scrollSnap - scrollProgress;
				const slidesInSnap = engine.slideRegistry[snapIndex];

				slidesInSnap.forEach((slideIndex) => {
					if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

					if (engine.options.loop) {
						engine.slideLooper.loopPoints.forEach((loopItem) => {
							const target = loopItem.target();

							if (slideIndex === loopItem.index && target !== 0) {
								const sign = Math.sign(target);

								if (sign === -1) {
									diffToTarget = scrollSnap - (1 + scrollProgress);
								}
								if (sign === 1) {
									diffToTarget = scrollSnap + (1 - scrollProgress);
								}
							}
						});
					}

					const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
					const opacity = numberWithinRange(tweenValue, 0, 1).toString();
					emblaApi.slideNodes()[slideIndex].style.opacity = opacity;
				});
			});
		},
		[],
	);

	useEffect(() => {
		if (!api) return;

		setTweenFactor(api);
		tweenOpacity(api);
		api
			.on("reInit", setTweenFactor)
			.on("reInit", tweenOpacity)
			.on("scroll", tweenOpacity);
	}, [api, tweenOpacity]);

	// return null if result is not a success or is empty
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
		<Section id="gallery" heading="Gallery">
			<Carousel
				setApi={setApi}
				opts={{
					align: "center",
					loop: true,
				}}
				plugins={[
					Autoplay({
						delay: 5000,
					}),
				]}
			>
				<CarouselContent className="flex items-start">{items}</CarouselContent>
				<CarouselPrevious className="hidden sm:flex" />
				<CarouselNext className="hidden sm:flex" />
			</Carousel>
		</Section>
	);
}

interface GalleryPicture {
	id: number;
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
		<CarouselItem className="basis-auto">
			<div className="mx-auto hyphens-auto break-words">
				<h3 className="smallcaps text-xl font-bold leading-none">
					«{props.title}»
				</h3>
				<h4 className="pb-2 text-lg font-light leading-none">
					{props.locationName + " "}
				</h4>
			</div>
			<img
				src={props.imgSrc}
				alt={props.title}
				className="mx-auto h-full max-h-[210px] rounded-lg object-contain sm:max-h-[400px]"
			/>
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
										accept=".jpg,.jpeg"
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

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "./ui/carousel";

interface GalleryProps {}
export function Gallery(props: GalleryProps) {
	return (
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
	);
}

interface GalleryCardProps {
	title?: string;
	locationName?: string;
	imgSrc: string;
}
function GalleryCarouselItem(props: GalleryCardProps) {
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

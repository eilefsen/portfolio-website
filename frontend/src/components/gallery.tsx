import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

interface GalleryProps {}
export function Gallery(props: GalleryProps) {
	return (
		<div className="">
			<GalleryCard
				title="En katt i natten"
				locationName="Grunerløkka"
				imgSrc="/img/katt_i_natten.jpg"
			/>
		</div>
	);
}

interface GalleryCardProps {
	title?: string;
	locationName?: string;
	imgSrc: string;
}
function GalleryCard(props: GalleryCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
				<CardDescription>{props.locationName}</CardDescription>
			</CardHeader>
			<CardContent>
				<img src={props.imgSrc} alt={props.title} />
			</CardContent>
		</Card>
	);
}

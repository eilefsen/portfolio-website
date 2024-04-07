import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface SadGirlsRingBanner {
	url: string;
	imgSrc: string;
	alt: string;
	author: string;
}

export function SadGirlsRingBanner() {
	// get array from external api
	const result = useQuery({
		queryKey: ["webring"],
		queryFn: async (): Promise<SadGirlsRingBanner[]> => {
			const res = await axios.get(`https://sadgirlsclub.wtf/sadgirlsring.json`);
			return res.data;
		},
	});

	const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

	// change the banner every n seconds
	const bannerResult = useQuery({
		queryKey: ["webringBanner"],
		queryFn: (): SadGirlsRingBanner => {
			const r = result.data!;
			let arrayIndex = Math.floor(Math.random() * r.length);
			while (arrayIndex == currentBannerIndex) {
				arrayIndex = Math.floor(Math.random() * r.length);
			}
			setCurrentBannerIndex(arrayIndex);
			return r[arrayIndex];
		},
		enabled: !!result.isSuccess,
		refetchInterval: 1000,
	});

	let q;
	if (bannerResult.isSuccess) {
		q = <BannerImage {...bannerResult.data} />;
	}
	return (
		<div className="inline-block">
			<div className="border border-black p-px">{q}</div>
		</div>
	);
}

function BannerImage(props: SadGirlsRingBanner) {
	return (
		<a className="block" href={props.url} target="_blank">
			<img src={props.imgSrc} alt={props.alt} />
		</a>
	);
}

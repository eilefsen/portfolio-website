import { useEffect, useState } from "react";

interface SadGirlsRingBanner {
	url: string;
	imgSrc: string;
	alt: string;
	author: string;
}

async function getRing() {
	const url = "http://pwgen.eilefsen.net/sadgirlsring.json";

	const response = await fetch(url, { mode: "cors" });

	if (response.status !== 200) {
		throw new Error(response.statusText);
	}
	return response.json();
}

export function SadGirlsRingBanner() {
	const [quotes, setQuotes] = useState([] as JSX.Element[]);
	useEffect(() => {
		getRing().then((data) => {
			for (const d of data) {
				const quote = <Quote {...d} />;
				console.log(d);
				setQuotes([...quotes, quote]);
			}
		});
	}, []);

	return <div>{quotes}</div>;
}

function Quote(props: SadGirlsRingBanner) {
	return (
		<>
			<a href={props.url} target="_blank">
				<img src={props.imgSrc} alt={props.alt} />
			</a>
			<p>{props.author}</p>
		</>
	);
}

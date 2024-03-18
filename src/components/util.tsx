interface HrProps {
	className?: string;
}

export function Hr(props: HrProps) {
	return (
		<hr
			className={
				"clear-both h-px border-none bg-gradient-to-r from-transparent via-gray-100 to-transparent" +
				" " +
				props.className
			}
		/>
	);
}

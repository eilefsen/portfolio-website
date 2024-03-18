interface HrProps {
	className?: string;
}

export function CentralHr(props: HrProps) {
	return (
		<hr
			className={
				"clear-both h-px border-none bg-gradient-to-r from-transparent via-gray-900 " +
				" " +
				props.className
			}
		/>
	);
}

export function LeftHr(props: HrProps) {
	return (
		<hr
			className={
				"clear-both h-px border-none bg-gradient-to-r from-gray-900" +
				" " +
				props.className
			}
		/>
	);
}
export function RightHr(props: HrProps) {
	return (
		<hr
			className={
				"clear-both h-px border-none bg-gradient-to-l from-gray-900" +
				" " +
				props.className
			}
		/>
	);
}

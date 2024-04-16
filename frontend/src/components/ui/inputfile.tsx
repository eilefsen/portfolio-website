import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface InputFileProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

export function InputFile(props: InputFileProps) {
	return (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<Label htmlFor="picture">Picture</Label>
			<Input id="picture" type="file" {...props} />
		</div>
	);
}

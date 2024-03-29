import { LoginForm } from "@/components/login/form";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/login")({
	component: Login,
});

function Login() {
	const navigate = useNavigate({ from: "/" });
	function onSuccess() {
		navigate({ to: "/" });
	}
	return (
		<>
			<LoginForm onSuccess={onSuccess} />
		</>
	);
}

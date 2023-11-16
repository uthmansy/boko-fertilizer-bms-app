import Spinner from "./Spinner";

export default function ContentLoader() {
	return (
		<div className="flex items-center justify-center h-full w-full">
			<div className="flex flex-col items-center scale-150">
				<Spinner />
			</div>
		</div>
	);
}

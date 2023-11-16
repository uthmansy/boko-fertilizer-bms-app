import { useParams } from "react-router-dom";

export default function LogisticsSingleTruck() {
	const { id } = useParams();

	return <div>{id}</div>;
}

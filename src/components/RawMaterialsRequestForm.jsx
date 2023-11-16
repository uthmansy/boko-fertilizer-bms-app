import React, { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { addRawMaterialRequestToFirestore } from "../util/crud";

const RawMaterialRequestForm = () => {
	const { user } = useAuth();

	const [formData, setFormData] = useState([{ material: "", quantity: "" }]);
	const [requestDate, setRequestDate] = useState("");
	const [isFormValid, setIsFormValid] = useState(false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [requestSummary, setRequestSummary] = useState(null);

	const addRow = () => {
		setFormData([...formData, { material: "", quantity: "" }]);
	};

	const removeRow = (index) => {
		const updatedData = [...formData];
		updatedData.splice(index, 1);
		setFormData(updatedData);
		validateForm(updatedData);
	};

	const handleMaterialChange = (value, index) => {
		const updatedData = [...formData];
		updatedData[index].material = value;
		setFormData(updatedData);
		validateForm(updatedData);
	};

	const handleQuantityChange = (value, index) => {
		const updatedData = [...formData];
		updatedData[index].quantity = value;
		setFormData(updatedData);
		validateForm(updatedData);
	};

	const handleDateChange = (value) => {
		setRequestDate(value);
		validateForm(formData);
	};

	const validateForm = (data) => {
		const isDataValid = data.every(
			(item) => item.material !== "" && item.quantity !== ""
		);
		setIsFormValid(isDataValid && requestDate !== "");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			setError(null);

			const requesterId = user.userId;
			const requester = user.name;

			const rawMaterials = formData.map((item) => ({
				material: item.material,
				quantity: parseFloat(item.quantity),
			}));

			const requestDateTimestamp = new Date(requestDate).toISOString();

			const requestData = {
				requesterId,
				requester,
				approver: null,
				approverId: null,
				status: "pending",
				requestDate: requestDateTimestamp,
				rawMaterials,
			};

			const response = await addRawMaterialRequestToFirestore(requestData);

			setRequestSummary(response);
			setFormData([{ material: "", quantity: "" }]);
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-screen-lg mx-auto p-4 bg-white rounded shadow-md">
			{requestSummary ? (
				<div>
					<h2 className="text-2xl font-semibold mb-4">Request Summary</h2>
					<table className="table-auto">
						<thead>
							<tr>
								<th className="px-4 py-2">Material</th>
								<th className="px-4 py-2">Quantity</th>
							</tr>
						</thead>
						<tbody>
							{requestSummary.rawMaterials.map((material, index) => (
								<tr key={index}>
									<td className="border px-4 py-2">{material.material}</td>
									<td className="border px-4 py-2">{material.quantity}</td>
								</tr>
							))}
						</tbody>
					</table>
					<button
						type="button"
						className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
						onClick={() => {
							setRequestSummary(null);
							setError(null);
						}}>
						Create New Request
					</button>
				</div>
			) : (
				<form onSubmit={handleSubmit}>
					<h2 className="text-2xl font-semibold mb-4">
						Raw Material Request Form
					</h2>
					<div className="mb-4">
						<input
							type="date"
							className="w-1/4 p-2 border rounded mr-2"
							value={requestDate}
							onChange={(e) => handleDateChange(e.target.value)}
						/>
					</div>
					{formData.map((data, index) => (
						<div key={index} className="mb-4">
							<div className="flex items-center mb-2">
								<select
									className="w-3/4 p-2 border rounded mr-2"
									value={data.material}
									onChange={(e) => handleMaterialChange(e.target.value, index)}>
									<option value="">Select Material</option>
									<option value="MOP">MOP</option>
									<option value="DAP">DAP</option>
									<option value="LSG">LSG</option>
									<option value="UREA">UREA</option>
									<option value="GAS">GAS</option>
								</select>
								<input
									type="number"
									className="w-1/4 p-2 border rounded mr-2"
									value={data.quantity}
									onChange={(e) => handleQuantityChange(e.target.value, index)}
									placeholder="Quantity (bags)"
								/>
								<button
									type="button"
									className="bg-red-500 text-white px-2 py-1 rounded"
									onClick={() => removeRow(index)}>
									Remove
								</button>
							</div>
						</div>
					))}
					<button
						type="button"
						className="bg-green-500 text-white px-4 py-2 rounded mr-2"
						onClick={addRow}>
						Add Raw Material
					</button>
					<button
						type="button"
						className={`${
							loading
								? "bg-gray-300"
								: isFormValid
								? "bg-blue-500"
								: "bg-gray-300"
						} text-white px-4 py-2 rounded`}
						onClick={handleSubmit}
						disabled={loading || !isFormValid}>
						{loading ? "Submitting..." : "Submit"}
					</button>
					{error && <div className="text-red-500 mt-2">{error}</div>}
				</form>
			)}
		</div>
	);
};

export default RawMaterialRequestForm;

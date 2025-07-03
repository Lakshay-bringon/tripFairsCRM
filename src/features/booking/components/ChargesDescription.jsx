import React from 'react';
import { Plus, X } from 'lucide-react';

function ChargesDescription({
	charges = [],
	currencies,
	currency,
	register,
	addCharge,
	removeCharge,
	watch, // Add watch prop to monitor charge values
}) {
	return (
		<div className="p-3 border border-gray-700 rounded-lg">
			<div className="flex items-center justify-between mb-2">
				<h3 className="font-semibold">Charges Description</h3>
				<button
					type="button"
					onClick={addCharge}
					className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
				>
					<Plus className="w-4 h-4" />
					Add Charge
				</button>
			</div>
			<table className="w-full text-sm border border-gray-700 rounded">
				<thead>
					<tr className="bg-gray-700 text-gray-200">
						<th className="px-2 py-2 text-left">Charge #</th>
						<th className="px-2 py-2 text-left">Amount</th>
						<th className="px-2 py-2 text-left">Description</th>
						<th className="px-2 py-2 text-left"></th>
					</tr>
				</thead>
				<tbody>
					{charges.map((_, index) => (
						<tr key={index}>
							<td className="px-2 py-2">{index + 1}</td>
							<td className="px-2 py-2 flex items-center gap-1">
								<input
									{...register(`charge_data.${index}.amount`)}
									className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-24"
									placeholder="Amount"
								/>
								<select
									{...register(`charge_data.${index}.currency`)}
									className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white ml-2"
								>
									{currencies && currencies.length > 0 ? (
										currencies.map((currency) => (
											<option key={currency.id} value={currency.Currency}>
												{currency.Currency}
											</option>
										))
									) : (
										<option value="">Select Currency</option>
									)}{' '}
								</select>{' '}
							</td>
							<td className="px-2 py-2">
								<input
									{...register(`charge_data.${index}.description`)}
									className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full"
									placeholder="Description"
								/>
							</td>
							<td className="px-2 py-2">
								{charges.length > 1 && (
									<button
										type="button"
										onClick={() => removeCharge(index)}
										className="text-red-400 hover:text-red-300 transition-colors"
									>
										<X className="w-4 h-4" />
									</button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Total charges display below the table */}
			{/* <div className="mt-3 p-2 bg-gray-700 rounded border">
				<div className="text-sm text-gray-300 flex justify-between items-center">
					<span className="font-medium">Total Sum of Charges:</span>
					<span className="font-bold text-white">
						{chargesSum.toFixed(2)} {currency}
					</span>
				</div>
			</div> */}
		</div>
	);
}

export default ChargesDescription;

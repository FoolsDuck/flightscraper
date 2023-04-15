function countStay(monthsRange, stayLength) {
	let dates = [];

	// Calculate start and end dates for the months range
	const today = new Date();
	const start = today.toISOString().substring(0, 10);
	const end = new Date(today.setMonth(today.getMonth() + monthsRange))
		.toISOString()
		.substring(0, 10);

	// Loop over the months range and print out the stays
	let stayStart = start;
	while (
		new Date(stayStart).setDate(new Date(stayStart).getDate() + stayLength - 1) <= new Date(end)
	) {
		const stayEnd = new Date(
			new Date(stayStart).setDate(new Date(stayStart).getDate() + stayLength - 1),
		)
			.toISOString()
			.substring(0, 10);
		dates.push({ since: stayStart, until: stayEnd });
		stayStart = new Date(new Date(stayStart).setDate(new Date(stayStart).getDate() + 1))
			.toISOString()
			.substring(0, 10);
	}
	return dates;
}

module.exports.countStay = countStay;

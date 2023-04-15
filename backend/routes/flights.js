const router = require("express").Router();
const { checkByRange } = require("../hooks/checkByRange");
const airports = require("../airports.json");

router.get("/", async (req, res) => {
	const from = airports
		.filter((s) => s.type === "large_airport")
		.find((s) => s["municipality"].toLowerCase() === req.query.from.toLowerCase())["iata_code"];
	const months = Number(req.query.months);
	const length = Number(req.query.length);
	const results = await checkByRange(from, months, length);
	res.send(results);
});

module.exports = router;

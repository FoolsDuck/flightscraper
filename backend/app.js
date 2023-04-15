const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 8080;

// Add headers

app.use(function (req, res, next) {
	// Origin to allow
	const allowedOrigins = ["http://localhost:3000", "http://localhost:8080"];
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
	}

	// Request methods
	res.setHeader("Access-Control-Allow-Methods", "GET, POST");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,enctype");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	next();
});

app.use(bodyParser.json());

app.disable("x-powered-by");

const flightsRoute = require("./routes/flights");

// routes
app.use("/api/v1/flights", flightsRoute);

app.use(express.static(path.join(__dirname, `../frontend/build`)));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, `../frontend/build`, "index.html"));
});

app.listen(port, function () {
	console.log(`Server started on port ${port}`);
});

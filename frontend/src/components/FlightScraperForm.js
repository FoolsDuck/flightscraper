import React, { useState, useRef, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { cities } from "../cities"; // assuming that this is the file that contains city names
import logo from "../assets/logo.jpeg";
import { ThreeDots } from "react-loading-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import FlightResultsAccordion from "./FlightsAccordion";
import axios from "axios";

const server = "http://localhost:8080";

function FlightsScraper() {
	const [from, setFrom] = useState("");
	const [range, setRange] = useState("");
	const [autocompleteList, setAutocompleteList] = useState([]);
	const [selectedLength, setSelectedLength] = useState([]);
	const [loading, setLoading] = useState(false);
	const [listWidth, setListWidth] = useState(null);
	const prevSiblingRef = useRef(null);

	const [data, setData] = useState([]);

	useEffect(() => {
		if (prevSiblingRef.current) {
			const prevSiblingWidth = prevSiblingRef.current.offsetWidth;
			setListWidth(`${prevSiblingWidth}px`);
		}
	}, []);

	function handleFromInputChange(e) {
		const input = e.target.value;
		setFrom(input);
		const autocompleteArray = autocomplete(input, cities);
		setAutocompleteList(autocompleteArray);
	}

	function handleRangeInputChange(e) {
		const input = e.target.value;
		setRange(input);
	}

	function makeRequest(index) {
		if (index >= selectedLength.length) {
			// all requests have been completed
			return;
		}

		const item = selectedLength[index];
		setLoading(true);
		axios
			.get(`${server}/api/v1/flights?from=${from}&months=${range}&length=${item}`)
			.then((res) => {
				setData((data) => [...data, res.data]);
				setLoading(false);
				makeRequest(index + 1);
			})
			.catch((error) => {
				console.error(error);
				setLoading(false);
				makeRequest(index + 1);
			});
	}

	function handleSubmit(event) {
		event.preventDefault();
		makeRequest(0);
	}

	function handleOptionClick(option) {
		setFrom(option);
		setAutocompleteList([]);
	}

	function handleSelectLength(value) {
		if (selectedLength.includes(value)) {
			let filtered = selectedLength.filter((s) => s != value);
			setSelectedLength(filtered);
		} else {
			if (selectedLength.length > 3) {
				return;
			} else {
				setSelectedLength([...selectedLength, value]);
			}
		}
	}

	function autocomplete(value, arr) {
		const regex = new RegExp(`^${value}`, "i");
		const filteredArray = arr.filter((item) => regex.test(item));
		const uniqueArray = [...new Set(filteredArray)];
		return uniqueArray.sort();
	}

	return (
		<Container className="mt-5">
			<div className="text-center">
				<img src={logo} width="100" alt="logo" />
			</div>
			<h1 className="text-center mb-5">Flights Scraper</h1>
			<Form onSubmit={handleSubmit} id="flightForm">
				<Form.Group className="row cols-2">
					<div>
						<Form.Control
							type="text"
							placeholder="From"
							name="from"
							className="col-md-6 form-control"
							autoComplete="off"
							value={from}
							onChange={handleFromInputChange}
							list="from-input-list"
							ref={prevSiblingRef}
						/>
						{autocompleteList.length > 0 && (
							<div id="from-input-list" style={{ width: listWidth }}>
								{autocompleteList.map((option) => (
									<option key={option} value={option} onClick={() => handleOptionClick(option)}>
										{option}
									</option>
								))}
							</div>
						)}
					</div>

					<div>
						<Form.Control
							type="number"
							placeholder="Months"
							name="number-range"
							className="col-md-6 form-control"
							min="1"
							max="4"
							value={range}
							onChange={handleRangeInputChange}
						/>
					</div>
				</Form.Group>
				<br />
				<p style={{ textAlign: "center", fontWeight: "bold" }}>
					Select up to 4 options of duration:
				</p>
				<div
					style={{
						display: "flex",
						width: "100%",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{Array.from({ length: 12 }, (item, i) => (
						<div
							onClick={() => handleSelectLength(i + 3)}
							key={i}
							className="pointer darkOnHover"
							style={{
								fontSize: "14px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: selectedLength.includes(i + 3) ? "black" : "#F2520C",
								color: selectedLength.includes(i + 3) ? "#F2520C" : "black",
								fontWeight: "bold",
								margin: "0px 5px",
								borderRadius: "50px",
								width: "32px",
								height: "32px",
								padding: "12px",
							}}
						>
							{i + 3}
						</div>
					))}
				</div>

				<div className="d-grid gap-2 mt-3" style={{ width: "95%", margin: "auto" }}>
					<Button type="submit" variant="primary" className="orangeBtn">
						Submit
					</Button>
				</div>
				<br />
				{loading && (
					<div style={{ display: "grid" }}>
						<div style={{ textAlign: "center", color: "#f2520c" }}>
							<ThreeDots stroke="#f2520c" fill="#f2520c" />
						</div>
						<div
							style={{
								textAlign: "center",
								color: "#f2520c",
								fontWeight: "bold",
								marginTop: "10px",
							}}
						>
							Loading...
						</div>
					</div>
				)}
			</Form>
			<FlightResultsAccordion
				data={data}
				selectedLength={selectedLength}
				from={from}
				range={range}
			/>
		</Container>
	);
}

export default FlightsScraper;

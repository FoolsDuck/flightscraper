import { useState } from "react";
import { Accordion, Card, Table } from "react-bootstrap";
import results from "./test.json";

export default function FlightResultsAccordion(props) {
	const [activeIndex, setActiveIndex] = useState(null);

	const handleAccordionSelect = (index) => {
		console.log(index);
		setActiveIndex(index === activeIndex ? null : index);
	};

	return (
		<Accordion
			activeKey={activeIndex}
			onSelect={handleAccordionSelect}
			style={{ width: "100%", margin: "auto" }}
		>
			{props.data.map((result, index) => (
				<Card key={index} style={{ margin: "5px 0px" }}>
					<Accordion.Item as={Card.Header} eventKey={index}>
						<Accordion.Header style={{ textAlign: "center" }}>
							Chepest {props.selectedLength[index]} Days Flights from {props.from} for the next{" "}
							{props.range} months, starting from {result.cheapestDirects[0].DirectPrice[0].price}$
						</Accordion.Header>
						<Accordion.Body eventKey={index}>
							<Card.Body>
								<Accordion>
									{result.cheapestDirects.map((destination, index) => (
										<Card key={index} style={{ margin: "5px 0px" }}>
											<Accordion.Item as={Card.Header} eventKey={index}>
												<Accordion.Header>
													<div
														style={{
															display: "inline-flex",
															justifyContent: "space-between",
															alignItems: "center",
															width: "100%",
														}}
													>
														<div>
															<img
																src={`https://flagsapi.com/${
																	destination.Id === "UK" ? "GB" : destination.Id
																}/flat/64.png`}
															/>
															{destination.Name}
														</div>
														<div>From {destination.DirectPrice[0].price}$</div>
													</div>
												</Accordion.Header>
												<Accordion.Body eventKey={index}>
													<Card.Body style={{ display: "inline-flex", width: "100%" }}>
														<div style={{ width: "50%", textAlign: "center", margin: "5px" }}>
															<h5>Cheapest Directs</h5>
															<Table striped bordered hover>
																<thead>
																	<tr>
																		<th>Price</th>
																		<th>Departure</th>
																		<th>Return</th>
																	</tr>
																</thead>
																<tbody>
																	{destination.DirectPrice.map((flight, index) => (
																		<tr key={index}>
																			<td>{flight.price}$</td>
																			<td>{flight.since}</td>
																			<td>{flight.until}</td>
																		</tr>
																	))}
																</tbody>
															</Table>
														</div>
														<div style={{ width: "50%", textAlign: "center", margin: "5px" }}>
															<h5>Cheapest Indirects</h5>
															<Table striped bordered hover>
																<thead>
																	<tr>
																		<th>Price</th>
																		<th>Departure</th>
																		<th>Return</th>
																	</tr>
																</thead>
																<tbody>
																	{destination.IndirectPrice.map((flight, index) => (
																		<tr key={index}>
																			<td>{flight.price}$</td>
																			<td>{flight.since}</td>
																			<td>{flight.until}</td>
																		</tr>
																	))}
																</tbody>
															</Table>
														</div>
													</Card.Body>
												</Accordion.Body>
											</Accordion.Item>
										</Card>
									))}
								</Accordion>
							</Card.Body>
						</Accordion.Body>
					</Accordion.Item>
				</Card>
			))}
		</Accordion>
	);
}

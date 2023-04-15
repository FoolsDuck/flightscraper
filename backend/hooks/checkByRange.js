const axios = require("axios");
const { countStay } = require("./countStay");

const formatDate = (date) => {
	const formattedDate = date.substring(2, 4) + date.substring(5, 7) + date.substring(8, 10);
	return formattedDate;
};

function compareArrays(arraysObj) {
	const result = [];
	const map = new Map();
	Object.entries(arraysObj).forEach(([key, array]) => {
		array.forEach((obj) => {
			const id = obj.Id;
			if (!map.has(id)) {
				map.set(id, { Id: id, Name: obj.Name, DirectPrice: [], IndirectPrice: [] });
				result.push(map.get(id));
			}
			if (obj.DirectPrice !== undefined) {
				map.get(id).DirectPrice.push({
					price: obj.DirectPrice,
					since: key.split("_")[0],
					until: key.split("_")[1],
				});
			}
			if (obj.IndirectPrice !== undefined) {
				map.get(id).IndirectPrice.push({
					price: obj.IndirectPrice,
					since: key.split("_")[0],
					until: key.split("_")[1],
				});
			}
		});
	});
	result.forEach((obj) => {
		obj.DirectPrice.sort((a, b) => a.price - b.price);
		obj.IndirectPrice.sort((a, b) => a.price - b.price);
	});

	const cheapestDirects = result
		.filter((obj) => obj.DirectPrice.length > 0)
		.sort((a, b) => a.DirectPrice[0].price - b.DirectPrice[0].price);
	const cheapestIndirects = result
		.filter((obj) => obj.IndirectPrice.length > 0)
		.sort((a, b) => a.IndirectPrice[0].price - b.IndirectPrice[0].price);

	return { cheapestDirects, cheapestIndirects };
}

const getData = async (from, since, until) => {
	var config = {
		method: "get",
		url: `https://www.skyscanner.com/g/browse-view-bff/dataservices/browse/v3/bvweb/il/USD/en-US/destinations/${from}/anywhere/${since}/${until}/?profile=minimalcityrollupwithnamesv2&include=image;hotel&apikey=8aa374f4e28e4664bf268f850f767535&isMobilePhone=false&isOptedInForPersonalised=true`,
		headers: {
			authority: "www.skyscanner.com",
			accept: "application/json, text/javascript, */*; q=0.01",
			"accept-language": "en-US,en;q=0.9",
			cookie:
				'_pxhd=wac--tD5xKiH276ZkrVUJyF807GzrYlxq/XfpOHnr-t/XqWq-llzZr-HHsqq-Ly7K5n55-96WlTA3he8EMmKvg==:eULbkCJGxBT64ko8FvKpZTPg0wgNc-FPIErHUt8ugR6rGaSTLttjQV4XeOmiv1wXRTeSmT/UoqHqhaOyoFaZLCVASTpWA7PG4eKwGGX3940=; traveller_context=b2ac20c0-c497-4bb3-a2b5-934ea070301a; __Secure-anon_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImM3ZGZlYjI2LTlmZjUtNDY4OC1iYjc3LWRiNTY2NWUyNjFkZSJ9.eyJhenAiOiIyNWM3MGZmZDAwN2JkOGQzODM3NyIsImh0dHBzOi8vc2t5c2Nhbm5lci5uZXQvbG9naW5UeXBlIjoiYW5vbnltb3VzIiwiaHR0cHM6Ly9za3lzY2FubmVyLm5ldC91dGlkIjoiYjJhYzIwYzAtYzQ5Ny00YmIzLWEyYjUtOTM0ZWEwNzAzMDFhIiwiaHR0cHM6Ly9za3lzY2FubmVyLm5ldC9jc3JmIjoiZThhMTJhZjg1MDJmNjE1ZjAyMjZmN2FjMzNmMWM4OTgiLCJodHRwczovL3NreXNjYW5uZXIubmV0L2p0aSI6ImMyZjBjYWQxLTVlY2MtNGViNS1hNjE4LWU0YTM3YmUxNmYxNCIsImlhdCI6MTY4MDk0MjYzMCwiZXhwIjoxNzQ0MDE0NjMwLCJhdWQiOiJodHRwczovL2dhdGV3YXkuc2t5c2Nhbm5lci5uZXQvaWRlbnRpdHkiLCJpc3MiOiJodHRwczovL3d3dy5za3lzY2FubmVyLm5ldC9zdHRjL2lkZW50aXR5L2p3a3MvcHJvZC8ifQ.fygaPp5XMb6enLkRFJsWhKAeHGogcdRsKofhTK_tzL8ttDo_o9ejvYl4t6Zfk3M2aO6p8jnBEZpz1y2P-EnjZmCveJutYpDC2QJZTCPMafrRu3vSxXPkM6ukV_I58RLF4V7gZsBhkZijuK8iM_02fXnCSbqPebVssy9LAcvBkYH7SNf1UMAcYLJ57Xv_vGK32KFOl4i-Ihb_K7LB6vZfa6wYKyqn2W0Ox9C3H4a2I35_GLYU2vaWGGGPat9nVo3FSK69wG_M65oR3l0LKwPPBmcQYpVbPTU-FZuMPP8g2J9AWqLSJYmLPWcJpauIkDX2J1NGnZFcXAsyo36AQfBBnA; __Secure-anon_csrf_token=e8a12af8502f615f0226f7ac33f1c898; ssculture=locale:::en-US&market:::IL&currency:::USD; ssaboverrides=; abgroup=10068342; __Secure-ska=d8a1a8ac-0774-44ec-8939-050c8ddde14e; device_guid=d8a1a8ac-0774-44ec-8939-050c8ddde14e; _ga=GA1.3.d8a1a8ac-0774-44ec-8939-050c8ddde14e.1680942631; _pxvid=9f2b7be8-d5e7-11ed-8a2c-514e74646151; pxcts=9fa3616b-d5e7-11ed-a8e8-6f7865537643; QSI_S_ZN_0VDsL2Wl8ZAlxlA=v:0:0; __pxvid=9fc2cbe9-d5e7-11ed-a112-0242ac120002; _gcl_au=1.1.737204719.1680942631; g_state={"i_p":1680949870685,"i_l":1}; _csrf=_xV9XjWT0z4FwUKompDLvnpy; ssab=Display_other_offer_if_use_discount_filter_desktop_V6:::a&EnableQualtricsTag_V5:::a&MAT_cartype_filter_with_image_on_desktop_V4:::b&Multi_city_search_Nav_Card_on_Desktop_V3:::a&PAN_Reviews_optimization_desktop_V1:::a&baggage_plugin_30k_splitting_V3:::a&disable_pending_status_for_conductor_V3:::b&fps_mr_fqs_flights_ranking_haumea_v3__25i_web_V4:::a&fps_ttlr_early_timeout_banana_V83:::a&fps_ttlr_early_timeout_web_V21:::a&global_inline_test_v2_V3:::l&limit_num_inline_creatives_V2:::b&rts_who_precompute_V4:::a&taps_aa_turbocharged_V3:::a; experiment_allocation_id=53b96407b71b93e3850c9561a0a46488991eff7d6fccd1532e25804b49954a9c; browse_view_page_migration_proxy=WDP_browser_view_traffic_split:::V0:::default; preferences=b2ac20c0c4974bb3a2b5934ea070301a; _gid=GA1.3.2054643359.1680942672; __gsas=ID=0e5e55bf44f21479:T=1680942673:S=ALNI_Mag3CMDMdm7Jx5I89Pjo3bsPlBg-A; QSI_S_ZN_8fcHUNchqVNRM4S=v:0:0; __gads=ID=a6bf5c2e0da609d3:T=1680942673:S=ALNI_MaG9ohKOlI1_NJs0LBYN6sMnu5u8Q; __gpi=UID=00000bfe73948eb2:T=1680942673:RT=1680942673:S=ALNI_MYMBordr4gNI9pX0m1ynnGnmr7tFg; _fbp=fb.2.1680942673768.1692567074; scanner=currency:::USD&legs:::TLV|2023-04-15|everywhere|everywhere|2023-04-22|TLV&tripType:::return&rtn:::true&preferDirects:::false&outboundAlts:::false&inboundAlts:::false&from:::TLV&to:::everywhere&oym:::2304&oday:::15&wy:::0&iym:::2304&iday:::22&cabinclass:::Economy&adults:::1&adultsV2:::1&children:::0&childrenV2&infants:::0; _uetsid=b8d79500d5e711edb804a7a7e0ba1e6c; _uetvid=b8d7fa10d5e711edab8e492421301e65; cto_bundle=Nz2ooV9RWnp0MnkydllFNnRkdURUSlV5UUNNTHNlbXo2NTdhTHg1NE5EJTJGQ0dRYzRRZlhlb2k3TFF1c041d3pEWVhjZDZUTWxmWWZUQ0hRMGd1WXZMNVZ3T05OcUVEaENpVDBkOFVrMlJTJTJCdmRHUDdLMVBlV2lGNzZvMUZGQzlaM0pXNmpDeW9ZMTdNNWpsakRscFBVbHdYYTNuc3dOdSUyRk1ZVWFzZzNXS3EyR3ZTcTYlMkJQQmNGU1dscGFqOU5zR3A2U29rODZKM0Mxd3JqZXB5aUVYTmdTMk5YZmclM0QlM0Q; _px3=0d09d9affa64ea40ed69860ed6783ea35ae4be15a406d3847cdd829b65075f78:1/BCX5S+Vn+2IbVfWDIxyxTOsjS/OaI4V9VXemI7GAsssUzL0FVhHsuD/dUWAFoh896TFJWhM3shl5LE9WirUg==:1000:0Hv+czZDMFXgQhgrdoSoC1iBOUOqEwsYadGeU+VY8Rq4tNcTpVOYBYI+lagKv+FIBdh0Qo3Q3/Po+XhNkH2CaV/I/KLWMRi5OcjOEb3/ZDpkp6Fa+BkTkZSAw7XWNyXHIM+aBX/B1YWEywc4sScR1i7kieOS3wA69YONOtCGNK2vcqFxk6Fegrh9pyB3D3LOuP4YMPkgxDWaA9iQHkxNew==; _gat=1',
			referer: `https://www.skyscanner.com/transport/flights-from/${from}/${formatDate(
				since,
			)}/${formatDate(
				until,
			)}/?adultsv2=1&cabinclass=economy&childrenv2=&ref=home&is_banana_refferal=true&rtn=1&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&qp_prevScreen=HOMEPAGE`,
			"sec-ch-ua": '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-model": "",
			"sec-ch-ua-platform": '"macOS"',
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"user-agent":
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
			"x-requested-with": "XMLHttpRequest",
		},
	};

	return await axios(config)
		.then(function (response) {
			return response.data.PlacePrices.filter(
				(s) => (s.DirectPrice && s.DirectPrice > 0) || (s.IndirectPrice && s.IndirectPrice > 0),
			);
		})
		.catch(function (error) {
			console.log(error);
			return error;
		});
};

const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

const getDataForDates = async (from, dates) => {
	const dateArrays = {};
	for (const date of dates) {
		await sleep(1500);
		console.log(`Scanning since ${date.since} until ${date.until}`);
		dateArrays[`${date.since}_${date.until}`] = await getData(from, date.since, date.until);
	}
	return dateArrays;
};

const checkByRange = async (from, months, length) => {
	const dates = countStay(months, length);
	const datesObj = await getDataForDates(from, dates);
	const result = compareArrays(datesObj);
	return result;
};

module.exports.checkByRange = checkByRange;

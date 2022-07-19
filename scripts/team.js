// CONSTANTS

const goalkeepers = [
	// My Cheap Selection
	{name:'Guaita---CRYGKP',price:4.5,points:119,minutes:2655},

	{name:'Raya---BREGKP',price:4.5,points:95,minutes:2160},
	//{name:'Dubravka---NEWGKP',price:4.5,points:96,minutes:2655},
	{name:'Ramsdale---ARSGKP',price:5,points:135,minutes:3060},
	{name:'Mendy---CHEGKP',price:5,points:130,minutes:3060},
	{name:'Pickford---EVEGKP',price:4.5,points:116,minutes:3150},
	{name:'Alisson---LIVGKP',price:5.5,points:176,minutes:3240},
	//{name:'Pope---NEWGKP',price:5,points:130,minutes:3240},
	{name:'Martínez---AVLGKP',price:5,points:129,minutes:3240},
	{name:'Sá---WOLGKP',price:5,points:146,minutes:3285},
	{name:'Ederson---MCIGKP',price:5.5,points:155,minutes:3330},
	{name:'Sánchez---BHAGKP',price:4.5,points:126,minutes:3330},
	{name:'Fabianski---WHUGKP',price:5,points:136,minutes:3330},
	{name:'Schmeichel---LEIGKP',price:5,points:131,minutes:3330},
	{name:'Meslier---LEEGKP',price:4.5,points:106,minutes:3384},
	{name:'Lloris---TOTGKP',price:5.5,points:158,minutes:3420},
	{name:'De Gea---MUNGKP',price:5,points:132,minutes:3420},
];

const defenders = [
	// My Cheap Selection
	{name:'Guéhi---CRYDEF',price:4.5,points:123,minutes:3222},

	//{name:'Van Dijk---LIVDEF',price:6.5,points:183,minutes:3060},
	{name:'Chalobah---CHEDEF',price:5,points:99,minutes:1447},
	{name:'James---CHEDEF',price:6,points:141,minutes:1863},
	{name:'Robertson---LIVDEF',price:7,points:186,minutes:2537},
	//{name:'Matip---LIVDEF',price:6,points:170,minutes:2790},
	{name:'Alexander-Arnold---LIVDEF',price:7.5,points:208,minutes:2853},
	//{name:'Gabriel---ARSDEF',price:5,points:146,minutes:3063},
	//{name:'Cash---AVLDEF',price:5,points:147,minutes:3337},
	//{name:'Cresswell---WHUDEF',price:5,points:115,minutes:2726},
	//{name:'Mings---AVLDEF',price:4.5,points:118,minutes:3188},
	//{name:'Jansson---BREDEF',price:4.5,points:122,minutes:3321},
	//{name:'Cucurella---BHADEF',price:5,points:126,minutes:3089},
	//{name:'Mitchell---CRYDEF',price:4.5,points:109,minutes:3101},
	//{name:'Targett---NEWDEF',price:5,points:101,minutes:2871},
	//{name:'Walker-Peters---SOUDEF',price:4.5,points:82,minutes:2630},
	//{name:'Digne---AVLDEF',price:5,points:83,minutes:2440},
	//{name:'Tarkowski---EVEDEF',price:4.5,points:83,minutes:3106},
	//{name:'Thiago Silva---CHEDEF',price:5.5,points:130,minutes:2649},
	//{name:'Bednarek---SOUDEF',price:4.5,points:94,minutes:2629},
	//{name:'Canós---BREDEF',price:5,points:81,minutes:2077},
	//{name:'Pinnock---BREDEF',price:4.5,points:90,minutes:2694},
	//{name:'Dawson---WHUDEF',price:5,points:90,minutes:2752},
	//{name:'Dallas---LEEDEF',price:5,points:80,minutes:2920},
	//{name:'Salisu---SOUDEF',price:4.5,points:58,minutes:2971},
	//{name:'Reguilón---TOTDEF',price:4.5,points:104,minutes:1914},
	//{name:'Alonso---CHEDEF',price:5.5,points:128,minutes:2164},
	//{name:'Cancelo---MCIDEF',price:7,points:201,minutes:3227},
	//{name:'Dias---MCIDEF',price:6,points:141,minutes:2401},
	//{name:'Laporte---MCIDEF',price:6,points:160,minutes:2830},
	//{name:'Emerson Royal---TOTDEF',price:5,points:102,minutes:2282},
];

const midfielders = [
	// My Cheap Selection
	{name:'Gray---EVEMID',price:5.5,points:106,minutes:2336},

	{name:'Benrahma---WHUMID',price:6,points:138,minutes:2162},
	{name:'Kulusevski---TOTMID',price:8,points:99,minutes:1259},
	{name:'Barnes---LEIMID',price:7,points:137,minutes:2095},
	{name:'Maddison---LEIMID',price:8,points:181,minutes:2454},
	{name:'Díaz---LIVMID',price:8,points:64,minutes:957},
	{name:'Salah---LIVMID',price:13,points:265,minutes:2758},
	{name:'Mount---CHEMID',price:8,points:169,minutes:2358},
	{name:'Bowen---WHUMID',price:8.5,points:206,minutes:2987},
	{name:'Gross---BHAMID',price:5.5,points:88,minutes:2033},
	{name:'Zaha---CRYMID',price:7,points:150,minutes:2759},
	{name:'Trossard---BHAMID',price:6.5,points:141,minutes:2803},
	{name:'Fornals---WHUMID',price:5.5,points:117,minutes:2795},
	{name:'Ward-Prowse---SOUMID',price:6.5,points:159,minutes:3215},
	{name:'Saka---ARSMID',price:8,points:179,minutes:2978},
	{name:'De Bruyne---MCIMID',price:12,points:196,minutes:2196},
	{name:'Ødegaard---ARSMID',price:6.5,points:131,minutes:2782},
	{name:'Son---TOTMID',price:12,points:258,minutes:3009},
	{name:'Tielemans---LEIMID',price:6.5,points:120,minutes:2629},
	{name:'McGinn---AVLMID',price:5.5,points:110,minutes:3090},
	{name:'Grealish---MCIMID',price:7,points:86,minutes:1910},
	//{name:'Saint-Maximin---NEWMID',price:6.5,points:116,minutes:2804},
	//{name:'Fernandes---MUNMID',price:10,points:151,minutes:3110},
	//{name:'Sterling---MCIMID',price:10,points:163,minutes:2121},
	//{name:'Rodri---MCIMID',price:6,points:127,minutes:2884},
	//{name:'Mahrez---MCIMID',price:8,points:135,minutes:1485},
	//{name:'Gündogan---MCIMID',price:7.5,points:124,minutes:1851},
	//{name:'Gallagher---CHEMID',price:6,points:140,minutes:2843},
	//{name:'Foden---MCIMID',price:8,points:137,minutes:2125},
	//{name:'Bernardo---MCIMID',price:7,points:155,minutes:2856},
	//{name:'Harrison---LEEMID',price:6,points:117,minutes:2638},
];

const forwards = [
	// My Cheap Selection
	{name:'Gelhardt---LEEFWD',price:5.5,points:43,minutes:733},

	{name:'Edouard---CRYFWD',price:5.5,points:87,minutes:1554},
	{name:'Jesus---ARSFWD',price:8,points:120,minutes:1871},
	{name:'Firmino---LIVFWD',price:8,points:62,minutes:980},
	{name:'Diogo Jota---LIVFWD',price:9,points:175,minutes:2357},
	{name:'Ings---AVLFWD',price:7,points:106,minutes:1891},
	{name:'Vardy---LEIFWD',price:9.5,points:133,minutes:1801},
	{name:'Havertz---CHEFWD',price:8,points:112,minutes:1802},
	{name:'Wilson---NEWFWD',price:7.5,points:75,minutes:1386},
	{name:'Toney---BREFWD',price:7,points:139,minutes:2908},
	{name:'Mbeumo---BREFWD',price:6,points:119,minutes:2905},
	{name:'Maupay---BHAFWD',price:6.5,points:98,minutes:2269},
	{name:'Antonio---WHUFWD',price:7.5,points:140,minutes:2975},
	{name:'Calvert-Lewin---EVEFWD',price:8,points:64,minutes:1281},
	{name:'Ronaldo---MUNFWD',price:10.5,points:159,minutes:2454},
	{name:'Werner---CHEFWD',price:8,points:62,minutes:1278},
	{name:'Watkins---AVLFWD',price:7.5,points:131,minutes:2950},
	{name:'Jiménez---WOLFWD',price:7,points:101,minutes:2630},
	{name:'Kane---TOTFWD',price:11.5,points:192,minutes:3231},
	//{name:'Adams---SOUFWD',price:6.5,points:103,minutes:2034},
	//{name:'A.Armstrong---SOUFWD',price:5.5,points:57,minutes:1409},
	//{name:'Richarlison---TOTFWD',price:8.5,points:125,minutes:2522},
	//{name:'Nketiah---ARSFWD',price:7,points:55,minutes:823},
	//{name:'Daka---LEIFWD',price:6,points:70,minutes:1152},
	//{name:'Iheanacho---LEIFWD',price:6.5,points:80,minutes:1253},
	//{name:'Mateta---CRYFWD',price:5.5,points:61,minutes:1138},
	//{name:'Wood---NEWFWD',price:6,points:91,minutes:2694},
	//{name:'Welbeck---BHAFWD',price:6.5,points:89,minutes:1469},
	//{name:'Benteke---CRYFWD',price:5.5,points:58,minutes:1132},
	//{name:'Broja---CHEFWD',price:5.5,points:92,minutes:1969},
];

// Variables

const goalkeeperCount = goalkeepers.length;
const defenderCount = defenders.length;
const midfielderCount = midfielders.length;
const forwardCount = forwards.length;
let goalkeeper1Index = 0;
let goalkeeper2Index = 0;
let defender1Index = 0;
let defender2Index = 0;
let defender3Index = 0;
let defender4Index = 0;
let defender5Index = 0;
let midfielder1Index = 0;
let midfielder2Index = 0;
let midfielder3Index = 0;
let midfielder4Index = 0;
let midfielder5Index = 0;
let forward1Index = 0;
let forward2Index = 0;
let forward3Index = 0;

let bestTeam = '';
let bestTotalPointsPerFullSeason = 0;
let bestTeamPrice = 0;


onmessage = (e) => {
	const { goalkeeper1Index } = e.data;

	const goalkeeper1 = goalkeepers[goalkeeper1Index];
	const goalkeeper1PointsPerMinute = goalkeeper1.points / goalkeeper1.minutes;
	const goalkeeper1Team = goalkeeper1.name.split('---')[1].substring(0, 3);

	/*for (goalkeeper2Index = goalkeeper1Index + 1; goalkeeper2Index < goalkeeperCount; goalkeeper2Index++) {*/
		goalkeeper2Index = 0;
		const goalkeeper2 = goalkeepers[goalkeeper2Index];
		const goalkeeper2PointsPerMinute = goalkeeper2.points / goalkeeper2.minutes;
		const goalkeeper2Team = goalkeeper2.name.split('---')[1].substring(0, 3);

		// Loop over the defenders
		for (defender1Index = 1; defender1Index < defenderCount - 3; defender1Index++) {
			const defender1 = defenders[defender1Index];
			const timer = performance.now();
			const defender1PointsPerMinute = defender1.points / defender1.minutes;
			const defender1Team = defender1.name.split('---')[1].substring(0, 3);

			for (defender2Index = defender1Index + 1; defender2Index < defenderCount - 2; defender2Index++) {
				const defender2 = defenders[defender2Index];
				const defender2PointsPerMinute = defender2.points / defender2.minutes;
				const defender2Team = defender2.name.split('---')[1].substring(0, 3);

				for (defender3Index = defender2Index + 1; defender3Index < defenderCount - 1; defender3Index++) {
					const defender3 = defenders[defender3Index];
					const defender3PointsPerMinute = defender3.points / defender3.minutes;
					const defender3Team = defender3.name.split('---')[1].substring(0, 3);

					for (defender4Index = defender3Index + 1; defender4Index < defenderCount; defender4Index++) {
						const defender4 = defenders[defender4Index];
						const defender4PointsPerMinute = defender4.points / defender4.minutes;
						const defender4Team = defender4.name.split('---')[1].substring(0, 3);

						/*for (defender5Index = defender4Index + 1; defender5Index < defenderCount; defender5Index++) {*/
							defender5Index = 0;
							const defender5 = defenders[defender5Index];
							const defender5PointsPerMinute = defender5.points / defender5.minutes;
							const defender5Team = defender5.name.split('---')[1].substring(0, 3);

							// Loop over the midfielders
							for (midfielder1Index = 1; midfielder1Index < midfielderCount - 3; midfielder1Index++) {
								const midfielder1 = midfielders[midfielder1Index];
								const midfielder1PointsPerMinute = midfielder1.points / midfielder1.minutes;
								const midfielder1Team = midfielder1.name.split('---')[1].substring(0, 3);

								for (midfielder2Index = midfielder1Index + 1; midfielder2Index < midfielderCount - 2; midfielder2Index++) {
									const midfielder2 = midfielders[midfielder2Index];
									const midfielder2PointsPerMinute = midfielder2.points / midfielder2.minutes;
									const midfielder2Team = midfielder2.name.split('---')[1].substring(0, 3);

									for (midfielder3Index = midfielder2Index + 1; midfielder3Index < midfielderCount - 1; midfielder3Index++) {
										const midfielder3 = midfielders[midfielder3Index];
										const midfielder3PointsPerMinute = midfielder3.points / midfielder3.minutes;
										const midfielder3Team = midfielder3.name.split('---')[1].substring(0, 3);

										for (midfielder4Index = midfielder3Index + 1; midfielder4Index < midfielderCount; midfielder4Index++) {
											const midfielder4 = midfielders[midfielder4Index];
											const midfielder4PointsPerMinute = midfielder4.points / midfielder4.minutes;
											const midfielder4Team = midfielder4.name.split('---')[1].substring(0, 3);

											/*for (midfielder5Index = midfielder4Index + 1; midfielder5Index < midfielderCount; midfielder5Index++) {*/
												midfielder5Index = 0;
												const midfielder5 = midfielders[midfielder5Index];
												const midfielder5PointsPerMinute = midfielder5.points / midfielder5.minutes;
												const midfielder5Team = midfielder5.name.split('---')[1].substring(0, 3);

												// Loop over the forwards
												for (forward1Index = 1; forward1Index < forwardCount - 1; forward1Index++) {
													const forward1 = forwards[forward1Index];
													const forward1PointsPerMinute = forward1.points / forward1.minutes;
													const forward1Team = forward1.name.split('---')[1].substring(0, 3);
				
													for (forward2Index = forward1Index + 1; forward2Index < forwardCount; forward2Index++) {
														const forward2 = forwards[forward2Index];
														const forward2PointsPerMinute = forward2.points / forward2.minutes;
														const forward2Team = forward2.name.split('---')[1].substring(0, 3);
				
														/*for (forward3Index = forward2Index + 1; forward3Index < forwardCount; forward3Index++) {*/
															forward3Index = 0;
															const forward3 = forwards[forward3Index];
															const forward3PointsPerMinute = forward3.points / forward3.minutes;
															const forward3Team = forward3.name.split('---')[1].substring(0, 3);
															
															const total_price = goalkeeper1.price + 
																goalkeeper2.price + 
																defender1.price + 
																defender2.price + 
																defender3.price + 
																defender4.price + 
																defender5.price + 
																midfielder1.price + 
																midfielder2.price + 
																midfielder3.price + 
																midfielder4.price + 
																midfielder5.price + 
																forward1.price + 
																forward2.price + 
																forward3.price;
															
															// The team price cannot exceed 100.
															if (total_price > 100) {
																continue;
															}

															// Maximum of 3 players from the same team.
															let teams = goalkeeper1Team + '~' +
																goalkeeper2Team + '~' +
																defender1Team + '~' +
																defender2Team + '~' +
																defender3Team + '~' +
																defender4Team + '~' +
																defender5Team + '~' +
																midfielder1Team + '~' +
																midfielder2Team + '~' + 
																midfielder3Team + '~' +
																midfielder4Team + '~' +
																midfielder5Team + '~' +
																forward1Team + '~' +
																forward2Team + '~' +
																forward3Team + '~';
															
															let tooManyFromOneTeam = false;
															while (teams.length > 0) {
																// Get the team at the start of the list.
																const team = teams.substring(0, 4);
														
																const r = new RegExp(team, 'g');
														
																// Find how many matches there are...
																const matches = teams.match(r).length;
														
																if (matches > 3) {
																	// console.log('Too Many!');
																	tooManyFromOneTeam = true;
																	break;
																}
														
																teams = teams.replaceAll(r, '');
															}

															if (tooManyFromOneTeam) {
																continue;
															}
															
															let totalPointsPerFullSeason = 38 * 90 * (
																goalkeeper1PointsPerMinute + 
																goalkeeper2PointsPerMinute + 
																defender1PointsPerMinute + 
																defender2PointsPerMinute + 
																defender3PointsPerMinute + 
																defender4PointsPerMinute + 
																defender5PointsPerMinute + 
																midfielder1PointsPerMinute + 
																midfielder2PointsPerMinute + 
																midfielder3PointsPerMinute + 
																midfielder4PointsPerMinute + 
																midfielder5PointsPerMinute + 
																forward1PointsPerMinute + 
																forward2PointsPerMinute + 
																forward3PointsPerMinute
															);

															// Captaincy
															// Captain gets double points, and we want to apply that
															// to the highest score over the season.
															const maximumPointsPerMinute = Math.max(
																goalkeeper1PointsPerMinute,
																goalkeeper2PointsPerMinute,
																defender1PointsPerMinute,
																defender2PointsPerMinute,
																defender3PointsPerMinute,
																defender4PointsPerMinute,
																defender5PointsPerMinute,
																midfielder1PointsPerMinute,
																midfielder2PointsPerMinute, 
																midfielder3PointsPerMinute,
																midfielder4PointsPerMinute,
																midfielder5PointsPerMinute,
																forward1PointsPerMinute,
																forward2PointsPerMinute,
																forward3PointsPerMinute
															);
															totalPointsPerFullSeason += 38 * 90 * maximumPointsPerMinute;
															
															if (totalPointsPerFullSeason > bestTotalPointsPerFullSeason) {
																bestTeamPrice = total_price;
																bestTotalPointsPerFullSeason = totalPointsPerFullSeason;
																bestTeam = goalkeeper1.name + 
																goalkeeper2.name + 
																defender1.name + 
																defender2.name + 
																defender3.name + 
																defender4.name + 
																defender5.name + 
																midfielder1.name + 
																midfielder2.name + 
																midfielder3.name + 
																midfielder4.name + 
																midfielder5.name + 
																forward1.name + 
																forward2.name + 
																forward3.name;
															}

															// console.log('total_price', total_price, total_points_per_minute);
														//}
													}
												}
											//}
										}
									}
								}
							}
						//}
					}
				}
			}

			console.log(goalkeeper1.name, `${Math.floor(100 * (defender1Index / (defenderCount - 4)))}%`, `${Math.floor((performance.now() - timer) / 1000)}s`);
		}
	//}

	postMessage({ bestTeam, bestTeamPrice, bestTotalPointsPerFullSeason });
}
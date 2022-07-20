// Constants

const fixtureCount = 5;

// Variables

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
let bestTotalPoints = 0;
let bestTeamPrice = 0;


onmessage = (e) => {
	const {
		goalkeepers,
		defenders,
		midfielders,
		forwards,
		fixtureDifficulty,
		goalkeeper1Index
	} = e.data;

	const goalkeeperCount = goalkeepers.length;
	const defenderCount = defenders.length;
	const midfielderCount = midfielders.length;
	const forwardCount = forwards.length;

	goalkeepers.forEach(goalkeeper => {
		goalkeeper.team = goalkeeper.name.split('---')[1].substring(0, 3);
		goalkeeper.totalPoints = fixtureMinutes * fixtureDifficulty[goalkeeper.team] * goalkeeper.points / goalkeeper.minutes;
	});

	defenders.forEach(defender => {
		defender.team = defender.name.split('---')[1].substring(0, 3);
		defender.totalPoints = fixtureMinutes * fixtureDifficulty[defender.team] * defender.points / defender.minutes;
	});

	midfielders.forEach(midfielder => {
		midfielder.team = midfielder.name.split('---')[1].substring(0, 3);
		midfielder.totalPoints = fixtureMinutes * fixtureDifficulty[midfielder.team] * midfielder.points / midfielder.minutes;
	});

	forwards.forEach(forward => {
		forward.team = forward.name.split('---')[1].substring(0, 3);
		forward.totalPoints = fixtureMinutes * fixtureDifficulty[forward.team] * forward.points / forward.minutes;
	});

	const fixtureMinutes = 90 * fixtureCount;

	const goalkeeper1 = goalkeepers[goalkeeper1Index];

	/*for (goalkeeper2Index = goalkeeper1Index + 1; goalkeeper2Index < goalkeeperCount; goalkeeper2Index++) {*/
		goalkeeper2Index = 0;
		const goalkeeper2 = goalkeepers[goalkeeper2Index];

		// Loop over the defenders
		for (defender1Index = 0; defender1Index < defenderCount - 4; defender1Index++) {
			const defender1 = defenders[defender1Index];
			const timer = performance.now();

			for (defender2Index = defender1Index + 1; defender2Index < defenderCount - 3; defender2Index++) {
				const defender2 = defenders[defender2Index];

				for (defender3Index = defender2Index + 1; defender3Index < defenderCount - 2; defender3Index++) {
					const defender3 = defenders[defender3Index];

					for (defender4Index = defender3Index + 1; defender4Index < defenderCount - 1; defender4Index++) {
						const defender4 = defenders[defender4Index];

						for (defender5Index = defender4Index + 1; defender5Index < defenderCount; defender5Index++) {
							const defender5 = defenders[defender5Index];

							// Loop over the midfielders
							for (midfielder1Index = 0; midfielder1Index < midfielderCount - 4; midfielder1Index++) {
								const midfielder1 = midfielders[midfielder1Index];

								for (midfielder2Index = midfielder1Index + 1; midfielder2Index < midfielderCount - 3; midfielder2Index++) {
									const midfielder2 = midfielders[midfielder2Index];

									for (midfielder3Index = midfielder2Index + 1; midfielder3Index < midfielderCount - 2; midfielder3Index++) {
										const midfielder3 = midfielders[midfielder3Index];

										for (midfielder4Index = midfielder3Index + 1; midfielder4Index < midfielderCount - 1; midfielder4Index++) {
											const midfielder4 = midfielders[midfielder4Index];

											for (midfielder5Index = midfielder4Index + 1; midfielder5Index < midfielderCount; midfielder5Index++) {
												const midfielder5 = midfielders[midfielder5Index];

												// Loop over the forwards
												for (forward1Index = 0; forward1Index < forwardCount - 2; forward1Index++) {
													const forward1 = forwards[forward1Index];
				
													for (forward2Index = forward1Index + 1; forward2Index < forwardCount - 1; forward2Index++) {
														const forward2 = forwards[forward2Index];
				
														for (forward3Index = forward2Index + 1; forward3Index < forwardCount; forward3Index++) {
															const forward3 = forwards[forward3Index];
															
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
															let teams = goalkeeper1.team + '~' +
																goalkeeper2.team + '~' +
																defender1.team + '~' +
																defender2.team + '~' +
																defender3.team + '~' +
																defender4.team + '~' +
																defender5.team + '~' +
																midfielder1.team + '~' +
																midfielder2.team + '~' + 
																midfielder3.team + '~' +
																midfielder4.team + '~' +
																midfielder5.team + '~' +
																forward1.team + '~' +
																forward2.team + '~' +
																forward3.team + '~';
															
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
															
															let totalPoints = goalkeeper1.totalPoints + 
																goalkeeper2.totalPoints + 
																defender1.totalPoints + 
																defender2.totalPoints + 
																defender3.totalPoints + 
																defender4.totalPoints + 
																defender5.totalPoints + 
																midfielder1.totalPoints + 
																midfielder2.totalPoints + 
																midfielder3.totalPoints + 
																midfielder4.totalPoints + 
																midfielder5.totalPoints + 
																forward1.totalPoints + 
																forward2.totalPoints + 
																forward3.totalPoints;

															// Captaincy
															// Captain gets double points, and we want to apply that
															// to the highest score over the season.
															totalPoints += Math.max(
																goalkeeper1.totalPoints,
																goalkeeper2.totalPoints,
																defender1.totalPoints,
																defender2.totalPoints,
																defender3.totalPoints,
																defender4.totalPoints,
																defender5.totalPoints,
																midfielder1.totalPoints,
																midfielder2.totalPoints, 
																midfielder3.totalPoints,
																midfielder4.totalPoints,
																midfielder5.totalPoints,
																forward1.totalPoints,
																forward2.totalPoints,
																forward3.totalPoints
															);
															
															if (totalPoints > bestTotalPoints) {
																bestTeamPrice = total_price;
																bestTotalPoints = totalPoints;
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
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			
			console.log(goalkeeper1.name, `${Math.floor(1000 * (defender1Index / (defenderCount - 4))) / 10}%`, `${Math.floor((performance.now() - timer) / 1000)}s`);
		}
	//}

	postMessage({ bestTeam, bestTeamPrice, bestTotalPoints });
}
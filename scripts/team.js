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
let bestTotalPointsPerFullSeason = 0;
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

	const goalkeeper1 = goalkeepers[goalkeeper1Index];
	const goalkeeper1Team = goalkeeper1.name.split('---')[1].substring(0, 3);
	const goalkeeper1PointsPerMinute = fixtureDifficulty[goalkeeper1Team] * goalkeeper1.points / goalkeeper1.minutes;

	/*for (goalkeeper2Index = goalkeeper1Index + 1; goalkeeper2Index < goalkeeperCount; goalkeeper2Index++) {*/
		goalkeeper2Index = 0;
		const goalkeeper2 = goalkeepers[goalkeeper2Index];
		const goalkeeper2Team = goalkeeper2.name.split('---')[1].substring(0, 3);
		const goalkeeper2PointsPerMinute = fixtureDifficulty[goalkeeper2Team] * goalkeeper2.points / goalkeeper2.minutes;

		// Loop over the defenders
		for (defender1Index = 0; defender1Index < defenderCount - 4; defender1Index++) {
			const defender1 = defenders[defender1Index];
			const timer = performance.now();
			const defender1Team = defender1.name.split('---')[1].substring(0, 3);
			const defender1PointsPerMinute = fixtureDifficulty[defender1Team] * defender1.points / defender1.minutes;

			for (defender2Index = defender1Index + 1; defender2Index < defenderCount - 3; defender2Index++) {
				const defender2 = defenders[defender2Index];
				const defender2Team = defender2.name.split('---')[1].substring(0, 3);
				const defender2PointsPerMinute = fixtureDifficulty[defender2Team] * defender2.points / defender2.minutes;

				for (defender3Index = defender2Index + 1; defender3Index < defenderCount - 2; defender3Index++) {
					const defender3 = defenders[defender3Index];
					const defender3Team = defender3.name.split('---')[1].substring(0, 3);
					const defender3PointsPerMinute = fixtureDifficulty[defender3Team] * defender3.points / defender3.minutes;

					for (defender4Index = defender3Index + 1; defender4Index < defenderCount - 1; defender4Index++) {
						const defender4 = defenders[defender4Index];
						const defender4Team = defender4.name.split('---')[1].substring(0, 3);
						const defender4PointsPerMinute = fixtureDifficulty[defender4Team] * fixtureDifficulty[defender1Team] * defender4.points / defender4.minutes;

						for (defender5Index = defender4Index + 1; defender5Index < defenderCount; defender5Index++) {
							const defender5 = defenders[defender5Index];
							const defender5Team = defender5.name.split('---')[1].substring(0, 3);
							const defender5PointsPerMinute = fixtureDifficulty[defender5Team] * defender5.points / defender5.minutes;

							// Loop over the midfielders
							for (midfielder1Index = 0; midfielder1Index < midfielderCount - 4; midfielder1Index++) {
								const midfielder1 = midfielders[midfielder1Index];
								const midfielder1Team = midfielder1.name.split('---')[1].substring(0, 3);
								const midfielder1PointsPerMinute = fixtureDifficulty[midfielder1Team] * midfielder1.points / midfielder1.minutes;

								for (midfielder2Index = midfielder1Index + 1; midfielder2Index < midfielderCount - 3; midfielder2Index++) {
									const midfielder2 = midfielders[midfielder2Index];
									const midfielder2Team = midfielder2.name.split('---')[1].substring(0, 3);
									const midfielder2PointsPerMinute = fixtureDifficulty[midfielder2Team] * midfielder2.points / midfielder2.minutes;

									for (midfielder3Index = midfielder2Index + 1; midfielder3Index < midfielderCount - 2; midfielder3Index++) {
										const midfielder3 = midfielders[midfielder3Index];
										const midfielder3Team = midfielder3.name.split('---')[1].substring(0, 3);
										const midfielder3PointsPerMinute = fixtureDifficulty[midfielder3Team] * midfielder3.points / midfielder3.minutes;

										for (midfielder4Index = midfielder3Index + 1; midfielder4Index < midfielderCount - 1; midfielder4Index++) {
											const midfielder4 = midfielders[midfielder4Index];
											const midfielder4Team = midfielder4.name.split('---')[1].substring(0, 3);
											const midfielder4PointsPerMinute = fixtureDifficulty[midfielder4Team] * midfielder4.points / midfielder4.minutes;

											for (midfielder5Index = midfielder4Index + 1; midfielder5Index < midfielderCount; midfielder5Index++) {
												const midfielder5 = midfielders[midfielder5Index];
												const midfielder5Team = midfielder5.name.split('---')[1].substring(0, 3);
												const midfielder5PointsPerMinute = fixtureDifficulty[midfielder5Team] * midfielder5.points / midfielder5.minutes;

												// Loop over the forwards
												for (forward1Index = 0; forward1Index < forwardCount - 2; forward1Index++) {
													const forward1 = forwards[forward1Index];
													const forward1Team = forward1.name.split('---')[1].substring(0, 3);
													const forward1PointsPerMinute = fixtureDifficulty[forward1Team] * forward1.points / forward1.minutes;
				
													for (forward2Index = forward1Index + 1; forward2Index < forwardCount - 1; forward2Index++) {
														const forward2 = forwards[forward2Index];
														const forward2Team = forward2.name.split('---')[1].substring(0, 3);
														const forward2PointsPerMinute = fixtureDifficulty[forward2Team] * forward2.points / forward2.minutes;
				
														for (forward3Index = forward2Index + 1; forward3Index < forwardCount; forward3Index++) {
															const forward3 = forwards[forward3Index];
															const forward3Team = forward3.name.split('---')[1].substring(0, 3);
															const forward3PointsPerMinute = fixtureDifficulty[forward3Team] * forward3.points / forward3.minutes;
															
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
															
															let totalPointsPerFullSeason = 5 * 90 * (
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
															totalPointsPerFullSeason += 5 * 90 * maximumPointsPerMinute;
															
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
														}
													}
												}
											}
										}
									}
								}
								console.log(goalkeeper1.name, `${Math.floor(100 * (midfielder1Index / (midfielderCount - 4)))}%`, `${Math.floor((performance.now() - timer) / 1000)}s`);
							}
						}
					}
				}
			}
		}
	//}

	postMessage({ bestTeam, bestTeamPrice, bestTotalPointsPerFullSeason });
}
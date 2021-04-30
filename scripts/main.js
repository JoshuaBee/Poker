// Enums

const ranks = {
	TWO: 1,
	THREE: 2,
	FOUR: 3,
	FIVE: 4,
	SIX: 5,
	SEVEN: 6,
	EIGHT: 7,
	NINE: 8,
	TEN: 9,
	JACK: 10,
	QUEEN: 11,
	KING: 12,
	ACE: 13
};
Object.freeze(ranks);

const suits = {
	DIAMONDS: 1,
	CLUBS: 2,
	HEARTS: 3,
	SPADES: 4
};
Object.freeze(suits);

const handValues = {
	HIGHCARD: 1,
	PAIR: 2,
	TWO_PAIRS: 3,
	THREE_OF_A_KIND: 4,
	STRAIGHT: 5,
	FLUSH: 6,
	FULL_HOUSE: 7,
	FOUR_OF_A_KIND: 8,
	STRAIGHT_FLUSH: 9,
	ROYAL_FLUSH: 10
};
Object.freeze(handValues);

const results = {
	HAND_1_WIN: 1,
	DRAW: 2,
	HAND_2_WIN: 3
};
Object.freeze(results);

const stages = {
	PREFLOP: 1,
	FLOP: 2,
	TURN: 3,
	RIVER: 4
};
Object.freeze(stages);



// Classes

class Deck {
	constructor() {
		this.cards = [];
	}

	build() {
		// Rebuild the deck.
		this.cards = [];
		for (var rank of Object.keys(ranks)) {
			for (var suit of Object.keys(suits)) {
				this.cards.push(new Card(rank, suit));
			};
		};
	}

	add(cards) {
		this.cards.concat(cards);
	}

	shuffle() {
		var currentIndex;
		var temporaryValue;
		var randomIndex;

		// While there remain elements to shuffle...
		currentIndex = this.cards.length;
		while (currentIndex !== 0) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = this.cards[currentIndex];
			this.cards[currentIndex] = this.cards[randomIndex];
			this.cards[randomIndex] = temporaryValue;
		}
	}

	draw() {
		return this.cards.pop();
	}

	take(rank, suit) {
		var card;
		for(var i = 0; i < this.cards.length; i++) {
			card = this.cards[i];
			if (card.rank === rank && card.suit === suit) {
				return this.takeByIndex(i);
			}
		}
	}

	takeByIndex(index) {
		return this.cards.splice(index, 1)
	}

	peek(index) {
		if (index < 0 || index > this.cards.length) {
			return;
		}

		return this.cards[index];
	}

	burn() {
		this.cards.pop();
	}

	sort() {
		this.cards.sort(compareCards);
	}

	count() {
		return this.cards.length;
	}
}

class Card {
	constructor(rank, suit) {
		this.rank = rank;
		this.suit = suit;
	}
}

class Score {
	constructor(value, primaryCard, secondaryCard, tertiaryCard, quaternaryCard, quinaryCard) {
		this.value = value;
		this.primaryCard = primaryCard;
		this.secondaryCard= secondaryCard;
		this.tertiaryCard = tertiaryCard;
		this.quaternaryCard = quaternaryCard;
		this.quinaryCard = quinaryCard;
	}
}



// Constants

const deck = new Deck();



// Variables
var deferredPrompt;
var communityCards = [];
var communityCardsTemp = [];
var possibleOpponentsCards = [];
var holeCards = [];
var wins = 0;
var draws = 0;
var losses = 0;
var opponents = 1;
var stage;
var opponents;
var playerPosition;
var maximumRaises;



// Elements
const $cards = document.querySelectorAll('.card');

// Settings

// Constants
const $opponents = document.querySelector('#opponents');
const $position = document.querySelector('#position');
const $maximumRaises = document.querySelector('#maximumRaises');

// Buttons
const $setupButtonTrigger = document.querySelector('#setupButtonTrigger');
const $runButtonTrigger = document.querySelector('#runButtonTrigger');
const $clearButtonTrigger = document.querySelector('#clearButtonTrigger');
const $tableItems = document.querySelectorAll('.table-item');
const $playerList = document.querySelector('#player-list');

const $tablePreFlopWins = document.querySelector('.table-item[data-stage="PREFLOP"][data-attribute="wins"]');
const $tableFlopWins = document.querySelector('.table-item[data-stage="FLOP"][data-attribute="wins"]');
const $tableTurnWins = document.querySelector('.table-item[data-stage="TURN"][data-attribute="wins"]');
const $tableRiverWins = document.querySelector('.table-item[data-stage="RIVER"][data-attribute="wins"]');
const $tablePreFlopDraws = document.querySelector('.table-item[data-stage="PREFLOP"][data-attribute="draws"]');
const $tableFlopDraws = document.querySelector('.table-item[data-stage="FLOP"][data-attribute="draws"]');
const $tableTurnDraws = document.querySelector('.table-item[data-stage="TURN"][data-attribute="draws"]');
const $tableRiverDraws = document.querySelector('.table-item[data-stage="RIVER"][data-attribute="draws"]');
const $tablePreFlopLosses = document.querySelector('.table-item[data-stage="PREFLOP"][data-attribute="losses"]');
const $tableFlopLosses = document.querySelector('.table-item[data-stage="FLOP"][data-attribute="losses"]');
const $tableTurnLosses = document.querySelector('.table-item[data-stage="TURN"][data-attribute="losses"]');
const $tableRiverLosses = document.querySelector('.table-item[data-stage="RIVER"][data-attribute="losses"]');
const $tablePreFlopNotLosePercentage = document.querySelector('.table-item[data-stage="PREFLOP"][data-attribute="not-lose-percentage"]');
const $tableFlopNotLosePercentage = document.querySelector('.table-item[data-stage="FLOP"][data-attribute="not-lose-percentage"]');
const $tableTurnNotLosePercentage = document.querySelector('.table-item[data-stage="TURN"][data-attribute="not-lose-percentage"]');
const $tableRiverNotLosePercentage = document.querySelector('.table-item[data-stage="RIVER"][data-attribute="not-lose-percentage"]');
const $tablePreFlopTime = document.querySelector('.table-item[data-stage="PREFLOP"][data-attribute="time"]');
const $tableFlopTime = document.querySelector('.table-item[data-stage="FLOP"][data-attribute="time"]');
const $tableTurnTime = document.querySelector('.table-item[data-stage="TURN"][data-attribute="time"]');
const $tableRiverTime = document.querySelector('.table-item[data-stage="RIVER"][data-attribute="time"]');



document.addEventListener('DOMContentLoaded', function(event) {
	bindEvents();
});



function bindEvents() {
	$cards.forEach($card => {
		$card.addEventListener('click', () => {
			var selected = $card.dataset.cardSelected;
			
			switch(selected) {
				case "player":
					$card.dataset.cardSelected = 'community';
					break;
				case "community":
					delete $card.dataset.cardSelected;
					break;
				default:
					$card.dataset.cardSelected = 'player';
			}
		});
	});

	$setupButtonTrigger.addEventListener('click', setup);
	$runButtonTrigger.addEventListener('click', run);
	$clearButtonTrigger.addEventListener('click', clear);
}



function setup() {
	clear();

	// Global Variables
	stage = stages.PREFLOP;
	opponents = Number($opponents.value);
	playerPosition = Number($position.value);
	raises = 0;
	maximumRaises = Number($maximumRaises.value);

	generatePlayerList();
}



function run() {
	// Constants
	const $playersCards = document.querySelectorAll('.card[data-card-selected="player"]');
	const $communityCards = document.querySelectorAll('.card[data-card-selected="community"]');


	// Global Variables
	holeCards = [];
	communityCards = [];
	communityCardsTemp = [];



	// Variables
	var communityCard4;
	var communityCard5;
	var start = Date.now();
	var possibleCommunityCards = [];
	var total = 0;


	deck.build();
	//deck.shuffle();



	// Pre-Flop

	// Validate Cards
	if ($playersCards.length !== 2) {
		document.querySelector('#message').innerHTML = 'Need two player cards.';
		return;
	}

	if ($communityCards.length > 5) {
		document.querySelector('#message').innerHTML = 'Need fewer community cards';
		return;
	}

	// Get Players Cards from Deck
	$playersCards.forEach($playersCard => {
		holeCards.push(...deck.take($playersCard.dataset.cardRank, $playersCard.dataset.cardSuit));
	});
	console.log('Hole Cards', holeCards);

	// Get Community Cards from Deck
	$communityCards.forEach($communityCard => {
		communityCards.push(...deck.take($communityCard.dataset.cardRank, $communityCard.dataset.cardSuit));
	});
	console.log('Community Cards', communityCards);

	// Flop
	// TODO Make sure I do not want to include burnt cards
	//deck.burn();
	//communityCards.push(deck.draw());
	//communityCards.push(deck.draw());
	//communityCards.push(deck.draw());

	// Turn
	//deck.burn();
	//communityCards.push(deck.draw());

	// River
	//deck.burn();
	//communityCards.push(deck.draw());

	deck.sort();

	wins = 0;
	draws = 0;
	losses = 0;
	possibleCommunityCards = [...deck.cards];

	// Need to run different functions depending on how many community cards have been drawn.
	switch (communityCards.length) {
		// If no community cards have been drawn, then we need to draw 5 more.
		case 0:
			// TODO
			// Takes too long to calculate what to do with no community cards. Instead use a hardcoded list of starting hand strengths.
			stage = stages.PREFLOP;
			/*for (var communityCard1Index = 0; communityCard1Index < possibleCommunityCards.length - 4; communityCard1Index++) {
				// 
				communityCard1 = possibleCommunityCards[communityCard1Index];
				console.log(communityCard1);

				for (var communityCard2Index = communityCard1Index + 1; communityCard2Index < possibleCommunityCards.length - 3; communityCard2Index++) {
					// 
					communityCard2 = possibleCommunityCards[communityCard2Index];

					for (var communityCard3Index = communityCard2Index + 1; communityCard3Index < possibleCommunityCards.length - 2; communityCard3Index++) {
						// 
						communityCard3 = possibleCommunityCards[communityCard3Index];

						for (var communityCard4Index = communityCard3Index + 1; communityCard4Index < possibleCommunityCards.length - 1; communityCard4Index++) {
							// 
							communityCard4 = possibleCommunityCards[communityCard4Index];

							for (var communityCard5Index = communityCard4Index + 1; communityCard5Index < possibleCommunityCards.length; communityCard5Index++) {
								// 
								communityCard5 = possibleCommunityCards[communityCard5Index];

								// Remove the community cards from the possible opponents cards.
								possibleOpponentsCards = [...deck.cards];
								possibleOpponentsCards.splice(communityCard1Index, 1);
								possibleOpponentsCards.splice(communityCard2Index - 1, 1);
								possibleOpponentsCards.splice(communityCard3Index - 2, 1);
								possibleOpponentsCards.splice(communityCard4Index - 3, 1);
								possibleOpponentsCards.splice(communityCard5Index - 4, 1);

								communityCardsTemp = [...communityCards, communityCard1, communityCard2, communityCard3, communityCard4, communityCard5];

								calculate();
							}
						}
					}
				}
			}*/
			break;
		// If 3 community cards have been drawn, then we need to draw 2 more.
		case 3:
			stage = stages.FLOP;
			for (var communityCard4Index = 0; communityCard4Index < possibleCommunityCards.length - 1; communityCard4Index++) {
				// 
				communityCard4 = possibleCommunityCards[communityCard4Index];

				for (var communityCard5Index = communityCard4Index + 1; communityCard5Index < possibleCommunityCards.length; communityCard5Index++) {
					// 
					communityCard5 = possibleCommunityCards[communityCard5Index];

					// Remove the community cards from the possible opponents cards.
					possibleOpponentsCards = [...deck.cards];
					possibleOpponentsCards.splice(communityCard4Index, 1);
					possibleOpponentsCards.splice(communityCard5Index - 1, 1);

					communityCardsTemp = [...communityCards, communityCard4, communityCard5];

					calculate();
				}
			}
			break;
		// If 4 community cards have been drawn, then we need to draw 1 more.
		case 4:
			stage = stages.TURN;
			for (var communityCard5Index = 0; communityCard5Index < possibleCommunityCards.length; communityCard5Index++) {
				// 
				communityCard5 = possibleCommunityCards[communityCard5Index];

				// Remove the community cards from the possible opponents cards.
				possibleOpponentsCards = [...deck.cards];
				possibleOpponentsCards.splice(communityCard5Index, 1);

				communityCardsTemp = [...communityCards, communityCard5];

				calculate();
			}
			break;
		// If all 5 community cards have been drawn, then we have all the cards we need.
		case 5:
			stage = stages.RIVER;

			// Remove the community cards from the possible opponents cards.
			possibleOpponentsCards = [...deck.cards];

			communityCardsTemp = [...communityCards];

			calculate();
			break;
		default:
			document.querySelector('#message').innerHTML = 'Uh oh';
			break;
	}

	total = wins + draws + losses;
	no_lose_decimal = (wins + draws) / total;
	no_lose_decimal_all = Math.pow((wins + draws) / total, opponents);
	
	console.log('Wins:', wins);
	console.log('Draws:', draws);
	console.log('Losses:', losses);
	console.log('Total:', total);
	console.log('Not Lose Percentage - 1 Opponent', `${ (100 * no_lose_decimal).toFixed(2) }%`);
	console.log('Not Lose Percentage - All Opponents', `${ (100 * no_lose_decimal_all).toFixed(2) }%`);
	console.log('Time:', `${ Date.now() - start }ms`);

	// Update table
	switch (stage) {
		case stages.PREFLOP:
			$tablePreFlopWins.innerHTML = `${ wins } (${ (100 * wins / total).toFixed(0) }%)`;
			$tablePreFlopDraws.innerHTML = `${ draws } (${ (100 * draws / total).toFixed(0) }%)`;
			$tablePreFlopLosses.innerHTML = `${ losses } (${ (100 * losses / total).toFixed(0) }%)`;
			$tablePreFlopNotLosePercentage.innerHTML = `${ (100 * Math.pow((wins + draws) / total, opponents)).toFixed(2) }%`;
			$tablePreFlopTime.innerHTML = `${ Date.now() - start }ms`;
			break;
		case stages.FLOP:
			$tableFlopWins.innerHTML = `${ wins } (${ (100 * wins / total).toFixed(0) }%)`;
			$tableFlopDraws.innerHTML = `${ draws } (${ (100 * draws / total).toFixed(0) }%)`;
			$tableFlopLosses.innerHTML = `${ losses } (${ (100 * losses / total).toFixed(0) }%)`;
			$tableFlopNotLosePercentage.innerHTML = `${ (100 * Math.pow((wins + draws) / total, opponents)).toFixed(2) }%`;
			$tableFlopTime.innerHTML = `${ Date.now() - start }ms`;
			break;
		case stages.TURN:
			$tableTurnWins.innerHTML = `${ wins } (${ (100 * wins / total).toFixed(0) }%)`;
			$tableTurnDraws.innerHTML = `${ draws } (${ (100 * draws / total).toFixed(0) }%)`;
			$tableTurnLosses.innerHTML = `${ losses } (${ (100 * losses / total).toFixed(0) }%)`;
			$tableTurnNotLosePercentage.innerHTML = `${ (100 * Math.pow((wins + draws) / total, opponents)).toFixed(2) }%`;
			$tableTurnTime.innerHTML = `${ Date.now() - start }ms`;
			break;
		case stages.RIVER:
			$tableRiverWins.innerHTML = `${ wins } (${ (100 * wins / total).toFixed(0) }%)`;
			$tableRiverDraws.innerHTML = `${ draws } (${ (100 * draws / total).toFixed(0) }%)`;
			$tableRiverLosses.innerHTML = `${ losses } (${ (100 * losses / total).toFixed(0) }%)`;
			$tableRiverNotLosePercentage.innerHTML = `${ (100 * Math.pow((wins + draws) / total, opponents)).toFixed(2) }%`;
			$tableRiverTime.innerHTML = `${ Date.now() - start }ms`;
			break;
	}
}

function generatePlayerList() {
	for (var position = 1; position <= opponents; position++) {
		var positionName = '';
		var positionGroup = 'middle';
		if (position === 1) {
			positionName = 'Small Blind';
			positionGroup = 'early';
		}
		else if (position === 2) {
			positionName = 'Big Blind';
			positionGroup = 'early';
		}
		else if (position === 3) {
			positionName = 'Under the Gun';
			positionGroup = 'early';
		}
		else if (position === Number($opponents.value) - 2) {
			positionGroup = 'late';
		}
		else if (position === Number($opponents.value) - 1) {
			positionName = 'Cut-Off';
			positionGroup = 'late';
		}
		else if (position === Number($opponents.value)) {
			positionName = 'Button';
			positionGroup = 'late';
		}

		var isPlayer = position === playerPosition;
		var isActive = position === 3;

		var bet = 0;
		if (position === 1) {
			bet = 10;
		}
		else if (position === 2) {
			bet = 20;
		}

		// Create the row
		var tableRow = document.createElement('tr');
		tableRow.dataset.active = isActive;
		tableRow.dataset.player = isPlayer;
		tableRow.dataset.position = position;
		tableRow.dataset.positionGroup = positionGroup;

		// Create the row header
		var tableRowHeading = document.createElement('th');
		tableRowHeading.innerHTML = `${ position } ${ positionName }`;
		tableRowHeading.scope = 'row';
		tableRow.appendChild(tableRowHeading);

		// Create the Bet cell
		var betCell = document.createElement('td');
		betCell.classList.add('table-item');
		betCell.innerHTML = bet;
		tableRow.appendChild(betCell);

		// Create the actions cell
		var tableRowCell = document.createElement('td');
		tableRowCell.classList.add('table-item');

		// Create the fold button
		var foldButton = document.createElement('button');
		foldButton.classList.add('button');
		foldButton.disabled = !isActive;
		foldButton.innerHTML = 'Fold';
		foldButton.addEventListener('click', fold);
		tableRowCell.appendChild(foldButton);

		// Create the check button
		var checkButton = document.createElement('button');
		checkButton.classList.add('button');
		checkButton.disabled = !isActive || stage === stages.PREFLOP;
		checkButton.innerHTML = 'Check';
		tableRowCell.appendChild(checkButton);

		// Create the call button
		var callButton = document.createElement('button');
		callButton.classList.add('button');
		callButton.disabled = !isActive;
		callButton.innerHTML = 'Call';
		tableRowCell.appendChild(callButton);

		// Create the raise button
		var raiseButton = document.createElement('button');
		raiseButton.classList.add('button');
		raiseButton.disabled = !isActive || raises === maximumRaises;
		raiseButton.innerHTML = 'Raise';
		tableRowCell.appendChild(raiseButton);

		tableRow.appendChild(tableRowCell);

		$playerList.appendChild(tableRow);
	}
}

function fold(e) {
	var target = e.target;
	const player = target.parentElement.parentElement;

	const active = player.dataset.active;
	const position = player.dataset.position;

	if (!active) {
		return;
	}

	player.dataset.folded = true;

	nextPlayer();
}

function nextPlayer() {

}

function clear() {
	$cards.forEach($card => {
		delete $card.dataset.cardSelected;
	});

	$tableItems.forEach($tableItem => {
		$tableItem.innerHTML = '';
	});

	$playerList.innerHTML = '';
}

function calculate() {
	// Variables
	var playersCombinedCards = [];
	var playersHands = [];
	var playersMaximumScore;
	var opponentsCard1;
	var opponentsCard2;
	var opponentsCombinedCards = [];
	var opponentsHands = [];
	var opponentsMaximumScore;
	var result;

	// Calculating the players best hand.
	playersCombinedCards = [...communityCardsTemp, ...holeCards];
	playersCombinedCards.sort(compareCards);

	playersHands = generatePokerHands(playersCombinedCards);

	playersMaximumScore = getMaximumScore(playersHands);

	// Opponents can can have a possible "45 choose 2" cards, meaning we have to loop over 990 possibilities.
	for (var opponentsCard1Index = 0; opponentsCard1Index < possibleOpponentsCards.length - 1; opponentsCard1Index++) {
		opponentsCard1 = possibleOpponentsCards[opponentsCard1Index];

		for (var opponentsCard2Index = opponentsCard1Index + 1; opponentsCard2Index < possibleOpponentsCards.length; opponentsCard2Index++) {
			opponentsCard2 = possibleOpponentsCards[opponentsCard2Index];

			opponentsCombinedCards = [...communityCardsTemp, opponentsCard1, opponentsCard2];
			opponentsCombinedCards.sort(compareCards);

			opponentsHands = generatePokerHands(opponentsCombinedCards);

			opponentsMaximumScore = getMaximumScore(opponentsHands);

			// Comparing the Opponents best hand against the players best hand.
			result = compareScore(playersMaximumScore, opponentsMaximumScore);
			switch (result) {
				case results.HAND_1_WIN:
					wins++;
					break;
				case results.DRAW:
					draws++;
					break;
				case results.HAND_2_WIN:
					losses++;
					break;
			}

		}
	}
}

function getMaximumScore(hands) {
	// Variables
	var hand = [];
	var score;
	var maximumScore;

	for (hand of hands) {
		score = getScore(hand);

		if (compareScore(score, maximumScore) === results.HAND_1_WIN) {
			maximumScore = score;
		}
	}

	return maximumScore;
}

function compareCards(a, b) {
	return 10 * (ranks[a.rank] - ranks[b.rank]) + (suits[a.suit] - suits[b.suit]);
}

/*
	Accepts 7 cards, and returns an array of all 5 card combinations of those 7 cards.
*/
function generatePokerHands(cards) {
	var pokerHands = [];
	var card1;
	var card2;
	var card3;
	var card4;
	var card5;

	for (var index1 = 0; index1 < cards.length - 4; index1++) {
		card1 = cards[index1];
		for (var index2 = index1 + 1; index2 < cards.length - 3; index2++) {
			card2 = cards[index2];
			for (var index3 = index2 + 1; index3 < cards.length - 2; index3++) {
				card3 = cards[index3];
				for (var index4 = index3 + 1; index4 < cards.length - 1; index4++) {
					card4 = cards[index4];
					for (var index5 = index4 + 1; index5 < cards.length; index5++) {
						card5 = cards[index5];

						pokerHands.push([card1, card2, card3, card4, card5]);
					}
				}
			}
		}
	}

	return pokerHands;
}

// TODO Reduce number of operations in this function
function getScore(cards) {
	if (cards.length != 5) {
		return;
	}

	// Needed to check for Ace low straights.
	var cardsAcesLow = [...cards];
	while (ranks[cardsAcesLow[4].rank] === ranks.ACE) {
		cardsAcesLow.unshift(cardsAcesLow.pop());
	}

	// Royal Flush
	if (
		ranks[cards[0].rank] === ranks.TEN &&
		ranks[cards[1].rank] === ranks.JACK &&
		ranks[cards[2].rank] === ranks.QUEEN &&
		ranks[cards[3].rank] === ranks.KING &&
		ranks[cards[4].rank] === ranks.ACE &&
		cards[0].suit === cards[1].suit &&
		cards[0].suit === cards[2].suit &&
		cards[0].suit === cards[3].suit &&
		cards[0].suit === cards[4].suit
	) {
		return new Score(handValues.ROYAL_FLUSH, ranks[cards[4].rank]);
	}

	// Straight Flush
	if (
		Number(ranks[cards[0].rank]) + 1 === Number(ranks[cards[1].rank]) &&
		Number(ranks[cards[1].rank]) + 1 === Number(ranks[cards[2].rank]) &&
		Number(ranks[cards[2].rank]) + 1 === Number(ranks[cards[3].rank]) &&
		Number(ranks[cards[3].rank]) + 1 === Number(ranks[cards[4].rank]) &&
		cards[0].suit === cards[1].suit &&
		cards[0].suit === cards[2].suit &&
		cards[0].suit === cards[3].suit &&
		cards[0].suit === cards[4].suit
	) {
		return new Score(handValues.STRAIGHT_FLUSH, ranks[cards[4].rank]);
	}

	if (
		ranks[cardsAcesLow[0].rank] === ranks.ACE &&
		ranks[cardsAcesLow[1].rank] === ranks.TWO &&
		ranks[cardsAcesLow[2].rank] === ranks.THREE &&
		ranks[cardsAcesLow[3].rank] === ranks.FOUR &&
		ranks[cardsAcesLow[4].rank] === ranks.FIVE &&
		cardsAcesLow[0].suit === cardsAcesLow[1].suit &&
		cardsAcesLow[0].suit === cardsAcesLow[2].suit &&
		cardsAcesLow[0].suit === cardsAcesLow[3].suit &&
		cardsAcesLow[0].suit === cardsAcesLow[4].suit
	) {
		return new Score(handValues.STRAIGHT_FLUSH, ranks[cardsAcesLow[4].rank]);
	}

	// Four of a Kind
	if (
		cards[0].rank === cards[1].rank &&
		cards[0].rank === cards[2].rank &&
		cards[0].rank === cards[3].rank
	) {
		return new Score(handValues.FOUR_OF_A_KIND, ranks[cards[3].rank], ranks[cards[4].rank]);
	}

	if (
		cards[1].rank === cards[2].rank &&
		cards[1].rank === cards[3].rank &&
		cards[1].rank === cards[4].rank
	) {
		return new Score(handValues.FOUR_OF_A_KIND, ranks[cards[4].rank], ranks[cards[0].rank]);
	}

	// Full House
	if (
		cards[0].rank === cards[1].rank &&
		cards[0].rank === cards[2].rank &&
		cards[3].rank === cards[4].rank
	) {
		return new Score(handValues.FULL_HOUSE, ranks[cards[2].rank], ranks[cards[4].rank]);
	}

	if (
		cards[0].rank === cards[1].rank &&
		cards[2].rank === cards[3].rank &&
		cards[2].rank === cards[4].rank
	) {
		return new Score(handValues.FULL_HOUSE, ranks[cards[4].rank], ranks[cards[1].rank]);
	}

	// Flush
	if (
		cards[0].suit === cards[1].suit &&
		cards[0].suit === cards[2].suit &&
		cards[0].suit === cards[3].suit &&
		cards[0].suit === cards[4].suit
	) {
		return new Score(handValues.FLUSH, ranks[cards[4].rank], ranks[cards[3].rank], ranks[cards[2].rank], ranks[cards[1].rank], ranks[cards[0].rank]);
	}

	// Straight
	if (
		Number(ranks[cards[0].rank]) + 1 === Number(ranks[cards[1].rank]) &&
		Number(ranks[cards[1].rank]) + 1 === Number(ranks[cards[2].rank]) &&
		Number(ranks[cards[2].rank]) + 1 === Number(ranks[cards[3].rank]) &&
		Number(ranks[cards[3].rank]) + 1 === Number(ranks[cards[4].rank])
	) {
		return new Score(handValues.STRAIGHT, ranks[cards[4].rank]);
	}

	if (
		ranks[cardsAcesLow[0].rank] === ranks.ACE &&
		ranks[cardsAcesLow[1].rank] === ranks.TWO &&
		ranks[cardsAcesLow[2].rank] === ranks.THREE &&
		ranks[cardsAcesLow[3].rank] === ranks.FOUR &&
		ranks[cardsAcesLow[4].rank] === ranks.FIVE
	) {
		return new Score(handValues.STRAIGHT, ranks[cardsAcesLow[4].rank]);
	}

	// Three of a Kind
	if (
		cards[0].rank === cards[1].rank &&
		cards[0].rank === cards[2].rank
	) {
		return new Score(handValues.THREE_OF_A_KIND, ranks[cards[2].rank], ranks[cards[4].rank], ranks[cards[3].rank]);
	}

	if (
		cards[1].rank === cards[2].rank &&
		cards[1].rank === cards[3].rank
	) {
		primaryCards = [
			cards[1],
			cards[2],
			cards[3]
		];

		return new Score(handValues.THREE_OF_A_KIND, ranks[cards[3].rank], ranks[cards[4].rank], ranks[cards[0].rank]);
	}

	if (
		cards[2].rank === cards[3].rank &&
		cards[2].rank === cards[4].rank
	) {
		primaryCards = [
			cards[2],
			cards[3],
			cards[4]
		];

		return new Score(handValues.THREE_OF_A_KIND, ranks[cards[4].rank], ranks[cards[1].rank], ranks[cards[0].rank]);
	}

	// Two Pairs
	if (
		cards[0].rank === cards[1].rank &&
		cards[2].rank === cards[3].rank
	) {
		return new Score(handValues.TWO_PAIRS, ranks[cards[3].rank], ranks[cards[1].rank], ranks[cards[4].rank]);
	}

	if (
		cards[0].rank === cards[1].rank &&
		cards[3].rank === cards[4].rank
	) {
		return new Score(handValues.TWO_PAIRS, ranks[cards[4].rank], ranks[cards[1].rank], ranks[cards[2].rank]);
	}

	if (
		cards[1].rank === cards[2].rank &&
		cards[3].rank === cards[4].rank
	) {
		return new Score(handValues.TWO_PAIRS, ranks[cards[4].rank], ranks[cards[2].rank], ranks[cards[0].rank]);
	}

	// Pair
	if (
		cards[0].rank === cards[1].rank
	) {
		return new Score(handValues.PAIR, ranks[cards[1].rank], ranks[cards[4].rank], ranks[cards[3].rank], ranks[cards[2].rank]);
	}

	if (
		cards[1].rank === cards[2].rank
	) {
		return new Score(handValues.PAIR, ranks[cards[2].rank], ranks[cards[4].rank], ranks[cards[3].rank], ranks[cards[0].rank]);
	}

	if (
		cards[2].rank === cards[3].rank
	) {
		return new Score(handValues.PAIR, ranks[cards[3].rank], ranks[cards[4].rank], ranks[cards[1].rank], ranks[cards[0].rank]);
	}

	if (
		cards[3].rank === cards[4].rank
	) {
		return new Score(handValues.PAIR, ranks[cards[4].rank], ranks[cards[2].rank], ranks[cards[1].rank], ranks[cards[0].rank]);
	}

	// Highcard
	return new Score(handValues.HIGHCARD, ranks[cards[4].rank], ranks[cards[3].rank], ranks[cards[2].rank], ranks[cards[1].rank], ranks[cards[0].rank]);
}

function compareScore(score1, score2) {
	if (score1 !== undefined && score2 === undefined) {
		return results.HAND_1_WIN;
	}

	if (score1 === undefined && score2 !== undefined) {
		return results.HAND_2_WIN;
	}

	if (score1 === score2) {
		//throw 'Draw';
		return results.DRAW;
	}

	if (score1.value > score2.value) {
		return results.HAND_1_WIN;
	}
	else if (score1.value < score2.value) {
		return results.HAND_2_WIN;
	}
	else {
		if (score1.primaryCard === undefined || score2.primaryCard === undefined) {
			//throw 'Draw';
			return results.DRAW;
		}

		// Compare ranks of primary cards
		if (score1.primaryCard > score2.primaryCard) {
			return results.HAND_1_WIN;
		}
		else if (score1.primaryCard < score2.primaryCard) {
			return results.HAND_2_WIN;
		}
		else {
			if (score1.secondaryCard === undefined || score2.secondaryCard === undefined) {
				//throw 'Draw';
				return results.DRAW;
			}

			// Compare ranks of secondary cards
			if  (score1.secondaryCard > score2.secondaryCard) {
				return results.HAND_1_WIN;
			}
			else if (score1.secondaryCard < score2.secondaryCard) {
				return results.HAND_2_WIN;
			}
			else {
				if (score1.tertiaryCard === undefined || score2.tertiaryCard === undefined) {
					//throw 'Draw';
					return results.DRAW;
				}
	
				// Compare ranks of teriary cards
				if  (score1.tertiaryCard > score2.tertiaryCard) {
					return results.HAND_1_WIN;
				}
				else if (score1.tertiaryCard < score2.tertiaryCard) {
					return results.HAND_2_WIN;
				}
				else {
					if (score1.quaternaryCard === undefined || score2.quaternaryCard === undefined) {
						//throw 'Draw';
						return results.DRAW;
					}
		
					// Compare ranks of quaternary cards
					if  (score1.quaternaryCard > score2.quaternaryCard) {
						return results.HAND_1_WIN;
					}
					else if (score1.quaternaryCard < score2.quaternaryCard) {
						return results.HAND_2_WIN;
					}
					else {
						if (score1.quinaryCard === undefined || score2.quinaryCard === undefined) {
							//throw 'Draw';
							return results.DRAW;
						}
			
						// Compare ranks of quinary cards
						if  (score1.quinaryCard > score2.quinaryCard) {
							return results.HAND_1_WIN;
						}
						else if (score1.quinaryCard < score2.quinaryCard) {
							return results.HAND_2_WIN;
						}
						else {
							//throw 'Draw';
							return results.DRAW;
						}
					}
				}
			}
		}
	}

	//throw 'Draw';
	return results.DRAW;
}



// https://developers.google.com/web/ilt/pwa/lab-offline-quickstart#52_activating_the_install_prompt
window.addEventListener('beforeinstallprompt', (event) => {

	// Prevent Chrome 67 and earlier from automatically showing the prompt
	event.preventDefault();

	// Stash the event so it can be triggered later.
	deferredPrompt = event;

	// Attach the install prompt to a user gesture
	document.getElementById('installButtonTrigger').addEventListener('click', (event) => {

		// Show the prompt
		deferredPrompt.prompt();

		// Wait for the user to respond to the prompt
		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				console.log('User accepted the A2HS prompt');
			}
			else {
				console.log('User dismissed the A2HS prompt');
			}
			deferredPrompt = null;
		});
	});

	document.getElementById('installButtonTrigger').setAttribute('aria-hidden', false);
});

// When the app is installed it should remove the install snackbar
window.addEventListener('appinstalled', (event) => {
	console.log('a2hs installed');
	document.getElementById('installButtonTrigger').setAttribute('aria-hidden', true);
});
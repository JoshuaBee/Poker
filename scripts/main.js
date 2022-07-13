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
	RIVER: 4,
	SHOWDOWN: 5
};
Object.freeze(stages);

const positions = {
	EARLY: 1,
	MIDDLE: 2,
	LATE: 3
};
Object.freeze(positions);

const actions = {
	FOLD: 1,
	CHECK: 2,
	CALL: 3,
	RAISE: 4
};
Object.freeze(actions);



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
		for (var i = 0; i < this.cards.length; i++) {
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
		this.secondaryCard = secondaryCard;
		this.tertiaryCard = tertiaryCard;
		this.quaternaryCard = quaternaryCard;
		this.quinaryCard = quinaryCard;
	}
}

class Player {
	constructor() {
		this.action = null;
		this.position = 0;
		this.positionName = '';
		this.positionGroup = null;
		this.active = false;
		this.player = false;
		this.stageBet = 0;
		this.totalBet = 0;
		this.showdown = false;
		this.winner = false;
	}

	getAction() {
		return this.action;
	}

	setAction(action) {
		this.action = action;
	}

	getPosition() {
		return this.position;
	}

	setPosition(position) {
		this.position = position;
	}

	getPositionName() {
		return this.positionName;
	}

	setPositionName(positionName) {
		this.positionName = positionName;
	}

	getPositionGroup() {
		return this.positionGroup;
	}

	setPositionGroup(positionGroup) {
		this.positionGroup = positionGroup;
	}

	isActive() {
		return this.active;
	}

	setActive(active) {
		this.active = active;
	}

	isPlayer() {
		return this.player;
	}

	setPlayer(player) {
		this.player = player;
	}

	addBet(bet) {
		this.stageBet += bet;
		this.totalBet += bet;
	}

	clearStageBet() {
		this.stageBet = 0;
	}

	getStageBet() {
		return this.stageBet;
	}

	getTotalBet() {
		return this.totalBet;
	}

	matchBet(bet) {
		var incrementalBet = bet - this.stageBet
		this.stageBet += incrementalBet;
		this.totalBet += incrementalBet;
	}

	isShowdown() {
		return this.showdown;
	}

	setShowdown(showdown) {
		this.showdown = showdown;
	}

	isWinner() {
		return this.winner;
	}

	setWinner(winner) {
		this.winner = winner;
	}
}



// Constants

const deck = new Deck();
const debug = true;



// Variables
var deferredPrompt;
var communityCards = [];
var communityCardsTemp = [];
var possibleOpponentsCards = [];
var holeCards = [];
var totalWins = 0;
var totalDraws = 0;
var totalLosses = 0;
var opponents = 1;
var stage;
var opponents;
var players = [];
var playerPosition;
var blinds;
var stageBet = 0;
var stageBets = false;
var maximumRaises;
var startTime;

// TODO: Remove
var getScoreTimer = 0;



// Elements
const $cards = document.querySelectorAll('.card');

// Settings

// Constants
const $opponents = document.querySelector('#opponents');
const $position = document.querySelector('#position');
const $blinds = document.querySelector('#blinds');
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



document.addEventListener('DOMContentLoaded', function (event) {
	bindEvents();
});



function bindEvents() {
	$cards.forEach($card => {
		$card.addEventListener('click', () => {
			var selected = $card.dataset.cardSelected;

			if (selected === 'player') {
				delete $card.dataset.cardSelected;
			}
			else {
				$card.dataset.cardSelected = 'player';
			}
		});

		/* Right Click Event */
		$card.addEventListener('contextmenu', (event) => {
			event.preventDefault();
			var selected = $card.dataset.cardSelected;

			if (selected === 'community') {
				delete $card.dataset.cardSelected;
			}
			else {
				$card.dataset.cardSelected = 'community';
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
	blinds = Number($blinds.value);
	stageBet = 2 * blinds;
	stageBets = true;
	maximumRaises = Number($maximumRaises.value);

	createPlayers();
	createPlayersTable();
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
	startTime = performance.now();
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
	holeCards.sort(compareCards);
	if (debug) {
		console.log('Hole Cards', holeCards);
	}

	// Get Community Cards from Deck
	$communityCards.forEach($communityCard => {
		communityCards.push(...deck.take($communityCard.dataset.cardRank, $communityCard.dataset.cardSuit));
	});
	if (debug) {
		console.log('Community Cards', communityCards);
	}

	// Flop
	// TODO: Make sure I do not want to include burnt cards
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

	totalWins = 0;
	totalDraws = 0;
	totalLosses = 0;
	possibleCommunityCards = [...deck.cards];

	// Need to run different functions depending on how many community cards have been drawn.
	switch (stage) {
		// If no community cards have been drawn, then we need to draw 5 more.
		case stages.PREFLOP:
			var score = calculateChenScore();
			var positionGroup = getPositionGroup(playerPosition, opponents);

			switch (positionGroup) {
				case positions.EARLY:
					if (score >= 6.5) {
						// Play
						// TODO: Play is either Check or Call.
						var button = document.querySelector('[data-player="true"] [data-action="call"]');
						button.style.backgroundColor = 'green';
					}
					else {
						// Fold
						var button = document.querySelector('[data-player="true"] [data-action="fold"]');
						button.style.backgroundColor = 'green';
					}
					break;
				case positions.MIDDLE:
					if (score >= 6) {
						// Play
						// TODO: Play is either Check or Call.
						var button = document.querySelector('[data-player="true"] [data-action="call"]');
						button.style.backgroundColor = 'green';
					}
					else {
						// Fold
						var button = document.querySelector('[data-player="true"] [data-action="fold"]');
						button.style.backgroundColor = 'green';
					}
					break;
				case positions.LATE:
					if (score >= 5.5) {
						// Play
						// TODO: Play is either Check or Call.
						var button = document.querySelector('[data-player="true"] [data-action="call"]');
						button.style.backgroundColor = 'green';
					}
					else {
						// Fold
						var button = document.querySelector('[data-player="true"] [data-action="fold"]');
						button.style.backgroundColor = 'green';
					}
					break;
			}

			postCalculate();
			break;
		// If 3 community cards have been drawn, then we need to draw 2 more.
		case stages.FLOP:
			console.log('possibleCommunityCards.length', possibleCommunityCards.length);
			for (var communityCard4Index = 0; communityCard4Index < possibleCommunityCards.length - 1; communityCard4Index++) {
				const worker = new Worker("./scripts/worker.js");
				activeWorkerCount++;

				worker.postMessage({
					possibleCommunityCards,
					communityCard4Index,
					deck,
					communityCards,
					holeCards
				});

				worker.onmessage = (e) => {
					const { wins, draws, losses } = e.data;
					finishedWorkerCount++;
					totalWins += wins;
					totalDraws += draws;
					totalLosses += losses;

					if (finishedWorkerCount === activeWorkerCount) {
						postCalculate();
					}
				}
				/*
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
					postCalculate();
				} */
			}
			break;
		// If 4 community cards have been drawn, then we need to draw 1 more.
		case stages.TURN:
			for (var communityCard5Index = 0; communityCard5Index < possibleCommunityCards.length; communityCard5Index++) {
				// 
				communityCard5 = possibleCommunityCards[communityCard5Index];

				// Remove the community cards from the possible opponents cards.
				possibleOpponentsCards = [...deck.cards];
				possibleOpponentsCards.splice(communityCard5Index, 1);

				communityCardsTemp = [...communityCards, communityCard5];

				calculate();
				postCalculate();
			}
			break;
		// If all 5 community cards have been drawn, then we have all the cards we need.
		case stages.RIVER:
			// Remove the community cards from the possible opponents cards.
			possibleOpponentsCards = [...deck.cards];

			communityCardsTemp = [...communityCards];

			calculate();
			postCalculate();
			break;
		default:
			document.querySelector('#message').innerHTML = 'Uh oh';
			break;
	}
}

function postCalculate() {
	total = totalWins + totalDraws + totalLosses;
	no_lose_decimal = (totalWins + totalDraws) / total;
	no_lose_decimal_all = Math.pow((totalWins + totalDraws) / total, opponents);

	if (debug) {
		console.log('Wins:', totalWins);
		console.log('Draws:', totalDraws);
		console.log('Losses:', totalLosses);
		console.log('Total:', total);
		console.log('Not Lose Percentage - 1 Opponent', `${(100 * no_lose_decimal).toFixed(2)}%`);
		console.log('Not Lose Percentage - All Opponents', `${(100 * no_lose_decimal_all).toFixed(2)}%`);
		console.log('Time:', `${performance.now() - startTime}ms`);
	}

	var activeOpponents = players.filter(player => player.getAction() !== actions.FOLD && !player.isPlayer());

	// Update table
	switch (stage) {
		case stages.PREFLOP:
			$tablePreFlopWins.innerHTML = score;
			$tablePreFlopTime.innerHTML = `${performance.now() - startTime}ms`;
			break;
		case stages.FLOP:
			$tableFlopWins.innerHTML = `${totalWins} (${(100 * totalWins / total).toFixed(0)}%)`;
			$tableFlopDraws.innerHTML = `${totalDraws} (${(100 * totalDraws / total).toFixed(0)}%)`;
			$tableFlopLosses.innerHTML = `${totalLosses} (${(100 * totalLosses / total).toFixed(0)}%)`;
			$tableFlopNotLosePercentage.innerHTML = `${(100 * Math.pow((totalWins + totalDraws) / total, activeOpponents.length)).toFixed(2)}%`;
			$tableFlopTime.innerHTML = `${performance.now() - startTime}ms`;
			break;
		case stages.TURN:
			$tableTurnWins.innerHTML = `${totalWins} (${(100 * totalWins / total).toFixed(0)}%)`;
			$tableTurnDraws.innerHTML = `${totalDraws} (${(100 * totalDraws / total).toFixed(0)}%)`;
			$tableTurnLosses.innerHTML = `${totalLosses} (${(100 * totalLosses / total).toFixed(0)}%)`;
			$tableTurnNotLosePercentage.innerHTML = `${(100 * Math.pow((wins + totalDraws) / total, activeOpponents.length)).toFixed(2)}%`;
			$tableTurnTime.innerHTML = `${performance.now() - startTime}ms`;
			break;
		case stages.RIVER:
			$tableRiverWins.innerHTML = `${totalWins} (${(100 * totalWins / total).toFixed(0)}%)`;
			$tableRiverDraws.innerHTML = `${totalDraws} (${(100 * totalDraws / total).toFixed(0)}%)`;
			$tableRiverLosses.innerHTML = `${totalLosses} (${(100 * totalLosses / total).toFixed(0)}%)`;
			$tableRiverNotLosePercentage.innerHTML = `${(100 * Math.pow((totalWins + totalDraws) / total, activeOpponents.length)).toFixed(2)}%`;
			$tableRiverTime.innerHTML = `${performance.now() - startTime}ms`;
			break;
	}

	scrollTo(document.querySelector('#players-section'));

	console.log('getScoreTimer', getScoreTimer);

	// TODO: Remove
	nextStage();
}

function getPositionName(position, opponents) {
	switch (position) {
		case 1:
			return 'Small Blind';
		case 2:
			return 'Big Blind';
		case 3:
			return 'Under the Gun';
		case opponents - 1:
			return 'Cut-Off';
		case opponents:
			return 'Button';
	}

	return '';
}

function getPositionGroup(position, opponents) {
	if (position <= Math.floor(opponents / 3)) {
		return positions.EARLY;
	}

	if (position > Math.ceil(2 * opponents / 3)) {
		return positions.LATE;
	}

	return positions.MIDDLE;
}

function createPlayers() {
	players = [];

	for (var position = 1; position <= opponents; position++) {
		var player = new Player();
		player.setPosition(position);

		player.setPositionName(getPositionName(position, opponents));
		player.setPositionGroup(getPositionGroup(position, opponents));

		player.setPlayer(position === playerPosition);
		player.setActive(position === 3);

		if (position === 1) {
			player.addBet(blinds);
		}
		else if (position === 2) {
			player.addBet(2 * blinds);
		}

		players.push(player);
	}
}

function createPlayersTable() {
	players.forEach(player => {
		// Create the row
		var tableRow = document.createElement('tr');
		tableRow.dataset.active = player.isActive();
		tableRow.dataset.player = player.isPlayer();
		tableRow.dataset.position = player.getPosition();
		tableRow.dataset.positionGroup = player.getPositionGroup();
		if (player.getAction() === actions.FOLD) {
			tableRow.dataset.folded = true;
		}

		// Create the row header
		var tableRowHeading = document.createElement('th');
		tableRowHeading.innerHTML = `${ player.getPosition() } ${ player.getPositionName() }`;
		tableRowHeading.scope = 'row';
		tableRow.appendChild(tableRowHeading);

		// Create the Stage Bet cell
		var stageBetCell = document.createElement('td');
		stageBetCell.classList.add('table-item');
		stageBetCell.dataset.stageBet = player.getStageBet();
		stageBetCell.innerHTML = player.getStageBet();
		tableRow.appendChild(stageBetCell);

		// Create the Total Bet cell
		var totalBetCell = document.createElement('td');
		totalBetCell.classList.add('table-item');
		totalBetCell.dataset.totalBet = player.getTotalBet();
		totalBetCell.innerHTML = player.getTotalBet();
		tableRow.appendChild(totalBetCell);

		// Create the actions cell
		var tableRowCell = document.createElement('td');
		tableRowCell.classList.add('table-item');

		// Create the fold button
		var foldButton = document.createElement('button');
		foldButton.classList.add('button');
		foldButton.dataset.action = 'fold';
		foldButton.disabled = !player.isActive();
		foldButton.innerHTML = 'Fold';
		foldButton.addEventListener('click', () => {
			fold(player);
		});
		tableRowCell.appendChild(foldButton);

		// Create the check button
		var checkButton = document.createElement('button');
		checkButton.classList.add('button');
		checkButton.dataset.action = 'check';
		checkButton.disabled = !player.isActive() || stage === stages.PREFLOP;
		checkButton.innerHTML = 'Check';
		checkButton.addEventListener('click', () => {
			check(player);
		});
		tableRowCell.appendChild(checkButton);

		// Create the call button
		var callButton = document.createElement('button');
		callButton.classList.add('button');
		callButton.dataset.action = 'call';
		callButton.disabled = !player.isActive();
		callButton.innerHTML = 'Call';
		callButton.addEventListener('click', () => {
			call(player);
		});
		tableRowCell.appendChild(callButton);

		// Create the raise button
		var raiseButton = document.createElement('button');
		raiseButton.classList.add('button');
		raiseButton.dataset.action = 'raise';
		raiseButton.disabled = !player.isActive() || raises === maximumRaises;
		raiseButton.innerHTML = 'Raise';
		raiseButton.addEventListener('click', () => {
			raise(player);
		});
		tableRowCell.appendChild(raiseButton);

		// Create the winner button
		var winnerButton = document.createElement('button');
		winnerButton.classList.add('button');
		winnerButton.dataset.action = 'winner';
		winnerButton.disabled = !player.isShowdown();
		winnerButton.innerHTML = 'Winner';
		winnerButton.addEventListener('click', () => {
			winner(player);
		});
		tableRowCell.appendChild(winnerButton);

		tableRow.appendChild(tableRowCell);

		$playerList.appendChild(tableRow);
	});
}

function updatePlayersTable(player) {
	var tableRow = document.querySelector(`[data-position="${ player.getPosition() }"]`);
	tableRow.dataset.active = player.isActive();
	tableRow.dataset.player = player.isPlayer();
	if (player.getAction() === actions.FOLD) {
		tableRow.dataset.folded = true;
	}
	if (player.isWinner()) {
		tableRow.dataset.winner = true;
	}
	
	var stageBetCell = tableRow.querySelector('[data-stage-bet]');
	stageBetCell.dataset.bet = player.getStageBet();
	stageBetCell.innerHTML = player.getStageBet();
	
	var totalBetCell = tableRow.querySelector('[data-total-bet]');
	totalBetCell.dataset.bet = player.getTotalBet();
	totalBetCell.innerHTML = player.getTotalBet();

	var foldButton = tableRow.querySelector('[data-action="fold"]');
	foldButton.disabled = !player.isActive() || (player.getAction() === actions.FOLD) || player.isShowdown();

	var checkButton = tableRow.querySelector('[data-action="check"]');
	checkButton.disabled = !player.isActive() || (player.getAction() === actions.FOLD) || player.isShowdown() || (player.getStageBet() !== stageBet && stageBets);

	var callButton = tableRow.querySelector('[data-action="call"]');
	callButton.disabled = !player.isActive() || (player.getAction() === actions.FOLD) || player.isShowdown() || player.getStageBet() === stageBet;

	var raiseButton = tableRow.querySelector('[data-action="raise"]');
	raiseButton.disabled = !player.isActive() || (player.getAction() === actions.FOLD) || player.isShowdown() || raises === maximumRaises;

	var winnerButton = tableRow.querySelector('[data-action="winner"]');
	winnerButton.disabled = !player.isShowdown();
}

function fold(player) {
	if (!player.isActive()) {
		return;
	}

	player.setActive(false);
	player.setAction(actions.FOLD);
	updatePlayersTable(player);

	nextPlayer(player);
}

function check(player) {
	if (!player.isActive()) {
		return;
	}

	player.setActive(false);
	player.setAction(actions.CHECK);
	updatePlayersTable(player);

	nextPlayer(player);
}

function call(player) {
	if (!player.isActive()) {
		return;
	}

	player.setActive(false);
	player.setAction(actions.CALL);
	player.matchBet(stageBet);
	updatePlayersTable(player);

	stageBets = true;

	nextPlayer(player);
}

function raise(player) {
	if (!player.isActive()) {
		return;
	}

	raises++;
	stageBet += blinds;
	player.setActive(false);
	player.setAction(actions.RAISE);
	player.matchBet(stageBet);
	updatePlayersTable(player);

	stageBets = true;

	nextPlayer(player);
}

function winner(player) {
	player.setWinner(true);
	updatePlayersTable(player);
}

function nextPlayer(currentPlayer) {
	var availablePlayers = players.filter(player => player.getAction() !== actions.FOLD);
	if (availablePlayers.length == 1) {
		winner(availablePlayers[0]);
		return;
	}

	// Check if the stage has finished.
	var playersLeft = availablePlayers.filter(player => player.getAction() === null || player.getStageBet() < stageBet);
	if (playersLeft.length === 0) {
		nextStage();
		return;
	}

	var playersChecked = availablePlayers.filter(player => player.getAction() === actions.CHECK);
	if (playersChecked.length === availablePlayers.length) {
		nextStage();
		return;
	}

	var nextPlayer;

	// Players AFTER current active player.
	var nextPlayers = availablePlayers.filter(player => player.position > currentPlayer.position);
	if (nextPlayers.length > 0) {
		nextPlayer = nextPlayers[0];
	}
	else {
		nextPlayer = availablePlayers[0];
	}

	nextPlayer.setActive(true);
	updatePlayersTable(nextPlayer);
}

function nextStage() {
	stage = stage + 1;
	if (stage == stages.SHOWDOWN) {
		showdown();
	}

	stageBet = 2 * blinds;
	stageBets = false;

	var availablePlayers = players.filter(player => player.getAction() !== actions.FOLD);
	var startingPlayer = availablePlayers[0];

	availablePlayers.forEach(player => {
		player.setAction(null);
		player.setActive(player === startingPlayer);
		player.clearStageBet();

		updatePlayersTable(player);
	});

	scrollTo(document.querySelector('#cards-section'));
}

function showdown() {
	var availablePlayers = players.filter(player => player.getAction() !== actions.FOLD);
	availablePlayers.forEach(player => {
		player.setShowdown(true);

		updatePlayersTable(player);
	});
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

	// TODO: Remove
	getScoreTimer = 0;

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
					totalWins++;
					break;
				case results.DRAW:
					totalDraws++;
					break;
				case results.HAND_2_WIN:
					totalLosses++;
					break;
			}
		}
	}
}

// https://en.wikipedia.org/wiki/Texas_hold_%27em_starting_hands#Chen_formula
function calculateChenScore() {
	var score = 0;

	// Based on the highest card, assign points as follows:
	// Ace = 10 points, K = 8 points, Q = 7 points, J = 6 points.
	// 10 through 2, half of face value (10 = 5 points, 9 = 4.5 points, etc.)
	switch (ranks[holeCards[1].rank]) {
		case ranks.ACE:
			score = 10;
			break;
		case ranks.KING:
			score = 8;
			break;
		case ranks.QUEEN:
			score = 7;
			break;
		case ranks.JACK:
			score = 6;
			break;
		default:
			score = (Number(ranks[holeCards[1].rank]) + 1) / 2;
	}

	// For pairs...
	if (holeCards[0].rank === holeCards[1].rank) {
		//  Multiply the points by 2 (AA=20, KK=16, etc.), with a minimum of 5 points for any pair.
		score = Math.max(2 * score, 5);

		// 55 is given an extra point.
		if (ranks[holeCards[1].rank] === ranks.FIVE) {
			score += 1;
		}
	}

	// Add 2 points for suited cards.
	if (holeCards[0].suit === holeCards[1].suit) {
		score += 2;
	}

	var gap = Number(ranks[holeCards[1].rank]) - Number(ranks[holeCards[0].rank]);
	switch (gap) {
		case 2:
			// Subtract 1 point for 1 gappers (AQ, J9).
			score -= 1;
			break;
		case 3:
			// 2 points for 2 gappers (J8, AJ).
			score -= 2;
			break;
		case 4:
			// 4 points for 3 gappers (J7, 73).
			score -= 4;
			break;
	}

	// 5 points for larger gappers, including A2 A3 A4.
	if (gap >= 5) {
		score -= 5;
	}

	//Add an extra point if connected or 1-gap and your highest card is lower than Q
	if ((gap === 1 || gap === 2) && ranks[holeCards[1].rank] < ranks.QUEEN) {
		score += 1;
	}

	return score;
}

function getMaximumScore(hands) {
	// Variables
	var hand = [];
	var score;
	var maximumScore;

	for (hand of hands) {
		const start = performance.now();
		score = getScore(hand);
		getScoreTimer += performance.now() - start;

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

// TODO: Reduce number of operations in this function
function getScore(cards) {
    const card0Rank = ranks[cards[0].rank];
    const card1Rank = ranks[cards[1].rank];
    const card2Rank = ranks[cards[2].rank];
    const card3Rank = ranks[cards[3].rank];
    const card4Rank = ranks[cards[4].rank];

    const card0Suit = suits[cards[0].suit];
    const card1Suit = suits[cards[1].suit];
    const card2Suit = suits[cards[2].suit];
    const card3Suit = suits[cards[3].suit];
    const card4Suit = suits[cards[4].suit];

	if (cards.length != 5) {
		return;
	}

	// Needed to check for Ace low straights.
	var cardsAcesLow = [...cards];
	var hasAce = ranks[cardsAcesLow[4].rank] === ranks.ACE;
	while (ranks[cardsAcesLow[4].rank] === ranks.ACE) {
		cardsAcesLow.unshift(cardsAcesLow.pop());
	}

	// Royal Flush
	if (
		card0Rank === ranks.TEN &&
		card1Rank === ranks.JACK &&
		card2Rank === ranks.QUEEN &&
		card3Rank === ranks.KING &&
		card4Rank === ranks.ACE &&
		card0Suit === card1Suit &&
		card0Suit === card2Suit &&
		card0Suit === card3Suit &&
		card0Suit === card4Suit
	) {
		return new Score(handValues.ROYAL_FLUSH, card4Rank);
	}

	// Straight Flush
	if (
		card0Rank + 1 === card1Rank &&
		card1Rank + 1 === card2Rank &&
		card2Rank + 1 === card3Rank &&
		card3Rank + 1 === card4Rank &&
		card0Suit === card1Suit &&
		card0Suit === card2Suit &&
		card0Suit === card3Suit &&
		card0Suit === card4Suit
	) {
		return new Score(handValues.STRAIGHT_FLUSH, card4Rank);
	}

	if (
		hasAce &&
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
		card0Rank === card1Rank &&
		card0Rank === card2Rank &&
		card0Rank === card3Rank
	) {
		return new Score(handValues.FOUR_OF_A_KIND, card3Rank, card4Rank);
	}

	if (
		card1Rank === card2Rank &&
		card1Rank === card3Rank &&
		card1Rank === card4Rank
	) {
		return new Score(handValues.FOUR_OF_A_KIND, card4Rank, card0Rank);
	}

	// Full House
	if (
		card0Rank === card1Rank &&
		card0Rank === card2Rank &&
		card3Rank === card4Rank
	) {
		return new Score(handValues.FULL_HOUSE, card2Rank, card4Rank);
	}

	if (
		card0Rank === card1Rank &&
		card2Rank === card3Rank &&
		card2Rank === card4Rank
	) {
		return new Score(handValues.FULL_HOUSE, card4Rank, card1Rank);
	}

	// Flush
	if (
		card0Suit === card1Suit &&
		card0Suit === card2Suit &&
		card0Suit === card3Suit &&
		card0Suit === card4Suit
	) {
		return new Score(handValues.FLUSH, card4Rank, card3Rank, card2Rank, card1Rank, card0Rank);
	}

	// Straight
	if (
		card0Rank + 1 === card1Rank &&
		card1Rank + 1 === card2Rank &&
		card2Rank + 1 === card3Rank &&
		card3Rank + 1 === card4Rank
	) {
		return new Score(handValues.STRAIGHT, card4Rank);
	}

	if (
		hasAce &&
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
		card0Rank === card1Rank &&
		card0Rank === card2Rank
	) {
		return new Score(handValues.THREE_OF_A_KIND, card2Rank, card4Rank, card3Rank);
	}

	if (
		card1Rank === card2Rank &&
		card1Rank === card3Rank
	) {
		return new Score(handValues.THREE_OF_A_KIND, card3Rank, card4Rank, card0Rank);
	}

	if (
		card2Rank === card3Rank &&
		card2Rank === card4Rank
	) {
		return new Score(handValues.THREE_OF_A_KIND, card4Rank, card1Rank, card0Rank);
	}

	// Two Pairs
	if (
		card0Rank === card1Rank &&
		card2Rank === card3Rank
	) {
		return new Score(handValues.TWO_PAIRS, card3Rank, card1Rank, card4Rank);
	}

	if (
		card0Rank === card1Rank &&
		card3Rank === card4Rank
	) {
		return new Score(handValues.TWO_PAIRS, card4Rank, card1Rank, card2Rank);
	}

	if (
		card1Rank === card2Rank &&
		card3Rank === card4Rank
	) {
		return new Score(handValues.TWO_PAIRS, card4Rank, card2Rank, card0Rank);
	}

	// Pair
	if (
		card0Rank === card1Rank
	) {
		return new Score(handValues.PAIR, card1Rank, card4Rank, card3Rank, card2Rank);
	}

	if (
		card1Rank === card2Rank
	) {
		return new Score(handValues.PAIR, card2Rank, card4Rank, card3Rank, card0Rank);
	}

	if (
		card2Rank === card3Rank
	) {
		return new Score(handValues.PAIR, card3Rank, card4Rank, card1Rank, card0Rank);
	}

	if (
		card3Rank === card4Rank
	) {
		return new Score(handValues.PAIR, card4Rank, card2Rank, card1Rank, card0Rank);
	}

	// Highcard
	return new Score(handValues.HIGHCARD, card4Rank, card3Rank, card2Rank, card1Rank, card0Rank);
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
			if (score1.secondaryCard > score2.secondaryCard) {
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
				if (score1.tertiaryCard > score2.tertiaryCard) {
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
					if (score1.quaternaryCard > score2.quaternaryCard) {
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
						if (score1.quinaryCard > score2.quinaryCard) {
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

function scrollTo(el) {
	el.scrollIntoView(
		{
			behavior: "smooth"
		}
	);
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
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
const debug = false;



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
var raises;
var maximumRaises;
var startTime;
var chenScore = 0;



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
	// bindEvents();
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
	startTime = performance.now();
	possibleCommunityCards = [];


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
			chenScore = calculateChenScore();
			var positionGroup = getPositionGroup(playerPosition, opponents);

			switch (positionGroup) {
				case positions.EARLY:
					if (chenScore >= 6.5) {
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
					if (chenScore >= 6) {
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
					if (chenScore >= 5.5) {
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
			var activeWorkerCount = 0;
			var finishedWorkerCount = 0;
			
			for (var communityCard4Index = 0; communityCard4Index < possibleCommunityCards.length - 1; communityCard4Index++) {
				const flopWorker = new Worker("./scripts/worker.js");
				activeWorkerCount++;

				flopWorker.postMessage({
					stage: stages.FLOP,
					possibleCommunityCards,
					communityCard4Index,
					communityCards,
					holeCards
				});

				flopWorker.onmessage = (e) => {
					const { wins, draws, losses } = e.data;

					flopWorker.terminate();

					finishedWorkerCount++;
					totalWins += wins;
					totalDraws += draws;
					totalLosses += losses;

					// Check if all workers have finished...
					if (finishedWorkerCount === activeWorkerCount) {
						postCalculate();
					}
				}
			}
			break;
		// If 4 community cards have been drawn, then we need to draw 1 more.
		case stages.TURN:
			const turnWorker = new Worker("./scripts/worker.js");

			console.log('possibleCommunityCards', possibleCommunityCards);
			console.log('communityCards', communityCards);
			console.log('holeCards', holeCards);

			turnWorker.postMessage({
				stage: stages.TURN,
				possibleCommunityCards,
				communityCard4Index: 0,
				communityCards,
				holeCards
			});

			turnWorker.onmessage = (e) => {
				const { wins, draws, losses } = e.data;

				turnWorker.terminate();

				totalWins += wins;
				totalDraws += draws;
				totalLosses += losses;

				postCalculate();
			}
			break;
		// If all 5 community cards have been drawn, then we have all the cards we need.
		case stages.RIVER:
			const riverWorker = new Worker("./scripts/worker.js");

			riverWorker.postMessage({
				stage: stages.RIVER,
				possibleCommunityCards,
				communityCard4Index: 0,
				communityCards,
				holeCards
			});

			riverWorker.onmessage = (e) => {
				const { wins, draws, losses } = e.data;

				riverWorker.terminate();

				totalWins += wins;
				totalDraws += draws;
				totalLosses += losses;

				postCalculate();
			}
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
		console.log('Time:', `${Math.floor(performance.now() - startTime)}ms`);
	}

	var activeOpponents = players.filter(player => player.getAction() !== actions.FOLD && !player.isPlayer());

	// Update table
	switch (stage) {
		case stages.PREFLOP:
			$tablePreFlopWins.innerHTML = chenScore;
			$tablePreFlopTime.innerHTML = `${Math.floor(Math.floor(performance.now() - startTime))}ms`;
			break;
		case stages.FLOP:
			$tableFlopWins.innerHTML = `${totalWins} (${(100 * totalWins / total).toFixed(0)}%)`;
			$tableFlopDraws.innerHTML = `${totalDraws} (${(100 * totalDraws / total).toFixed(0)}%)`;
			$tableFlopLosses.innerHTML = `${totalLosses} (${(100 * totalLosses / total).toFixed(0)}%)`;
			$tableFlopNotLosePercentage.innerHTML = `${(100 * Math.pow((totalWins + totalDraws) / total, activeOpponents.length)).toFixed(2)}%`;
			$tableFlopTime.innerHTML = `${Math.floor(performance.now() - startTime)}ms`;
			break;
		case stages.TURN:
			$tableTurnWins.innerHTML = `${totalWins} (${(100 * totalWins / total).toFixed(0)}%)`;
			$tableTurnDraws.innerHTML = `${totalDraws} (${(100 * totalDraws / total).toFixed(0)}%)`;
			$tableTurnLosses.innerHTML = `${totalLosses} (${(100 * totalLosses / total).toFixed(0)}%)`;
			$tableTurnNotLosePercentage.innerHTML = `${(100 * Math.pow((totalWins + totalDraws) / total, activeOpponents.length)).toFixed(2)}%`;
			$tableTurnTime.innerHTML = `${Math.floor(performance.now() - startTime)}ms`;
			break;
		case stages.RIVER:
			$tableRiverWins.innerHTML = `${totalWins} (${(100 * totalWins / total).toFixed(0)}%)`;
			$tableRiverDraws.innerHTML = `${totalDraws} (${(100 * totalDraws / total).toFixed(0)}%)`;
			$tableRiverLosses.innerHTML = `${totalLosses} (${(100 * totalLosses / total).toFixed(0)}%)`;
			$tableRiverNotLosePercentage.innerHTML = `${(100 * Math.pow((totalWins + totalDraws) / total, activeOpponents.length)).toFixed(2)}%`;
			$tableRiverTime.innerHTML = `${Math.floor(performance.now() - startTime)}ms`;
			break;
	}

	scrollTo(document.querySelector('#players-section'));
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

function compareCards(a, b) {
	return 10 * (ranks[a.rank] - ranks[b.rank]) + (suits[a.suit] - suits[b.suit]);
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

	{name:'Van Dijk---LIVDEF',price:6.5,points:183,minutes:3060},
	{name:'Chalobah---CHEDEF',price:5,points:99,minutes:1447},
	{name:'James---CHEDEF',price:6,points:141,minutes:1863},
	{name:'Robertson---LIVDEF',price:7,points:186,minutes:2537},
	{name:'Matip---LIVDEF',price:6,points:170,minutes:2790},
	{name:'Alexander-Arnold---LIVDEF',price:7.5,points:208,minutes:2853},
	{name:'Gabriel---ARSDEF',price:5,points:146,minutes:3063},
	{name:'Cash---AVLDEF',price:5,points:147,minutes:3337},
	{name:'Cresswell---WHUDEF',price:5,points:115,minutes:2726},
	{name:'Mings---AVLDEF',price:4.5,points:118,minutes:3188},
	{name:'Jansson---BREDEF',price:4.5,points:122,minutes:3321},
	{name:'Cucurella---BHADEF',price:5,points:126,minutes:3089},
	{name:'Mitchell---CRYDEF',price:4.5,points:109,minutes:3101},
	{name:'Targett---NEWDEF',price:5,points:101,minutes:2871},
	{name:'Walker-Peters---SOUDEF',price:4.5,points:82,minutes:2630},
	{name:'Digne---AVLDEF',price:5,points:83,minutes:2440},
	{name:'Tarkowski---EVEDEF',price:4.5,points:83,minutes:3106},
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
	/* {name:'Mount---CHEMID',price:8,points:169,minutes:2358},
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
	{name:'Saint-Maximin---NEWMID',price:6.5,points:116,minutes:2804},
	{name:'Fernandes---MUNMID',price:10,points:151,minutes:3110}, */
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
	/* {name:'Ings---AVLFWD',price:7,points:106,minutes:1891},
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
	{name:'Kane---TOTFWD',price:11.5,points:192,minutes:3231}, */
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

const b = document.createElement('button');
b.innerHTML = 'Run PL';
b.addEventListener('click', () => {
	runPremierLeague();
});
document.querySelector('main').appendChild(b);

function runPremierLeague() {
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
	const timer = performance.now();

	// Loop over the goalkeepers
	for (goalkeeper1Index = 1; goalkeeper1Index < goalkeeperCount; goalkeeper1Index++) {
		const teamWorker = new Worker("./scripts/team.js");

		teamWorker.postMessage({
			goalkeeper1Index
		});

		teamWorker.onmessage = (e) => {
			const { bestTeam, bestTeamPrice, bestTotalPointsPerFullSeason } = e.data;

			teamWorker.terminate();

			console.log('Total Time', `${Math.floor((performance.now() - timer) / 1000)}s`);
			console.log('Best Team', bestTeam);
			console.log('Best Team Price', bestTeamPrice);
			console.log('Best Team Total Points Per Full Season', bestTotalPointsPerFullSeason);
		}
	}

	/*
		First Run

		Best Team:
			Alisson-LIVGKP
			Guaita-CRYGKP
			Chalobah-CHEDEF
			James-CHEDEF
			Robertson-LIVDEF
			Alexander-Arnold-LIVDEF
			Guéhi-CRYDEF
			Benrahma-WHUMID
			Kulusevski-TOTMID
			Barnes-LEIMID
			De Bruyne-MCIMID
			Gray-EVEMID
			Nketiah-ARSFWD
			Diogo Jota-LIVFWD
			Gelhardt-LEEFWD
		Best Team Price 100
		Best Team Total Points Per Full Season 3316.9400805800065
	*/

	/*
		Second Run
		Excluding Nketiah

		Best Team:
			Alisson-LIVGKP
			Guaita-CRYGKP
			Chalobah-CHEDEF
			James-CHEDEF
			Robertson-LIVDEF
			Alexander-Arnold-LIVDEF
			Guéhi-CRYDEF
			Benrahma-WHUMID
			Kulusevski-TOTMID
			Maddison-LEIMID
			Mount-CHEMID
			Gray-EVEMID
			Diogo Jota-LIVFWD
			Vardy-LEIFWD
			Gelhardt-LEEFWD
		Best Team Price 99.5
		Best Team Total Points Per Full Season 3309.416912055309
	*/

	/*
		Third Run
		Excluding Diego Jota

		Best Team:
			Alisson-LIVGKP
			Guaita-CRYGKP
			Chalobah-CHEDEF
			James-CHEDEF
			Robertson-LIVDEF
			Alexander-Arnold-LIVDEF
			Guéhi-CRYDEF
			Benrahma-WHUMID
			Kulusevski-TOTMID
			Maddison-LEIMID
			De Bruyne-MCIMID
			Gray-EVEMID
			Edouard-CRYFWD
			Vardy-LEIFWD
			Gelhardt-LEEFWD
		Best Team Price 100
		Best Team Total Points Per Full Season 3307.091011073509
	*/

	/*
		Fourth Run
		With Captaincy

		Best Team:
			Alisson---LIVGKP
			Guaita---CRYGKP
			Chalobah---CHEDEF
			James---CHEDEF
			Robertson---LIVDEF
			Alexander-Arnold---LIVDEF
			Guéhi---CRYDEF
			Benrahma---WHUMID
			Kulusevski---TOTMID
			Barnes---LEIMID
			Salah---LIVMID
			Gray---EVEMID
			Edouard---CRYFWD
			Vardy---LEIFWD
			Gelhardt---LEEFWD

		Best Team Price 100
		Best Team Total Points Per Full Season 3630.4578721830962
	*/

	/*
		Fifth Run
		With Team Limits

		Best Team:

		Best Team Price 
		Best Team Total Points Per Full Season 
	*/
}
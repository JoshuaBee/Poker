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



// Classes

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



// Variables

var possibleOpponentsCards = [];
var communityCardsTemp = [];
var holeCards = [];
var wins = 0;
var draws = 0;
var losses = 0;



// TODO: Optimise passing the messages.
onmessage = (e) => {
	const { stage, possibleCommunityCards, communityCard4Index, communityCards } = e.data;
	holeCards = e.data.holeCards;

	switch (stage) {
		case stages.FLOP:
			const communityCard4 = possibleCommunityCards[communityCard4Index];

			for (var communityCard5Index = communityCard4Index + 1; communityCard5Index < possibleCommunityCards.length; communityCard5Index++) {
				// 
				const communityCard5 = possibleCommunityCards[communityCard5Index];

				// Remove the community cards from the possible opponents cards.
				possibleOpponentsCards = [...possibleCommunityCards];
				possibleOpponentsCards.splice(communityCard4Index, 1);
				possibleOpponentsCards.splice(communityCard5Index - 1, 1);

				communityCardsTemp = [...communityCards, communityCard4, communityCard5];

				calculate();
			}
			break;
		case stages.TURN:
			// TODO: Doesn't use communityCard4Index
			for (var communityCard5Index = 0; communityCard5Index < possibleCommunityCards.length; communityCard5Index++) {
				// 
				const communityCard5 = possibleCommunityCards[communityCard5Index];

				// Remove the community cards from the possible opponents cards.
				possibleOpponentsCards = [...possibleCommunityCards];
				possibleOpponentsCards.splice(communityCard5Index, 1);

				communityCardsTemp = [...communityCards, communityCard5];

				calculate();
			}
			break;
		case stages.RIVER:
			// TODO: Doesn't use possibleCommunityCards, communityCard4Index
			// Remove the community cards from the possible opponents cards.
			possibleOpponentsCards = [...possibleCommunityCards];

			communityCardsTemp = [...communityCards];

			calculate();

			break;
		default:
			console.error('Whoops');
			break;
	}

	postMessage({ wins, draws, losses });
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
							return results.DRAW;
						}
					}
				}
			}
		}
	}
}
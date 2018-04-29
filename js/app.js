/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

var prevCard;
var openCards = [];
var cardFigure;
var cardPrevFigure = "";
var movesCounter = 0;
var star;
var starRate = 0;
var starPerMove = 8;
var shuffleItems = [];

/*
 * Event listener when a card is clicked
 */
function cardClicked(e) {
	// start only if clicked within the card's border
	if (e.target.className !== "card")	return;

	cardFigure = e.target.children[0].className;

	// save first card and exit
	if (cardPrevFigure == "") {
		e.target.className = displayCard();
		cardPrevFigure = cardFigure;
		prevCard = e.target;
		return;
	}

	// found matching card
	if (cardPrevFigure == cardFigure) {
		e.target.className = lockCard();
		prevCard.className = lockCard();
		addOpenCards(cardFigure);
	} else {
	// show unmatched card for 1 sec and hide both cards
		e.target.className = displayCard();
		sleep(1000).then(() => {
			e.target.className = hideCard();
		});
		prevCard.className = hideCard();
		starRating();
	}

	// reset for next comparison and increment the move counter
	cardPrevFigure = "";
	prevCard = "";
	countMoves();

	// All cards are matched
	if (openCards.length == 8) {
		sleep(3000).then(() => {congrats()});
	}
}

/*
 * Display the card's figure
 */
function displayCard() {
	return "card open show";
}

/*
 * Create a list of matched figures
 */
function addOpenCards(cardFigure) {
	openCards.push(cardFigure);
}

/*
 * Lock open the matching card
 */
function lockCard() {
    return "card match";
}

/*
 * Turn over the unmatched card
 */
function hideCard() {
    return "card";
}

/*
 * Sleep function from https://stackoverflow.com/a/39914235
 */
function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

/*
 * Congrats page
 */
function congrats() {
	let myContainer = document.querySelector('.container');
	let lastPageContent = "<header><h1>Congratulation! You Won!</h1></header>";
	lastPageContent += "<section class='score-panel'>";
	lastPageContent += document.querySelector('.score-panel').innerHTML;
	lastPageContent += "</section>";
	lastPageContent += "<h1 style='text-align: center;'>Woooooo!</h1>";
	myContainer.innerHTML=lastPageContent;
	myContainer.style.padding = '200px 0';
}

/*
 * Increment the move counter and display it on the page
 */
function countMoves() {
	movesCounter++;
	document.querySelector('.moves').innerHTML=movesCounter;
}

/*
 * Start game with 5 stars rating and downgrade every 5 unsuccessful moves
 */
function starRating() {
	star = document.querySelectorAll('.stars > li > i');
	if (starPerMove <= 0 && starRate <= 1) {
		star[starRate].className = "fa fa-star-o";
		starRate++;
		starPerMove = 8;
	}
	starPerMove--;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
window.onload = function() {
	shuffleItems = document.querySelectorAll('.deck > li');
    shuffleItems = shuffle(Array.from(shuffleItems));

	for (let i in shuffleItems) {
		document.querySelector('.deck').appendChild(shuffleItems[i]);
	}
	setInterval(setTime, 1000);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*
 * Count Up Timer function from https://stackoverflow.com/a/5517836
 */
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}


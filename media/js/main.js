 //  this will hold all the card values. I will explain why the array size is 5 and not 4 in a moment.
var cards = new Array(5);

 //  numbers will hold track that each card can only appear 2 times.
var numbers = [0, 0, 0, 0, 0, 0, 0, 0];

 //  This will hold track of all the cards we matched up.
var got = [false, false, false, false, false, false, false, false];

 //  This will hold track of the previous card that we clicked.
var lastCard = null;

 //  This will be the last index that was clicked(square, circle etc…) we will be using numbers from 1 to 8 instead of names, its easier this way.
var lastIndex = 0;

 //  totalIncorrect will hold the number of tries the player took.
var totalIncorrect = 0;

 //  We'll prevent the user from clicking too much, spam clicking, and avoid any potential bugs that may be cause by this.
var isBuzy = false;

function addCards(documentId) {
  var html = "";

  for(i = 0; i < 4; i ++){ // Loop trough the whole card array, and for each element create another array
    cards[i] = new Array(4); // in other words cerate a 4x4 grid of cards(2d array)
      for(k = 0; k < 4; k ++){ // then loop trough that array and set everything to 0
        cards[i][k] = 0;
      }
  }

  cards[4] = new Array(1); // create a last element to hold the back image of the cards
  cards[4][0] = 0; // also set it to 0 it will never change.

  for(y = 0; y < 4; y ++){ // now loop trough a 4x4 grid and add the images
    for(x = 0; x < 4; x ++){
      id = "\""+x + ":" + y +"\""; // creates an id for each image using the x and y position
      html += "<img id=" + id + " src=\""+getCardString(cards[x][y])+"\" style=\"animation:flipFront 5s\" onclick=\"flipCard("+x + ", " + y+")\"/>";
    } //  creates a image with that id, also set the source to the back side of the card. We will be writing that // function next. Then set the on click method to run the flipCard function with parameters x + y.
    // also set it to animate the flipFront animation we created in the css file, it will run this for 5 seconds.
    html += "</br>"; // add a new line after each row.
  }

  generateCards(); // another method we will be creating that will randomize the cards.

  document.getElementById(documentId).innerHTML = html; // now we set that div element’s inner html to the code we just generated.
}

function getCardString(index){
  if(index == 0)
    return "media/cards/" + "cardBack" + ".png";
  else
    return "media/cards/" + index + ".png";
}

function generateCards(){
  for(x = 0; x < 4; x ++){ // Loop trugh the whole grid again(x)
    for(y = 0; y < 4; y ++){ // and this is the  y tiles
      num = randomBetween(1, 8); // now we get a random number from 1 to 8, needs to be created.

      while(numbers[num-1] == 2){ // If the index has already been created twice we keep generating
        num = randomBetween(1, 8); // random numbers until we get one that has not yet been
      } //  used

      cards[x][y] = num; // then we set our grid in that position to the random index
    numbers[num-1] ++; // and tell it that there is one more such index added.
    }
  }
}

function randomBetween(min, max){
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function flipCard(x, y){ // takes in the grid position of the card.
  if(got[cards[x][y]-1] || isBuzy) // check if an animation is busy or that the user
    return;     //  did not yet get that combination otherwise skip the rest.
    e = document.getElementById(""+x + ":"+ y+""); // now we set a variable reverencing the clicked card.
    e.style.animation = "flipBack 1s"; // set the animation to flipBack for 1 second
    isBuzy = true; // show that is buzy animating

    setTimeout(function(){ // now we wait until the animation is done(1 second) and then call displayPic(x, y, e)
      displayPic(x, y, e) // Lets go have a look at this function.
    }, 1000);
}

function displayPic(x, y, e){
  e.src = getCardString(cards[x][y]); // here we set the picture to the correct image
  e.style.animation = "flipFront 1s"; // add the ending animation(grow)

  setTimeout(function(){ // wait for the animation to be done again.
    checkCards(x, y, e) // then we call this function.
  }, 1000);
}

function checkCards(x, y, e){

  if(x == 4) // Checks if the cards did not match then skip the rest.
    return;
    isBuzy = false; // The animation is done now

    if(lastCard != null){ // Check if we clicked on a previous card.

      if(cards[x][y] == lastIndex){ // check if the current card index is the same as the previous index

        got[cards[x][y]-1] = true; // set that we got the combination.
        lastCard = null; // set last card to null so we can start over with the selection.
        checkWin(); // I will cover this next. This is the last function we will need.

        return; // then return to skip the rest.
      }

    e.style.animation = "flipBack 1s"; // if it was incorrect run the animation for the current card

    lastCard.style.animation = "flipBack 1s"; // run the animation for the previous card(shrink)

    n = lastCard; // set a variable for the previous card because we will be setting it to null
  lastCard = null; // set the previous card to null because we need to restart the selection
  totalIncorrect ++; // increase the amount of tries.

  setTimeout(function(){ // wait for the animation
    displayPic(4, 0, e); // set the cards images to the card back image and make them grow again
    displayPic(4, 0, n); // uses the temporary variable we created from the previous card
  }, 1000);

  } else {

    lastCard = e; // if this is the first click, then set the last card to this one
    lastIndex = cards[x][y]; // set the last index to this one.
  }
}

function checkWin(){ // takes no parameters
  for(i = 0; i < 8; i ++){ // Loops trough all the combinations we got.
    if(!got[i]){ // if it finds one that we don’t have yet skip the rest
      return;
    }
  }

  // asks the user if he/she would like to play again.
  if (window.confirm("Congratulations! You Won!! You had " + totalIncorrect + " incorrect moves!, go again?")) {
    location.reload(); // reload the page if ok was pressed.
  }
}

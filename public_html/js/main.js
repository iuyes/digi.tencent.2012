$(function () {
  function createNextCard() {
    var thiscard = createCard();
    thiscard.addClass('rotation');
    cards.push(thiscard);
    setTimeout(function () {
      thiscard.removeClass('rotation');
    }, 2000);
    if (cards.length < CARDS_NUM) {
      setTimeout(createNextCard, 50);
    }
  }
  var card = createCard(),
      cards = [];
  card
    .css('top', '-200px')
    .animate({top: 100}, 1000, 'easeOutBounce', createNextCard);
  cards.push(card);
});
function createCard(init) {
  return $('<div class="card card-back"></div>').appendTo('#cards');
}
var CARDS_NUM = 30;
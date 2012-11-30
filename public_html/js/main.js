$(function () {
  function createNextCard() {
    playRotation($(this));
    
    if (cards.length < CARDS_NUM) {
      var thiscard = createCard();
      cards.push(thiscard);
      setTimeout($.proxy(createNextCard, thiscard), 100);
    } else {
      setTimeout(listCards, 2200);
    }
  }
  function playRotation(card) {
    card.addClass('rotation');
    setTimeout(function () {
      card.removeClass('rotation');
    }, 2000);
  }
  function listCards() {
    for (var i = 0; i < CARDS_NUM; i++) {
      cards[i]
        .addClass('card-ready')
        .css('-webkit-transition', 'left-' + (100 + i * 45) + 'px 0.4 ease-in-out ' + i / 20);
    }
  }

  var card = createCard();
  card
    .css('top', '-200px')
    .animate({top: 100}, 1000, 'easeOutBounce', function () {
      $(this).attr('style', '');
      createNextCard.call(this);
    });
  cards.push(card);
});
function createCard(init) {
  var card = $('<div class="card card-back"></div>').appendTo('#cards');
  card.css('z-index', CARDS_NUM - cards.length);
  return card;
}
var cards = [],
    CARDS_NUM = 20;
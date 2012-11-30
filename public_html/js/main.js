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
        .delay(i * 50)
        .animate({
          top: 300,
          left: 100 + 45 *i,
        }, 400, 'easeInOutCubic');
    }
  }

  var card = createCard();
  card
    .css('top', '-200px')
    .animate({top: 100}, 1000, 'easeOutBounce', createNextCard);
  cards.push(card);
});
function createCard(init) {
  var card = $('<div class="card card-back"></div>').appendTo('#cards');
  card.css('z-index', CARDS_NUM - cards.length);
  return card;
}
var cards = [],
    CARDS_NUM = 20;

$(document)
  .on('mouseover', '.card-ready', function (event) {
    $(this)
      .animate({
        top: 280,
      })
      .addClass('zoom-in')
      .data('level', $(this).css('z-index'))
      .css('z-index', CARDS_NUM + 1);
  })
  .on('mouseout', '.card-ready', function (event) {
    $(this)
      .animate({
        top: 300,
      })
      .removeClass('zoom-in')
      .css('z-index', $(this).data('level'));
  })
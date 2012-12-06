$(function () {
  function createBox() {
    var box = $('<div class="card-box"></div>').appendTo('#cards');
    return box[0];
  }
  function createCard() {
    var card = $(cardTemplate).prependTo('#cards');
    return card;
  }
  function createNextCard() {
    playRotation($(this));
    
    if (cards.length < CARDS_NUM) {
      var thiscard = createCard();
      cards.push(thiscard);
      setTimeout($.proxy(createNextCard, thiscard), 60);
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
    var COLS = 9,
        row = 0,
        col = 0,
        interval = 0,
        count = 0,
        left = ($(window).width() - 760 >> 1) + 60;
    interval = setInterval(function () {
      col = count % COLS;
      row = count / COLS >> 0;
      TweenLite.to(cards[CARDS_NUM - count - 1][0], 0.4, {
        css: {
          left: left + col * 80,
          top: (150 + row * 50) * Math.cos((col - 4) * Math.PI / 16),
          rotation: (4 - col) * 10,
        },
        ease: Cubic.easeInOut,
        onStart: function () {
          $(this.target).removeClass('card-back');
        },
        onComplete: function () {
          $(this.target).addClass('card-ready');
        },
      });
      count++;
      if (count == CARDS_NUM) {
        clearInterval(interval);
        setTimeout(init, 500);
      }
    }, 50);
  }
  function init() {
    $('#fav-card').sortable({
      receive: function (event, ui) {
        console.log('xxx');
        ui.item.removeClass('card-ready');
      },
    });
    $('.card-ready').draggable({
      connectToSortable: '#fav-card',
      revert: 'false',
      
    });
  }
  
  var cards = [],
      cardTemplate = $('#card-template').html(),
      box = createBox(),
      card = createCard(),
      timeline = new TimelineLite();
  card.addClass('start');
  cards.push(card);
  
  // 分别设定两个动画
  timeline
    .to(box, 0.4, {css: {top: -20}, ease: Back.easeOut})
    .to(card[0], 1, {css: {top: 100}, ease: Bounce.easeOut, onComplete: function () {
      $(this.target).removeClass('start');
      createNextCard.call(card);
    }})
    .to(box, 0.6, {css: {top: -100}, onComplete: function () {
      $(this.target).remove();
    }});
});
var CARDS_NUM = 54;
$(document)
  .on('click', '.device-button', function (event) {
    $('#device-detail').data('card', $(this).closest('.card'));
  })
  .on('click', 'button[type=submit]', function (event) {
    var modal = $(this).closest('.modal'),
        card = modal.data('card');
    card.removeClass('card-ready').attr('style', '');
    $('#fav').append(card);
    modal.modal('hide');
  })
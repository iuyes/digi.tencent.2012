$(function () {
  function createBox(center) {
    var box = $('<div class="card-box"></div>').appendTo('#cards');
    return box[0];
  }
  function createCard() {
    var container = $('#cards'),
        index = container.children().length - 1,
        card = $(cardTemplate).appendTo(container);
    card.find('img').attr('src', 'images/cards/card' + index + '.jpg');
    return card;
  }
  function createNextCard() {
    var thiscard = createCard(),
        radix = Math.random() / 2,
        angle = Math.random() * Math.PI * 2;
    cards.push(thiscard);
    TweenLite.to(thiscard, 0.4, {
      css: {
        left: viewport.width * Math.cos(angle) * radix + viewport.width / 2,
        top: viewport.height * Math.sin(angle) * radix + viewport.cY + 150,
        rotation: Math.random() * 90 - 45,
      },
      onStart: function () {
        $(this.target).toggleClass('card-ready card-back');
      },
    });
    
    if (cards.length < CARDS_NUM) {
      setTimeout(createNextCard, 33);
    } else {
      setTimeout(init, 500);
    }
  }
  function tidyNextCard(card) {
    var index = cards.indexOf(card);
    if ($.contains($('#fav-cards')[0], card)) {
      return;
    }
    if (index == CARDS_NUM) {
      $('#tidy-button').removeClass('disabled');
      return;
    }
    var obj = {
      rotation: 0,
    };
    if (index < 2) {
      obj.scale = 1.3;
      obj.left = 364 + index * 158;
      obj.top = 115;
    } else if ((index - 2) % 13 < 2) {
      obj.left = 72 + ((index - 2) % 13 + (index / 13 >> 0) * 2) * 102 + (index / 13 > 2 ? 28 : 0);
      obj.top = 278;
    } else {
      obj.left = (index - 4 - ((index - 2) / 13 >> 0) * 2) % 11 * 74 + 72;
      obj.top = ((index - 4 - ((index - 2) / 13 >> 0) * 2) / 11 >> 0) * 60 + 420;
    }
    var animation = {
      css: obj
    };
    if (index < CARDS_NUM - 1) {
      animation.onComplete = tidyNextCard;
      animation.onCompleteParams = [cards[index + 1]];
    }
    TweenLite.to(card, 0.2, animation);
  }
  function addCardToFav(card) {
    card
      .removeClass('card-ready')
      .appendTo($('#fav-cards'));
    TweenLite.to(card[0], 0.5, {
      css: {
        scale: 1,
        rotation: 0,
      }
    });
  }
  function init() {
    $('.card-ready').draggable({
      cursor: 'crosshair',
      snap: '#fav-cards',
      snapMode: 'inter',
      start: function (event, ui) {
        $('#cards').append(ui.helper);
      },
    });
    $(document)
      .on('click', '.device-button', function (event) {
        $('#device-detail')
          .data('card', $(this).closest('.card'))
          .find('.modal-body').html($(this).children().first().clone());
      })
      .on('click', 'button[type=submit]', function (event) {
        var modal = $(this).closest('.modal'),
            card = modal.data('card');
        addCardToFav(card);
        modal.modal('hide');
      })
      .on('click', '#tidy-button', function (event) {
        if ($(this).hasClass('disabled')) {
          return;
        }
        $(this).addClass('disabled');
        tidyNextCard(cards[0]);
      });
    $('#fama, #tidy-button').show();
    TweenLite.to(box, 0.5, {css: {top: -120, left: 60}});
    TweenLite.to($('#title')[0], 0.5, {css: {top: -12}, ease: Cubic.easeOut});
  }
  
  // 动画由此开始
  var cards = [],
      WIDTH = $(window).width(),
      HEIGHT = $(window).height(),
      viewport = createViewport(WIDTH, HEIGHT - 180);
      cardTemplate = $('#card-template').html(),
      box = createBox(viewport.cX);
  
  $('#cards').height(viewport.height + 90);
  TweenLite.to(box, 0.5, {css: {top: -60, left: 120}, ease: Back.easeOut, onComplete: createNextCard, delay: 0.5});
});
var CARDS_NUM = 54;
function createViewport(w, h) {
  var viewport = {
    width: 860,
    height: 0,
    x: 0,
    y: 0,
    cX: 0,
    cY: 0,
  };
  viewport.height = h < 750 ? (h > 500 ? h : 500) : 750;
  viewport.x = w - viewport.width >> 1;
  viewport.y = h - viewport.height >> 1;
  viewport.cX = w >> 1;
  viewport.cY = h - 320 >> 1;
  console.log(viewport.height, viewport.cY);
  return viewport;
}
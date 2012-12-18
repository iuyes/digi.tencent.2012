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
        top: viewport.height * Math.sin(angle) * radix + viewport.cY,
        rotation: Math.random() * 90 - 45,
      },
      onStart: function () {
        $(this.target).toggleClass('card-ready card-back');
      },
    });
    
    if (cards.length < CARDS_NUM) {
      setTimeout(createNextCard, 33);
    } else {
      init();
    }
  }
  function tidyNextCard(card) {
    var index = cards.indexOf(this);
    if ($.contains($('#fav')[0], this)) {
      return;
    }
    if (index == CARDS_NUM) {
      $('#tidy-button').removeClass('disabled');
      return;
    }
    var obj = {
      left: index * viewport.width / 12,
      top: (index / 12 >> 0) * 60 + 300,
    };
    TweenLite.to(this, 0.5, {
      css: obj,
      onComplete: tidyNextCard,
      onCompleteParam: cards[index + 1],
    });
  }
  function init() {
    $('#fav-card').sortable({
      receive: function (event, ui) {
        ui.item.removeClass('card-ready');
      },
    });
    $('.card-ready').draggable({
      connectToSortable: '#fav-card',
      revert: 'false',
    });
    $(document)
      .on('click', '#tidy-button', function (event) {
        if ($(this).hasClass('disabled')) {
          return;
        }
        $(this).addClass('disabled');
        tidyNextCard(cards[0]);
      });
    $('#fama, #tidy-button').show();
    TweenLite.to(box, 0.5, {css: {top: -120, left: -30}});
    TweenLite.to($('#title')[0], 0.5, {css: {top: 0}, ease: Cubic.easeOut});
  }
  
  // 动画由此开始
  var cards = [],
      WIDTH = $(window).width(),
      HEIGHT = $(window).height(),
      viewport = createViewport(WIDTH, HEIGHT);
      cardTemplate = $('#card-template').html(),
      box = createBox(viewport.cX);
  
  // 分别设定两个动画
  TweenLite.to(box, 0.5, {css: {top: -60, left: 60}, ease: Back.easeOut, onComplete: createNextCard, delay: 0.5});
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
  });
function createViewport(w, h) {
  var viewport = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    cX: 0,
    cY: 0,
  };
  viewport.width = w < 1280 ? (w > 960 ? w : 960) : 1280;
  viewport.height = h < 840 ? (h > 640 ? h : 640) : 840;
  viewport.x = w - viewport.width >> 1;
  viewport.y = h - viewport.height >> 1;
  viewport.cX = w >> 1;
  viewport.cY = h - 200 >> 1;
  return viewport;
}
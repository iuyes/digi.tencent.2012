$(function () {
  function createBox(center) {
    var box = $('<div class="card-box"></div>').appendTo('#cards');
    return box;
  }
  function createCard() {
    var container = $('#cards'),
        index = container.children().length - 1,
        card = $(cardTemplate).appendTo(container);
    card.attr('title', DEVICES[index].name)
      .find('img').attr('src', 'images/cards/card' + index + '.jpg');
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
        z: 1,
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
  function tidyNextCard(card, single) {
    var index = cards.indexOf(card),
        offset = viewport.height - 600 >> 3;
    if (!card.parent().is(favcards)) {
      var obj = {
        rotation: 0,
      };
      if (index < 2) {
        obj.scale = 1.3;
        obj.left = 365 + index * 156;
        obj.top = 240 + offset;
      } else if ((index - 2) % 13 < 2) {
        obj.left = 73 + ((index - 2) % 13 + (index / 13 >> 0) * 2) * 102 + (index / 13 > 2 ? 26 : 0);
        obj.top = 400 + offset * 2;
      } else {
        obj.left = (index - 4 - ((index - 2) / 13 >> 0) * 2) % 11 * 74 + 73;
        obj.top = ((index - 4 - ((index - 2) / 13 >> 0) * 2) / 11 >> 0) * (40 + offset / 2) + 540 + offset * 3;
      }
      var animation = {
        css: obj
      };
      $('#cards').append(card);
      TweenLite.to(card, 0.2, animation);
    }
  
    if (single) {
      return;
    }
  
    if (index < CARDS_NUM - 1) {
      setTimeout(function () {
        tidyNextCard(cards[index + 1]);
      }, 60);
    } else {
      setTimeout(tidyOver, 200);
    }
  }
  function tidyOver() {
    $('#tidy-button a').removeClass('disabled');
  }
  function addCardToFav(card) {
    if (favcards.children().length >= 12) {
      favcards.popover('show');
      setTimeout(function () {
        favcards.popover('hide');
      }, 3000);
      return;
    }
    card
      .removeClass('card-ready')
      .appendTo(favcards)
      .css({
        left: (favcards.children().length - 1) * 70,
        top: 24,
      });;
    TweenLite.to(card, 0.5, {
      css: {
        scale: 1,
        rotation: 0,
      }
    });
    favcards.removeClass('active');
    for (var i =0; i < CARDS_NUM; i++) {
      if (card.is(cards[i])) {
        money += DEVICES[i].price;
        break;
      }
    }
    displayNumbers(money);
  }
  function removeCardFromFav(card, hasAnimation) {
    var offset = favcards.offset();
    $('#cards').append(card);
    card.css('top', '+=' + offset.top);
    for (var i =0; i < CARDS_NUM; i++) {
      if (card.is(cards[i])) {
        money -= DEVICES[i].price;
        break;
      }
    }
    if (hasAnimation) {
      tidyNextCard(cards[i], true);
    }
    displayNumbers(money);
  }
  function displayNumbers(number) {
    var ul = $('#counter ul');
    ul.empty();
    if (number == 0) {
      ul.html('<li class="num0"></li>');
      return;
    }
    while (number > 0) {
      $('<li class="num' + number % 10 +'"></li>').prependTo(ul);
      number = number / 10 >> 0;
    }
  }
  function init() {
    $('.card-ready').draggable({
      snap: '#fav-cards',
      snapMode: 'inter',
      drag: function (event, ui) {
        $('.active').removeClass('active');
        if (ui.helper.hitTestObject(garbage)) {
          garbage.addClass('active');
          return;
        }
        if (ui.helper.hitTestObject(favcards)) {
          favcards.addClass('active');
          return;
        }
      },
      start: function (event, ui) {
        ui.helper.addClass('top-card');
      },
      stop: function (event, ui) {
        ui.helper.removeClass('top-card');
        
        if (garbage.hasClass('active')) {
          ui.helper
            .draggable('destroy')
            .remove();
          garbage.removeClass('active');
          return;
        }
      
        if (favcards.hasClass('active')) {
          addCardToFav(ui.helper);
          return;
        }
      
        if (ui.helper.parent().is(favcards)) {
          removeCardFromFav(ui.helper);
          return;
        }
      
        if (ui.helper.parent().is('#cards')) {
          $('#cards').append(ui.helper);
        }
      }
    });
    $(document)
      .on('click', '.device-button', function (event) {
        var card = $(this).closest('.card'),
            fromFav = card.parent().is('#fav-cards');
        $('#device-detail')
          .data('card', card)
          .find('h3').html(card.attr('title'))
          .end().find('.pic').html($(this).children().first().clone())
          .end().find('.btn-success').toggle(!fromFav)
          .end().find('.btn-danger').toggle(fromFav);
      })
      .on('click', '.btn-success', function (event) {
        var modal = $(this).closest('.modal'),
            card = modal.data('card');
        addCardToFav(card);
        modal.modal('hide');
      })
      .on('click', '.btn-danger', function (event) {
        var modal = $(this).closest('.modal'),
            card = modal.data('card');
        removeCardFromFav(card, true);
        modal.modal('hide');
      })
      .on('click', '#tidy-button a', function (event) {
        if ($(this).hasClass('disabled')) {
          return;
        }
        $(this).addClass('disabled');
        tidyNextCard(cards[0]);
      })
      .on('click', '.share-button', function (event) {
        if (favcards.children().length > 0) {
          var select = '';
          favcards.children().each(function (i) {
            select += $(this).find('img').attr('src').match(/card(\d{1,2})\.jpg/)[1] + '_';
          });
          this.href = this.href.substr(0, this.href.indexOf('?')) + '?select=' + select.slice(0, -1);
        } else {
          alert("您还没选设备呢，这么多选择，一定有你喜欢的。");
        }
      });
    $('#fama, #tidy-button').show();
    TweenLite.to($('#tidy-button'), 0.2, {css: {z: 2}});
    TweenLite.to(box, 0.5, {css: {top: -120, left: 60}});
    TweenLite.to($('#title'), 0.5, {css: {top: 20, z: 2}, ease: Cubic.easeOut});
  }
  
  // 动画由此开始
  var cards = [],
      money = 0,
      WIDTH = $(window).width(),
      HEIGHT = $(window).height(),
      viewport = createViewport(WIDTH, HEIGHT - 180);
      cardTemplate = $('#card-template').html(),
      box = createBox(viewport.cX),
      garbage = $('#garbage'),
      favcards = $('#fav-cards');
  
  $('#cards').height(viewport.height + 200);
  TweenLite.to(box, 0.5, {css: {top: -60, left: 120}, ease: Back.easeOut, onComplete: createNextCard, delay: 0.5});
  displayNumbers(money);
});
var CARDS_NUM = 54,
    DEVICES = [{"name":"iPhone5","price":5288},{"name":"Windows 8","price":248},{"name":"苹果Retina MacBook Pro 15","price":16488},{"name":"索尼Z13","price":13999},{"name":"东芝Z830","price":7999},{"name":"苹果MacBook Air","price":7388},{"name":"ThinkPad X1 Carbon","price":9699},{"name":"宏碁S7","price":9999},{"name":"联想YOGA","price":6999},{"name":"戴尔 Alienware M18x","price":28999},{"name":"华硕太极","price":10988},{"name":"戴尔XPS 12","price":10999},{"name":"苹果iMac","price":9688},{"name":"索尼VAIO Tap 20","price":7999},{"name":"TP-Link WR720N 3G无线路由器","price":129},{"name":"Amazon Kindle Paperwhite","price":750},{"name":"SONY 55HX950","price":18499},{"name":"LG 84LM9600","price":169999},{"name":"三星UA55ES8000","price":17499},{"name":"夏普LCD-52LX840A","price":13199},{"name":"SONOS无线音箱系统","price":8000},{"name":"罗技UE900","price":2999},{"name":"苹果earpods","price":228},{"name":"任天堂WII U","price":2100},{"name":"iRobot Roomba扫地机器人","price":3480},{"name":"Garmin 2500","price":890},{"name":"菲比电子宠物","price":699},{"name":"Nike+Fuelband","price":1150},{"name":"诺基亚Lumia920","price":4599},{"name":"三星GALAXY S III","price":3599},{"name":"三星GALAXY Note II","price":4899},{"name":"HTC Butterfly","price":4799},{"name":"HTC 8X","price":3999},{"name":"Google Nexus 4","price":1880},{"name":"索尼LT29i","price":3500},{"name":"OPPO Find 5","price":2998},{"name":"魅族MX2","price":2499},{"name":"小米手机2","price":1999},{"name":"步步高 VIVO X1","price":2499},{"name":"三洋爱乐普MB-L2DTC移动应急电源","price":399},{"name":"拉卡拉Q2手机刷卡器","price":199},{"name":"苹果iPad mini","price":2498},{"name":"索尼RX1","price":3759},{"name":"苹果iPad 4","price":3688},{"name":"佳能5D Mark III","price":23499},{"name":"Google Nexus7","price":1300},{"name":"富士X-E1","price":9300},{"name":"微软Surface RT","price":4488},{"name":"索尼NEX-6","price":5499},{"name":"三星Galaxy Note 10.1","price":3328},{"name":"尼康D600","price":15399},{"name":"Amazon Kindle Fire HD 8.9","price":1300},{"name":"三星GALAXY Camera","price":3299},{"name":"索尼NEX-VG900E","price":33566}];
function createViewport(w, h) {
  var viewport = {
    width: 860,
    height: 0,
    cX: 0,
    cY: 0,
  };
  viewport.height = (h < 1040 ? (h > 800 ? h : 800) : 1040) - 200;
  viewport.cX = viewport.width >> 1;
  viewport.cY = (viewport.height - 200 >> 1) + 180;
  return viewport;
}
$.fn.hitTestObject = function(obj){
    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();
     
    var compare = obj.offset();
    compare.right = compare.left + obj.outerWidth();
    compare.bottom = compare.top + obj.outerHeight();
             
    return (!(compare.right < bounds.left || compare.left > bounds.right || compare.bottom < bounds.top || compare.top > bounds.bottom));
     
}
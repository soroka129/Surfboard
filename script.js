var hamburger = document.querySelector(".hamburger");
var MenuOverlay = document.querySelector('.welcome__menu-overlay');
var CloseMenu = document.querySelector('.cros-svg');

// Выпадающее меню в хедере  
hamburger.addEventListener('click', function(event) {
    event.preventDefault();
    MenuOverlay.style.display = 'flex';
});

CloseMenu.addEventListener('click', function(event) {
    event.preventDefault();
    MenuOverlay.style.display = 'none';
});

//  Выпадающее меню секция команда

$('.team__member').on('click', function(){
    let heightItemContent = $(this).find('.team__item-content').height();

    $('.team__item-content').height(0);
    $('.team__member').find('.team__member-svg-down').css('display', 'flex');
    $('.team__member').find('.team__member-svg-up').css('display', 'none');

    if (heightItemContent == 0) {
        $(this).find('.team__member-svg-down').css('display', 'none');
        $(this).find('.team__member-svg-up').css('display', 'flex');
        $(this).find('.team__item-content').css('height', '87%');
    } else {
        $(this).find('.team__member-svg-down').css('display', 'flex');
        $(this).find('.team__member-svg-up').css('display', 'none');
        $(this).find('.team__item-content').css('height', '0%');
    };
});

// Слайдер секция produck

const slider = $(".product__list");
const sliderItems = document.querySelectorAll('.product__item');

const sliderTransform = (to) => {
    console.log(to);
    const sliderWidth = slider.width();
    console.log(sliderWidth);
    const currentPosition = +slider.css('left').replace('-', '').replace('px', '');
    console.log(currentPosition);
    let index = 0;
    console.log(sliderItems.length);

    if (to === 'rigth') {
        if (currentPosition === 0) {
            index = index + 1;
            console.log(index);
        } else if (currentPosition < sliderWidth*(sliderItems.length - 1)) {
            console.log(sliderItems.length);
            index = currentPosition / sliderWidth +1;
        };
    } else {
        if (currentPosition === 0) {
            index = sliderItems.length - 1;
        } else {
            index = currentPosition / sliderWidth - 1;
        };

    }
   const q = `${-sliderWidth * index}px`;
    console.log(index);
    console.log(q);
    slider.css('left', q);
};

$('.btn-left').click(function(e) {
    e.preventDefault();
    sliderTransform('left');
});

$('.btn-right').click(function(e) {
    e.preventDefault();
    sliderTransform('right');
});

//Сдайдер секция menu

const mesureWidth = item => {
    let reqItemWidth = 0;

    const screenWidth = $(window).width();
    const container = item.closest('.menu-boards__list');
    const titleBlocks = container.find('.menu-boards__item-title');
    const titleWidth = titleBlocks.width() * titleBlocks.length;

    const textcontainer = item.find('.menu-boards__content-container');
    const paddingLeft = parseInt(textcontainer.css('padding-left'));
    const paddingRight = parseInt(textcontainer.css('padding-right'));

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
        reqItemWidth = screenWidth - titleWidth;
    } else {
        reqItemWidth = 524;
    };

    return {
        container: reqItemWidth,
        textcontainer: reqItemWidth - paddingLeft -paddingRight
    };
    
};

const closeEveryItemInContainer = container => {
    const items = container.find('.menu-boards__item');
    const content = container.find('.menu-boards__content');

    items.removeClass('open');
    content.width(0);
}

const openItem = item => {
    const hiddenContent = item.find('.menu-boards__content');
    const reqWidth = mesureWidth(item);
    const textBlock = item.find('.menu-boards__content-container');

    item.addClass('open');
    hiddenContent.width(reqWidth.container);
    textBlock.width(reqWidth.textcontainer);
};

$(".menu-boards__item-title").on('click', function(e) {
    e.preventDefault();

    const $this = $(e.currentTarget);
    const item = $this.closest('.menu-boards__item');
    const itemOpened = item.hasClass('open');
    const container = $this.closest('.menu-boards__list');

    if (itemOpened) {
        closeEveryItemInContainer(container);
    } else {
        closeEveryItemInContainer(container);
        openItem(item);
    };
});

// Слайдер секция отзывы
const findBlockByAlias = alias => {
    return $(".reviews__content-inner").filter((ndx, item) => {
        return $(item).attr('data-linked-with') == alias;
    });
};

$('.interactive-avatar-link').on('click', function(e) {
    e.preventDefault();
    const $this = $(e.currentTarget);
    const target = $this.attr('data-open');
    const itemToShow = findBlockByAlias(target);
    const curItem = $this.closest('.paginator__reviews-item');

    itemToShow.addClass('reviews__content-inner-active').siblings().removeClass('reviews__content-inner-active');
    curItem.addClass('interactive-avatar-active').siblings().removeClass('interactive-avatar-active');
});

// Отправка формы заказа

var overlayOrder = document.querySelector('.order__overlay');
var FormBtn = document.querySelector('.button-form');
var CloseBtn = document.querySelector('.order__overlay-button');

const validateFields = (form, fieldsArray) => {

    fieldsArray.forEach(field => {
        field.removeClass("input-error");
        if (field.val().trim() === "") {
            field.addClass("input-error");
        };
    });
    const errorFields = form.find(".input-error");
    return errorFields.length === 0;
};

$('.order__container').submit(function(e) {
    e.preventDefault();

    const form = $(e.currentTarget);
    const name = form.find("[name='name']");
    const phone = form.find("[name='phone']");
    const comment = form.find("[name='comment']");
    const to = form.find("[name='to']");

    const modal = $("#modal");
    const content = $(".order__overlay-conteiner-text");
    const body = $('body');

    content.removeClass("modal-success");
    content.removeClass("error-modal");

    const isValid = validateFields(form, [name, phone, comment, to]);

    if (isValid) {
        $.ajax({
            url: "https://webdev-api.loftschool.com/sendmail",
            method: "post",
            data: {
            name: name.val(),
            phone: phone.val(),
            comment: comment.val(),
            to: to.val(),
            },

            success: function(data) {
                content.text(data.message);
                console.log(content);
                content.addClass("modal-success");
                body.addClass("body-nonScrol")
                overlayOrder.style.display = 'flex';
            },

            error: function(data) {
                const message = data.responseJSON.message;
                content.text(message);
                console.log(content);
                content.addClass("error-modal");
                body.addClass("body-nonScrol")
                overlayOrder.style.display = 'flex';
            },
        });

    };
    
    CloseBtn.addEventListener('click', function(event) {
        event.preventDefault();
        body.removeClass("body-nonScrol")
        overlayOrder.style.display = 'none';
    });
});

// Подключение Яндекс.карты

ymaps.ready(init);
function init(){     
    var myMap = new ymaps.Map ('map', {
        center: [55.996538, 92.885043], //координаты центра
        zoom: 15, //уровень приближения
        controls: []
    });

    const coords = [
    [55.997607, 92.885307],
    [56.01400, 92.905991]
    ];

    const myCollection = new ymaps.GeoObjectCollection({}, {
        draggable: false,
        iconLayout: 'default#image',
        iconImageHref: './img/mark.svg',
        iconImageSize: [58,73],
        // iconImageOffset: [-29,-37]
    });

    coords.forEach(coord => {
        myCollection.add(new ymaps.Placemark(coord));
    });
      
    myMap.geoObjects.add(myCollection);
    myMap.behaviors.disable('scrollZoom');
    
}

//Подключение youtube player
let tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;

const playerContainer = $(".player");
 
let eventsInit = () => {
 $(".player__start").on('click', function(e) {
   e.preventDefault();

   if (playerContainer.hasClass("paused")) {
    // playerContainer.removeClass("paused");
    player.pauseVideo();
  } else {
    // playerContainer.addClass("paused");
    player.playVideo();
  };
});
}

$(".player__playback").click(e => {
    const bar = $(e.currentTarget);
    const clickedPosition = e.originalEvent.layerX;
    
    const newButtonPositionPercent = (clickedPosition / bar.width()) * 100;
    const newPlaybackPositionSec =
      (player.getDuration() / 100) * newButtonPositionPercent;
    
    $(".player__playback-button").css({
      left: `${newButtonPositionPercent}%`
    });
    
    player.seekTo(newPlaybackPositionSec);
   });

   $(".player__splash").click(e => {
    player.playVideo();
  })

const formatTime = timeSec => {
    const roundTime = Math.round(timeSec);
    
    const minutes = addZero(Math.floor(roundTime / 60));
    const seconds = addZero(roundTime - minutes * 60);
    
    function addZero(num) {
      return num < 10 ? `0${num}` : num;
    }
    
    return `${minutes} : ${seconds}`;
   };

const onPlayerReady = () => {
    let interval;
    const durationSec = player.getDuration();
    
    $(".player__duration-estimate").text(formatTime(durationSec));
    
    if (typeof interval !== "undefined") {
      clearInterval(interval);
    }
    
    interval = setInterval(() => {
      const completedSec = player.getCurrentTime();
      const completedPercent = (completedSec / durationSec) * 100;

      $(".player__playback-button").css({
        left: `${completedPercent}%`
      });
    
      $(".player__duration-completed").text(formatTime(completedSec));
    }, 1000);
   };

   const onPlayerStateChange = event => {
    /*
      -1 (воспроизведение видео не начато)
      0 (воспроизведение видео завершено)
      1 (воспроизведение)
      2 (пауза)
      3 (буферизация)
      5 (видео подают реплики).
    */
    switch (event.data) {
      case 1:
        playerContainer.addClass("active");
        playerContainer.addClass("paused");
        break;
    
      case 2:
        playerContainer.removeClass("active");
        playerContainer.removeClass("paused");
        break;
    }
   };

function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt-player", {
    height: '390',
    width: '660',
    videoId: 'LFDaKUHgK7E',
    playerVars: {
      'playsinline': 1,
      'controls': 0,
      'disablekd': 0,
      'showinfo': 0,
      'rel': 0,
      'autoplay': 0,
    },
    events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
    },

    playerVars: {
        controls: 0,
        disablekd: 0,
        showinfo: 0,
        rel: 0,
        autoplay: 0
    }
  });
}

eventsInit();

// Работа скрола на одну секцию

const sections = $('section');
const display = $('.maincontent');

const mobileDetect = new MobileDetect(window.navigator.userAgent);
const isMobile = mobileDetect.mobile();

let inScroll = false;

sections.first().addClass('show');

const performTransition = sectionEq => {
    if (inScroll === false) {
        inScroll = true;
        const position = sectionEq * -100;
        
        const currentSection = sections.eq(sectionEq);
        const menuTheme = currentSection.attr('data-sidemenu-theme');
        const sideMenu = $('.fixed-menu');
        const colorMenu = $('.fixed-menu__link');

        if (menuTheme === 'black') {
            colorMenu.addClass('fixed-menu__black');

        } else {
            colorMenu.removeClass('fixed-menu__black');
        };

        display.css({
            transform: `translateY(${position}%)`
        });
    
        sections.eq(sectionEq).addClass('show').siblings().removeClass('show');

        setTimeout(() => {
            inScroll = false;

            sideMenu.find('.fixed-menu__item').eq(sectionEq).addClass('fixed-menu__item-active').siblings().removeClass('fixed-menu__item-active');
        }, 800);
    };
};

const scrollViewport = direction => {
    const showSection = sections.filter('.show');
    const nextSection = showSection.next();
    const prevSecnion = showSection.prev();

    if (direction === 'next' && nextSection.length) {
        performTransition(nextSection.index());
    };
    if (direction === 'prev' && prevSecnion.length) {
        performTransition(prevSecnion.index());
    };
};

$(window).on('wheel', function(e) {
    const deltaY = e.originalEvent.deltaY;

    if (deltaY > 0) {
        scrollViewport('next');
    };
    if (deltaY < 0) {
        scrollViewport('prev');
    };
});

$(window).on('keydown', e =>{
    const tagName = e.target.tagName.toLowerCase();

    if (tagName !== 'input' && tagName !== 'textarea') {
        switch (e.keyCode) {
            case 38:
                scrollViewport('prev');
                break;
            case 40:
                scrollViewport('next');
                break;
        };
    };
});

$('wrapper').on('touchmove', e => e.preventDefault());

$('[data-scroll-to]').on('click', function(e) {
    e.preventDefault();
    console.log(1);
    const $this = $(e.currentTarget);
    const target = $this.attr('data-scroll-to');
    const reqSection = $(`[data-section-id=${target}]`);

    performTransition(reqSection.index());
});

if (isMobile) {

    // http://labs.rampinteractive.co.uk/touchSwipe/

$("body").swipe( {

    swipe:function(event, direction,) {
      const scroller = viewportScroller();
      let scrollDirection = '';
      
      if (direction === 'up') scrollDirection = 'next';
      if (direction === 'down') scrollDirection = 'prev';

      scroller[scrollDirection]();
    },
  });
};

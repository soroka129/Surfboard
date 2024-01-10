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
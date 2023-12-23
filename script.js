var overlayOrder = document.querySelector('.order__overlay');
var Foembtn = document.querySelector('.button-form');
var CloseBtn = document.querySelector('.order__overlay-button');
var hamburger = document.querySelector(".hamburger");
var MenuOverlay = document.querySelector('.welcome__menu-overlay');
var CloseMenu = document.querySelector('.cros-svg');

hamburger.addEventListener('click', function(event) {
    event.preventDefault();
    MenuOverlay.style.display = 'flex';
});

CloseMenu.addEventListener('click', function(event) {
    event.preventDefault();
    MenuOverlay.style.display = 'none';
});

FormBtn.addEventListener ('click', function(event) {
    event.preventDefault();
    overlayOrder.style.display = 'flex'; 
});

CloseBtn.addEventListener('click', function(event) {
    event.preventDefault();
    overlayOrder.style.display = 'none';
});


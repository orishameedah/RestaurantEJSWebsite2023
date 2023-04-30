let navbar = document.querySelector('.header .navbar');
let menuBtn = document.querySelector('#menu-btn');
menuBtn.onclick = () => {
    menuBtn.classList.toggle('fa-times'); //js css
   navbar.classList.toggle('active');
}

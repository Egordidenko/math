import domReady from 'domReady';
import style from 'style.scss';

// modules
import dispatcher from 'dispatcher';
import slider from 'slider/slider.view'
import menu from 'menu/menu.view'

//form
import form from 'form/form.view';

domReady(function () {
    slider.init();
    menu.init();
});


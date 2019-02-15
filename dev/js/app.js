import domReady from 'domReady';
import style from 'style.scss';

// modules
import vhUnits from './resize/vhUnits.view';

domReady(function () {
	vhUnits.init();
});


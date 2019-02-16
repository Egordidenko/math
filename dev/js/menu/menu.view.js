import dispatcher from 'dispatcher';

let items = {};

//!!!replace!
let idName = 'new-id-';
let idNum  = 1;


let _handleChange = function() {
    for (let key in items) {
        items[key].element.addEventListener('click', function (e) {

        })
    }
};

let _add = function(items, element) {
    let id = element.getAttribute('data-id');

    if (!id) {
        id = idName + idNum;
        idNum++;
    }

    items[id] = {
        id: id,
        element: element
    }
};

let _remove = function(items, item) {
    delete items[item.id];
};

let _handleMutate = function() {
    let elements;

    let check = function(items, element) {
        let found = false;
        for (let id in items) {
            if (items.hasOwnProperty(id)) {
                if (items[id].element === element) {
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            _add(items, element);
        }
    };

    let backCheck = function(items, elements, item) {
        let element = item.element;
        let found   = false;

        for (let i = 0; i < elements.length; i++) {
            if (elements[i] === item.element) {
                found = true;
                break;
            }
        }

        if (!found) {
            _remove(items, item);
        }
    };


    elements = document.getElementsByClassName('menu-open');
    for (let i = 0; i < elements.length; i++) {
        check(items, elements[i]);
    }
    for (let id in items) {
        if (items.hasOwnProperty(id)) {
            backCheck(items, elements, items[id]);
        }
    }
};

let init = function() {
    _handleMutate();
    _handleChange();


    dispatcher.subscribe(function(e) {
        console.log(e)
        if (e.type === 'mutate') {

            _handleMutate();
            _handleChange();
        }
    });
}

export default {
    init: init
}

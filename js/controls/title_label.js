'use strict';

export var TitleLabel = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        let container = L.DomUtil.create('div');
        container.id = 'titleLabel';
        container.href = 'https://www.runemate.com/community/members/defeat3d.675/';
        container.innerHTML = "<span id='explv'>Defiled</span>'s Map";

        L.DomEvent.disableClickPropagation(container);
        return container;
    }
});
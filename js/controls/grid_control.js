'use strict';

import {Position} from '../model/Position.js';
import {MAX_X, MAX_Y, MIN_X, MIN_Y, REGION_HEIGHT, REGION_WIDTH} from '../model/Region.js';

export var GridControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control noselect');
        container.style.background = 'none';
        container.style.width = '130px';
        container.style.height = 'auto';

        let labelsButton = L.DomUtil.create('a', 'leaflet-bar leaflet-control leaflet-control-custom', container);
        labelsButton.id = 'toggle-region-grid';
        labelsButton.innerHTML = 'Toggle Region Grid';

        this._gridFeatureGroup = this._createGridFeature();
        this._enabled = false;

        L.DomEvent.on(labelsButton, 'click', this._toggleGrid, this);

        L.DomEvent.disableClickPropagation(container);
        return container;
    },

    _toggleGrid: function() {
        if (this._enabled) {
            this._map.removeLayer(this._gridFeatureGroup);
            this._enabled = false;
        } else {
            this._map.addLayer(this._gridFeatureGroup);
            this._enabled = true;
        }
    },

    _createGridFeature: function() {
        let line;
        let endPos;
        let startPos;
        let gridFeatureGroup = new L.FeatureGroup();

        for (let x = MIN_X; x <= MAX_X; x += REGION_WIDTH) {
            startPos = new Position(x, MIN_Y, 0);
            endPos = new Position(x, MAX_Y, 0);

            line = L.polyline([startPos.toLatLng(this._map), endPos.toLatLng(this._map)], {clickable: false});
            gridFeatureGroup.addLayer(line);
        }

        for (let y = MIN_Y; y <= MAX_Y; y += REGION_HEIGHT) {
            startPos = new Position(MIN_X, y, 0);
            endPos = new Position(MAX_X, y, 0);

            line = L.polyline([startPos.toLatLng(this._map), endPos.toLatLng(this._map)], {clickable: false});
            gridFeatureGroup.addLayer(line);
        }

        return gridFeatureGroup;
    }
});
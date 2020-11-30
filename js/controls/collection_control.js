'use strict';

import {Position} from '../model/Position.js';
import {Graph} from '../model/Graph.js'


// Import converters
import {RuneMateGraphConverter} from "../bot_api_converters/runemate/runemate_graph_converter.js";

let converters = {
    "RuneMate": {
        "graph_converter": new RuneMateGraphConverter()
    }
};

export var CollectionControl = L.Control.extend({    
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        this._graph = new Graph(this._map);

        this._currentDrawable = undefined;
        this._currentConverter = undefined;

        this._prevMouseRect = undefined;
        this._prevMousePos = undefined;

        this._firstSelectedAreaPosition = undefined;
        this._drawnMouseArea = undefined;    
        this._editing = false;

        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control noselect');
        container.style.background = 'none';
        container.style.width = '70px';
        container.style.height = 'auto';

        // Copy to clipboard control
        this._createControl('<i class="fa fa-copy"></i>', container, function(e) {
            this._copyCodeToClipboard();
        });

        // Settings control
        this._createControl('<i class="fa fa-cog"></i>', container, function(e) {
            if ($("#settings-panel").is(":visible")) {
                $("#settings-panel").hide("slide", {direction: "right"}, 300);
            } else {
                if (this._currentDrawable !== undefined) {
                    this._toggleCollectionMode();
                }

                $("#settings-panel").css('display', 'flex').hide();
                $("#settings-panel").show("slide", {direction: "right"}, 300);
            }
        });

        this._createControl('<img src="css/images/dax-path-icon.png" alt="Graph" title="Graph" height="25" width="30">', container, function (e) {
            this._toggleCollectionMode(this._graph, "graph_converter", e.target);
        });

        // Undo control
        this._createControl('<i class="fa fa-undo" aria-hidden="true"></i>', container, function (e) {
            if (this._currentDrawable !== undefined) {
                this._currentDrawable.removeLast();
                this._outputCode();
            }
        });

        // Clear control
        this._createControl('<i class="fa fa-trash" aria-hidden="true"></i>', container, function(e) {
            if (this._currentDrawable !== undefined) {
                this._currentDrawable.removeAll();
                this._outputCode();
            }
        });

        L.DomEvent.disableClickPropagation(container);

        L.DomEvent.on(this._map, 'click', this._addPosition, this);

        L.DomEvent.on(this._map, 'mousemove', this._drawMouseArea, this);

        let context = this;
        $("#output-type").on('change', () => context._outputCode());
        $("#bot-api").on('change', () => context._outputCode());

        return container;
    },
    
    _createControl: function(html, container, onClick) {
        let control = L.DomUtil.create('a', 'leaflet-bar leaflet-control leaflet-control-custom', container);
        control.innerHTML = html;
        L.DomEvent.on(control, 'click', onClick, this);
    },

    _addPosition: function(e) {
        if (!this._editing) {
            return;
        }
        this._currentDrawable.add(Position.fromLatLng(this._map, e.latlng, this._map.plane));
        this._outputCode();
    },

    _drawMouseArea: function(e) {
        if (!this._editing) {
            return;
        }

        let mousePos = Position.fromLatLng(this._map, e.latlng, this._map.plane);
    },

    _toggleCollectionMode: function(drawable, converter, element) {
        $("a.leaflet-control-custom.active").removeClass("active");

        if (this._currentDrawable === drawable || drawable === undefined) {
            this._editing = false;

            $("#code-output-panel").hide("slide", {direction: "right"}, 300);

            this._firstSelectedAreaPosition = undefined;
            this._map.removeLayer(this._currentDrawable.featureGroup);

            if (this._drawnMouseArea !== undefined) {
                this._map.removeLayer(this._drawnMouseArea);
            }
            
            this._currentDrawable = undefined;
            this._currentConverter = undefined;
            
            this._outputCode();
            return;
        }

        if ($("#settings-panel").is(":visible")) {
            $("#settings-panel").hide("slide", {direction: "right"}, 300);
        }

        this._editing = true;
        $(element).closest("a.leaflet-control-custom").addClass("active");
        
        this._currentConverter = converter;

        $("#code-output-panel").show("slide", {direction: "right"}, 300);

        if (this._currentDrawable !== undefined) {
            this._map.removeLayer(this._currentDrawable.featureGroup);
        }

        this._firstSelectedAreaPosition = undefined;

        if (this._drawnMouseArea !== undefined) {
            this._map.removeLayer(this._drawnMouseArea);
        }

        this._currentDrawable = drawable;

        if (this._currentDrawable !== undefined) {
            this._map.addLayer(this._currentDrawable.featureGroup);
        }

        this._outputCode();
    },

    _outputCode: function () {
        let output = "";

        if (this._currentDrawable !== undefined) {
            let botAPI = $("#bot-api option:selected").text();
            output = converters[botAPI][this._currentConverter].toJson(this._currentDrawable);
        }

        $("#code-output").html(output);
    },

    _copyCodeToClipboard: function () {
        let $temp = $("<textarea>");
        $("body").append($temp);
        $temp.val($("#code-output").text()).select();
        document.execCommand("copy");
        $temp.remove();

        Swal({
            position: 'top',
            type: 'success',
            title: `Copied to clipboard`,
            showConfirmButton: false,
            timer: 6000,
            toast: true,
        });
    }
});
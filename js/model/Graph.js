'use strict';

import {Vertex} from "./Vertex.js";

export class Graph {

    constructor(map) {
        this.map = map;
        this.featureGroup = new L.FeatureGroup();
        this.vertices = [];
        this.lines = [];
        this.rectangles = [];
    }

    add(position) {
        let vertex = new Vertex(position);
        let rectangle = position.toLeaflet(this.map);
        this.featureGroup.addLayer(rectangle);
        this.rectangles.push(rectangle);

        if (this.vertices.length > 0) {
            let previous = this.vertices[this.vertices.length - 1];
            this.addBidirectionalEdge(vertex, previous, vertex.position.getDistance(previous.position));
            this.lines.push(this.createPolyline(previous, vertex));
            this.featureGroup.addLayer(this.lines[this.lines.length - 1]);
        }

        this.vertices.push(vertex);
    }

    removeLast() {
        if (this.vertices.length > 0) this.featureGroup.removeLayer(this.vertices.pop());
        if (this.lines.length > 0) this.featureGroup.removeLayer(this.lines.pop());
        if (this.rectangles.length > 0) this.featureGroup.removeLayer(this.rectangles.pop());
    }

    removeAll() {
        while (this.vertices.length > 0) this.featureGroup.removeLayer(this.vertices.pop());
        while (this.lines.length > 0) this.featureGroup.removeLayer(this.lines.pop());
        while (this.rectangles.length > 0) this.featureGroup.removeLayer(this.rectangles.pop());
    }

    addBidirectionalEdge(vertex1, vertex2, weight) {
        vertex1.addEdge(vertex2, weight);
        vertex2.addEdge(vertex1, weight);
    }

    createPolyline(startPosition, endPosition) {
        return L.polyline([startPosition.toCentreLatLng(this.map), endPosition.toCentreLatLng(this.map)], {clickable: false});
    }

    getName() {
        return "Graph";
    }
}
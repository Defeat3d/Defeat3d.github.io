import {Edge} from "./Edge.js";
import {Position} from "./Position.js";

export class Vertex {

    constructor(position) {
        this.id = Vertex.uuidv4();
        this.position = position;
        this.edges = [];
    }

    static uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    addEdge(destination, weight) {
        this.edges.push(new Edge(destination, weight));
    }

    toLatLng(map) {
        return Position.toLatLng(map, this.position.x, this.position.y)
    }

    toCentreLatLng(map) {
        return Position.toLatLng(map, this.position.x + 0.5, this.position.y + 0.5)
    }

    toLeaflet(map) {
        let startLatLng = this.toLatLng(map);
        let endLatLng = new Position(this.position.x + 1, this.position.y + 1, this.position.z).toLatLng(map);

        return L.rectangle(L.latLngBounds(startLatLng, endLatLng), {
            color: "#33b5e5",
            fillColor: "#33b5e5",
            fillOpacity: 1.0,
            weight: 1,
            interactive: false
        });
    }

    equals(vertex) {
        return this.position.x === vertex.position.x && this.position.y === vertex.position.y && this.position.z === vertex.position.z;
    }

    toString() {
        return `(${this.id}, ${this.position.x}, ${this.position.y}, ${this.position.z})`;
    }

}
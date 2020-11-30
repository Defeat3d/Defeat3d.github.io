'use strict';

import {Converter} from "../converter.js";

export class RuneMateGraphConverter extends Converter {

    toRaw(graph) {
        let vertexOutput = ``;
        let edgeOutput = ``;
        for (let i = 0; i < graph.vertices.length; i++) {
            let vertex = graph.vertices[i];

            if (i > 0) vertexOutput += `,\n`;
            if (i > 0) edgeOutput += `,\n`;
            vertexOutput += `{\n`;
            vertexOutput += `"id": "${vertex.id}",\n`;
            vertexOutput += `"type": "CoordinateVertex",\n`;
            vertexOutput += `"x": ${vertex.position.x},\n`;
            vertexOutput += `"y": ${vertex.position.y},\n`;
            vertexOutput += `"plane": ${vertex.position.z}\n`;
            vertexOutput += `}`;

            edgeOutput += `"${vertex.id}": {\n`;
            for (let e = 0; e < vertex.edges.length; e++) {
                let edge = vertex.edges[e];

                if (e > 0) edgeOutput += `,\n`;
                edgeOutput += `"${edge.destination.id}": ${edge.weight}`;
            }
            edgeOutput += `}`;
        }
        let combinedOutput = `{\n"vertices": [\n`;
        combinedOutput += vertexOutput;
        combinedOutput += `],\n`;
        combinedOutput += `"edges": {\n`;
        combinedOutput += edgeOutput;
        combinedOutput += `}\n}`;
        return combinedOutput;
    }

    toJavaSingle(graph) {
        return this.toRaw(graph);
    }

    toJavaArray(graph) {
        return this.toRaw(graph);
    }

    toJavaList(graph) {
        return this.toRaw(graph);
    }

    toJavaArraysAsList(graph) {
        return this.toRaw(graph);
    }

}
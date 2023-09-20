import fluence from 'k6/x/fluence';
import {retry} from "./utils.js"

export const options = {
    vus: 100,   
    iterations: 10000,
};

const relay ="/dns4/0-benchmark.fluence.dev/tcp/9000/wss/p2p/12D3KooWPr286GAaLxVXJqHR4bPWZdoxQkGBwUchruaopAUf6SPm"

const script = open('./TC1.air');

const connection = retry(fluence.builder(relay).connect, 3);

export default function () {
    connection.send(script);
}
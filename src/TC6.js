import fluence from 'k6/x/fluence';
import {retry} from "./utils.js"

export const options = {
    vus: 100,   
    iterations: 10000,
};

const relay ="/dns4/0-benchmark.fluence.dev/tcp/9000/wss/p2p/12D3KooWPr286GAaLxVXJqHR4bPWZdoxQkGBwUchruaopAUf6SPm"

const script = function (){
    let content = open('./TC6.air');
    return content
    .replaceAll("peer_id_1","\"12D3KooWPr286GAaLxVXJqHR4bPWZdoxQkGBwUchruaopAUf6SPm\"")
    .replaceAll("peer_id_2","\"12D3KooWAvaGTMpXrxDiVBm1VnWFzNQVnQxrAsruvudXYRWkXkmi\"")
    .replaceAll("peer_id_3","\"12D3KooWE8PaRfpTPfxkukLCY1EQmXq49xpLm28c8bEnYtfdhqdC\"");
}();

const connection = retry(fluence.builder(relay).connect, 3);

export default function () {
    let _ = connection.execute(script);
}
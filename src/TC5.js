import fluence from 'k6/x/fluence';
import {retry} from "./utils.js"

export const options = {
    vus: 100,   
    iterations: 10000,
};

const relay ="/dns4/0-benchmark.fluence.dev/tcp/9000/wss/p2p/12D3KooWPr286GAaLxVXJqHR4bPWZdoxQkGBwUchruaopAUf6SPm"

const script = function (){
    let content = open('./TC5.air');
    let str ="\""+ 'x'.repeat(98*1024*1024)+"\"";
    return content
    .replaceAll("init_relay","\"12D3KooWPr286GAaLxVXJqHR4bPWZdoxQkGBwUchruaopAUf6SPm\"")
    .replaceAll("string_data", str);
}();

const connection = retry(fluence.builder(relay).connect, 3);

export default function () {
    let _ = connection.execute(script);
}
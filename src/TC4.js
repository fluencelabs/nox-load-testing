import fluence from 'k6/x/fluence';
import {retry} from "./utils.js"

export const options = {
    vus: 100,
    iterations: 10000,
};

const relay = "/dns4/0-benchmark.fluence.dev/tcp/9000/wss/p2p/12D3KooWPr286GAaLxVXJqHR4bPWZdoxQkGBwUchruaopAUf6SPm"

const script = function () {
    let content = open('./TC4.air');
    return content
        .replaceAll("worker_id", "\"12D3KooWGoSshKHTbrRg5uZucuLJsMFda3au2ZMkms6v8cVkyytq\"")
        .replaceAll("init_relay", "\"12D3KooWPr286GAaLxVXJqHR4bPWZdoxQkGBwUchruaopAUf6SPm\"");
}();

const connection = retry(fluence.builder(relay).connect, 3);

export default function () {
    let file_name = (Math.random() + 1).toString(36).substring(7);
    let final_script = script.replaceAll("file_name", file_name);
    let resp = connection.execute(final_script);
}
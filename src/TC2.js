import fluence from 'k6/x/fluence';
import {retry} from "./utils.js"

export const options = {
    vus: 100,
    iterations: 10000,
    fluence: {
        relay: "/dns4/0-benchmark.fluence.dev/tcp/9000/wss/p2p/12D3KooWPr286GAaLxVXJqHR4bPWZdoxQkGBwUchruaopAUf6SPm",
        relay_peer_id: "12D3KooWPr286GAaLxVXJqHR4bPWZdoxQkGBwUchruaopAUf6SPm",
        default_timeout: 3 * 60 * 1000 * 1000 * 1000, //3 minutes
        prometheus: {
            address: "https://mimir.fluence.dev/prometheus",
            username: __ENV.K6_FLUENCE_PROMETHEUS_USERNAME,
            password: __ENV.K6_FLUENCE_PROMETHEUS_PASSWORD,
            org_id: "fluencelabs",
            env: "benchmark"
        }
    }

};


const script = function () {
    let content = open('./TC2.air');
    return content.replaceAll("init_relay", `"${options.fluence.relay_peer_id}"`)
}();

const connection = retry(fluence.builder(options.fluence.relay).connect, 3);

export default function () {
    connection.send(script, options.fluence.default_timeout);
}

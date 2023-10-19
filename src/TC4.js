import fluence from 'k6/x/fluence';
import {retry} from "./utils.js"
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {textSummary} from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    vus: 100,
    iterations: 10000,
    fluence: {
        relay: "/dns4/0-benchmark.fluence.dev/tcp/9000/wss/p2p/12D3KooWPr286GAaLxVXJqHR4bPWZdoxQkGBwUchruaopAUf6SPm",
        relay_peer_id: "12D3KooWPr286GAaLxVXJqHR4bPWZdoxQkGBwUchruaopAUf6SPm",
        default_timeout: 3 * 60 * 1000 * 1000 * 1000, //3 minutes
        worker_id: "12D3KooWDhNFu1degWxAaTpRYeFgaHxx6w2b4ndsQouaTNLr4y1T",
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
    let content = open('./TC4.air');
    return content
        .replaceAll("worker_id", `"${options.fluence.worker_id}"`)
        .replaceAll("init_relay", `"${options.fluence.relay_peer_id}"`);
}();

const connection = retry(fluence.builder(options.fluence.relay).connect, 3);

export default  async function () {
    let file_name = (Math.random() + 1).toString(36).substring(7);
    let final_script = script.replaceAll("file_name", file_name);
    let _ = await connection.asyncExecute(final_script, options.fluence.default_timeout);
}

export function setup() {
    let start = new Date()
    return {start: start};
}

export function teardown(data) {
    const start = new Date(data.start)
    const end = new Date()
    fluence.injectPrometheusMetrics({
        "org_id": options.fluence.prometheus.org_id,
        "username": options.fluence.prometheus.username,
        "password": options.fluence.prometheus.password,
        "address": options.fluence.prometheus.address,
        "start": start,
        "end": end,
        "env": options.fluence.prometheus.env
    });
}

export function handleSummary(data) {
    return {
        "TC4_result.html": htmlReport(data),
        stdout: textSummary(data, {indent: " ", enableColors: true}),
    };
}

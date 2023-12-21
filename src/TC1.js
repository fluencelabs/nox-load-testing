import fluence from 'k6/x/fluence';
import {retry} from "./utils.js"
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {textSummary} from "https://jslib.k6.io/k6-summary/0.0.4/index.js";

export const options = {
    teardownTimeout: "2m",
    summaryTrendStats: ["min", "med", "p(90)", "p(99)", "max"],
    fluence: {
        relay: "/ip4/38.70.220.165/tcp/9991/ws/p2p/12D3KooWPr286GAaLxVXJqHR4bPWZdoxQkGBwUchruaopAUf6SPm",
        relay_peer_id: "12D3KooWPr286GAaLxVXJqHR4bPWZdoxQkGBwUchruaopAUf6SPm",
        default_timeout: 10 * 1000 * 1000 * 1000, //10 seconds
        prometheus: {
            address: "https://mimir.fluence.dev/prometheus",
            username: __ENV.K6_FLUENCE_PROMETHEUS_USERNAME,
            password: __ENV.K6_FLUENCE_PROMETHEUS_PASSWORD,
            org_id: "fluencelabs",
            env: "benchmark"
        }
    },
    scenarios: {
        execute: {
            executor: 'constant-arrival-rate',
            rate: 1000,
            timeUnit: '1s',
            duration: '10m',
            preAllocatedVUs: 1000,
        }
    }
};


const script = function () {
    let content = open('./TC1.air');
    return content.replaceAll("init_relay", `"${options.fluence.relay_peer_id}"`)
}();

const connection = retry(fluence.builder(options.fluence.relay).connect, 3);

export default async function () {
    try {
	    await connection.asyncExecute(script, options.fluence.default_timeout);
    } catch (e){
	if (e == "particle timeout"){
	    console.warn("Particle timeout");
	}else {
	    throw e;
	}
    }
}

export function setup() {
    let start = new Date()
    return {start: start};
}

export function teardown(data) {
    const start = new Date(data.start)
    const end = new Date()
 /*   fluence.injectPrometheusMetrics({
        "org_id": options.fluence.prometheus.org_id,
        "username": options.fluence.prometheus.username,
        "password": options.fluence.prometheus.password,
        "address": options.fluence.prometheus.address,
        "start": start,
        "end": end,
        "env": options.fluence.prometheus.env
    });*/
}

export function handleSummary(data) {
    return {
        "TC1_result.html": htmlReport(data),
        stdout: textSummary(data, {indent: " ", enableColors: true}),
    };
}

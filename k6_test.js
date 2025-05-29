import http from "k6/http";
import { check, sleep } from "k6";
import { Counter } from "k6/metrics";

const activeCounts = new Counter("activeCounts");
export const options = {
  stages: [
    { duration: "3s", target: 5 },
    { duration: "3s", target: 3 },
    { duration: "3s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(99)<1000"], // 99% of requests should be below 1s
  },
};

export default function () {
  const res = http.get("https://www.naver.com/");
  activeCounts.add(1);
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}

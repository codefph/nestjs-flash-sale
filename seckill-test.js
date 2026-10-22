import http from 'k6/http';
import { check, sleep } from 'k6';
import { scenario } from 'k6/execution';
export const options = {
  scenarios: {
    burst: {
      executor: 'constant-arrival-rate',
      rate: 2200,           // 略高于 2000，保证总量 >10000
      timeUnit: '1s',
      duration: '5s',       // 理论总请求 = 2200 × 5 = 11000
      preAllocatedVUs: 1000,
      maxVUs: 3000,
    },
  },
};
export default function () {
  const url = 'http://localhost:3000/seckill/order';
  const payload = JSON.stringify({
    userId :scenario.iterationInTest + 1,
    activityId: 3,
  });
  const params = { headers: { 'Content-Type': 'application/json' } };

  const res = http.post(url, payload, params);
  check(res, {
    '成功 (200)': (r) => r.status === 200 || r.status === 201,
    '已售罄 (400)': (r) => r.status === 400,
    '订单已存在 (409)': (r) => r.status === 409,
    '服务没找到 (404)': (r) => r.status === 404,
    '服务器错误 (500)': (r) => r.status === 500,
  });
}
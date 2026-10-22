import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,        // 模拟 500 个并发虚拟用户
  duration: '1s', // 持续 30 秒
};

export default function () {
  const url = 'http://localhost:3000/seckill/order';
  const payload = JSON.stringify({
    userId: Math.floor(Math.random() * 10000), // 随机用户，模拟不同人抢购
    activityId: 3,
  });
  const params = { headers: { 'Content-Type': 'application/json' } };

  const res = http.post(url, payload, params);
  check(res, {
    '成功 (200)': (r) => r.status === 200 || r.status === 201,
    '已售罄 (400)': (r) => r.status === 400,
    '服务没找到 (404)': (r) => r.status === 404,
    '服务器错误 (500)': (r) => r.status === 500,
  });

  sleep(0.1); // 模拟用户操作间隔
}
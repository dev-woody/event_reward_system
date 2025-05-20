import axios from 'axios';

const GATEWAY = 'http://localhost:3000';
const USERS = [
  { username: 'seed_user',     password: '1234', role: 'USER'    },
  { username: 'seed_operator', password: '1234', role: 'OPERATOR'},
  { username: 'seed_auditor',  password: '1234', role: 'AUDITOR' },
  { username: 'seed_admin',    password: '1234', role: 'ADMIN'   },
];

async function seed() {
  try {
    console.log('🔁 Seed 시작...');

    // 회원가입
    for (const u of USERS) {
      await axios.post(`${GATEWAY}/auth/signup`, u);
      console.log(`✅ ${u.role} 가입 완료: ${u.username}`);
    }

    // 로그인 & 토큰 획득
    const tokens: Record<string,string> = {};
    for (const u of USERS) {
      const res = await axios.post<{ access_token: string }>(`${GATEWAY}/auth/login`, {
        username: u.username,
        password: u.password,
      });
      tokens[u.role] = res.data.access_token;
      console.log(`🔑 ${u.role} 로그인 완료 → token 저장 → tokens['${u.role}']`);
    }

    // 이벤트 생성 (Operator로)
    const opToken = tokens['OPERATOR'];
    const authHeader = { headers: { Authorization: `Bearer ${opToken}` } };

    const eventRes = await axios.post<{ _id: string }>(
      `${GATEWAY}/event/events`,
      {
        name: '출석 이벤트',
        condition: 'login_3days',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 86400000),
        isActive: true,
      },
      authHeader
    );
    const eventId = eventRes.data._id;
    console.log(`이벤트 생성 완료: ID=${eventId}`);

    // 보상 등록 (Operator로)
    await axios.post(
      `${GATEWAY}/event/events/${eventId}/rewards`,
      { type: 'POINT', amount: 100 },
      authHeader
    );
    console.log('보상 등록 완료');

    // 보상 요청 (User로)
    const userToken = tokens['USER'];
    const userHeader = { headers: { Authorization: `Bearer ${userToken}` } };
    const reqRes = await axios.post<{ _id: string }>(
      `${GATEWAY}/event/requests`,
      { eventId, userId: 'seed_user' },
      userHeader
    );
    console.log(`보상 요청 완료: reqId=${reqRes.data._id}`);

    console.log('Seed 작업 전체 완료!');
    console.log('--- 발급된 토큰 ---');
    console.table(tokens);
  } catch (err: any) {
    console.error('Seed 실패:', err.response?.data || err.message);
  }
}

seed();

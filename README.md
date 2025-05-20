# 이벤트 / 보상 관리 플랫폼

NestJS 기반 MSA 구조로 구축된 이벤트 및 보상 자동화 백엔드 시스템입니다. 본 프로젝트는 **MapleStory World 백엔드 과제** 수행을 위해 기획·설계되었으며, 실무 기준의 책임 분리, 인증/인가 설계, 테스트 기반 개발을 중점으로 구성했습니다.

---

## 기획 의도

1. **MSA 아키텍처**

   * `gateway`, `auth`, `event` 3개 서비스로 분리하여 책임 구분 및 확장성 확보
2. **역할 기반 인증·인가**

   * JWT 기반 인증
   * `USER`, `OPERATOR`, `AUDITOR`, `ADMIN` 4개 역할 정의
   * `@nestjs/passport` + `JwtStrategy`, `RolesGuard` 로 권한 제어
3. **비즈니스 로직 자동화**

   * 이벤트 조건 검증 및 보상 요청/지급 프로세스 자동화
   * 승인 시 자동 보상 지급 기록 (`RewardHistory`)
4. **테스트 기반 개발**

   * 단위 테스트 (Jest) 및 e2e 테스트 (supertest)
5. **문서화 및 자동화**

   * Swagger UI
   * Seed 스크립트
   * Docker Compose

## 실행 방법

### 1. 환경 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음을 설정합니다:

```dotenv
MONGO_URI=mongodb://mongo:27017/reward
JWT_SECRET=<YOUR_SECRET>
```

### 2. Docker Compose

```bash
docker-compose up --build -d
```

### 3. Seed 스크립트

```bash
npm install axios ts-node @types/axios --save-dev
npx ts-node scripts/seed.ts
```

### 4. API 문서 (Swagger)

* Auth:  [http://localhost:3001/api](http://localhost:3001/api)
* Event: [http://localhost:3002/api](http://localhost:3002/api)
* Gateway: [http://localhost:3000/api](http://localhost:3000/api)

### 5. Postman 테스트

1. **Postman Collection 다운로드**

   * 레포지토리 내의 `event-reward-system.postman_collection.json` 파일을 사용합니다.

2. **Postman에 Import**

   * Postman 상단 `Import` 버튼 클릭 → `File` 탭 선택 → 다운로드한 파일 선택 후 `Import`
   * 또는 `Raw Text` 탭에 JSON 텍스트를 그대로 복사해 붙여넣을 수도 있지만, **중괄호 외 불필요한 문구를 제거**한 순수 JSON이어야 합니다.

3. **Environment 설정**

   ```text
   baseUrl     = http://localhost:3000
   userName    = seed_user
   userPass    = 1234
   userToken   = <USER JWT>
   opToken     = <OPERATOR JWT>
   auditorToken= <AUDITOR JWT>
   adminToken  = <ADMIN JWT>
   eventId     = <생성된 이벤트 ID>
   requestId   = <생성된 요청 ID>
   ```

4. **컬렉션 실행 순서**

   * `Auth / Signup` → `Auth / Login`
   * `Event / Create Event` → `Event / Create Reward`
   * `Requests / Create Request` → `Requests / Approve Request` → `Requests / Get Requests`

---

### 6. 단위·e2e 테스트. 단위·e2e 테스트 단위·e2e 테스트

```bash
cd apps/auth && npm run test && npm run test:e2e
cd apps/event && npm run test && npm run test:e2e
cd apps/gateway && npm run test && npm run test:e2e
```

---

**작성자**: 장우석

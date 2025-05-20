# apps/auth/Dockerfile
FROM node:18

WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# 프로덕션 실행
CMD ["node", "dist/main.js"]

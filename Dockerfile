# Node.js 20 버전의 공식 이미지 사용  
FROM node:20  

# 애플리케이션 디렉토리 생성  
WORKDIR /app  

# 의존성 파일 복사  
COPY package*.json ./  

# 의존성 설치  
RUN npm install  

# 애플리케이션 소스 복사  
COPY . .  

# 애플리케이션 실행  
CMD [ "npm", "start" ]  

# 컨테이너가 리스닝할 포트 설정  
EXPOSE 3030
# docker build -t back:test .
# docker run -d --name back -p 3030:3030 -v $(pwd):/app -v /app/node_modules back:test
# 호스트 디렉터리를 마운트하되, node_modules 디렉터리를 제외
# docker logs -f back

# 1. מתחילים ממחשב קטן שכבר יש בו Node 20
FROM node:20-alpine

# 2. תיקיית העבודה בתוך הקונטיינר
WORKDIR /app

# 3. קודם רק package.json, ואז התקנה (בלי nodemon)
COPY package*.json ./
RUN npm ci --omit=dev

# 4. עכשיו את כל שאר הקוד
COPY . .

# 5. הפורט שהשרת מאזין לו
ENV PORT=8000
EXPOSE 8000

# 6. הפקודה שמריצה את השרת
CMD ["node", "server.js"]

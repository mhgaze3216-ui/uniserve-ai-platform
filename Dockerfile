# استخدم صورة Node الرسمية
FROM node:18

# أنشئ مجلد داخل الحاوية
WORKDIR /app

# انسخ ملفات المشروع
COPY package*.json ./
RUN npm install

COPY . .

# شغّل التطبيق
CMD ["npm", "start"]

# افتح المنفذ 3000
EXPOSE 3000

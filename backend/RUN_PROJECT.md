# كيفية تشغيل مشروع UNSER1

## المتطلبات الأساسية
- Docker Desktop مثبت على جهازك
- Git (اختياري)

## خطوات التشغيل

### 1. فتح Terminal
- افتح Command Prompt أو PowerShell أو Terminal
- انتقل إلى مجلد المشروع:
```bash
cd "c:\Users\mghaz\Desktop\مشروع جامعة\UNSER1\backend"
```

### 2. تشغيل المشروع
- قم بتشغيل الأمر التالي:
```bash
docker-compose up --build -d
```

### 3. التحقق من تشغيل المشروع
- للتأكد أن كل شيء يعمل بشكل صحيح:
```bash
docker-compose ps
```
- يجب ترى status: "Up" لكلا الخدمين

### 4. فحص الـ logs (إذا لزم الأمر)
- لرؤية رسائل السيرفر:
```bash
docker logs unser1-backend
```

### 5. الوصول إلى المشروع
- **Backend API:** http://localhost:5000
- **MongoDB:** mongodb://admin:password123@localhost:27017/unser1?authSource=admin

## أوامر إضافية

### إيقاف المشروع
```bash
docker-compose down
```

### إعادة تشغيل المشروع
```bash
docker-compose down
docker-compose up --build -d
```

### رؤية الـ logs بشكل مستمر
```bash
docker logs -f unser1-backend
```

## مشاكل شائعة وحلولها

### إذا لم يعمل Docker
- تأكد أن Docker Desktop يعمل على جهازك
- أعد تشغيل Docker Desktop

### إذا ظهرت رسالة "Port already in use"
- قد يكون هناك برنامج آخر يستخدم نفس المنفذ
- أوقف البرنامج الآخر أو غيّر الـ port في docker-compose.yml

### إذا لم يعمل Backend
- تحقق من الـ logs باستخدام: `docker logs unser1-backend`
- أعد بناء المشروع: `docker-compose up --build -d`

## معلومات المشروع
- **اسم المشروع:** UNSER1 University Management System
- **الـ Backend:** Node.js + Express
- **قاعدة البيانات:** MongoDB
- **الـ Ports:** 5000 (Backend), 27017 (MongoDB)

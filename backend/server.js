const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const bookingRouter = require('./routes/booking.route');
const resourceRoutes = require('./routes/resource.route');
const multer = require('multer');

// สร้างแอป Express
const app = express();

// เชื่อมต่อ MongoDB
connectDB();

// กำหนดการเก็บไฟล์สำหรับการอัปโหลดภาพ
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// เส้นทางสำหรับการอัปโหลดภาพ
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    const filePath = `/uploads/${req.file.filename}`;
    res.status(200).json({ message: 'อัปโหลดไฟล์สำเร็จ', path: filePath });
  } else {
    res.status(400).json({ message: 'ไม่มีไฟล์ที่อัปโหลด' });
  }
});

// การตั้งค่า Middleware
app.use(express.json({ limit: '10mb' })); // กำหนดขนาดสูงสุดของ payload
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

//ให้ตั้งค่า CORS เพื่ออนุญาตให้ frontend เข้าถึง backend ได้
const corsOptions = {
  origin: 'http://localhost:4200', // Angular frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ให้บริการไฟล์ภาพจากโฟลเดอร์ uploads
app.use('/uploads', express.static(path.join(__dirname, 'routes/uploads')));
console.log('Serving files from:', path.join(__dirname, 'routes/uploads'));

// ตั้งค่าเส้นทาง
app.use('/api/bookings', bookingRouter);
app.use('/api/resources', resourceRoutes); // ใช้เส้นทาง resource

// เส้นทางหน้าแรก
app.get('/', (req, res) => {
  res.send('ยินดีต้อนรับสู่ Travel Resources ERP');
});

// Middleware สำหรับการจัดการข้อผิดพลาด
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'ข้อผิดพลาดภายในเซิร์ฟเวอร์' });
});

// เริ่มต้นเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`เซิร์ฟเวอร์กำลังทำงานที่ http://localhost:${PORT}`);
});
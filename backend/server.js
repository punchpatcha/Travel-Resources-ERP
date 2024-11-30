const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

const bookingRouter = require('./routes/booking.route');
app.use('/api/bookings', bookingRouter);

// เชื่อมต่อ MongoDB

connectDB();

// สร้างแอป Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ใช้เส้นทางสำหรับไฟล์ที่อัปโหลด

// ใช้ router สำหรับจัดการทรัพยากร
const resourceRouter = require('./routes/resource');
app.use('/api/resources', resourceRouter);

// ตั้งค่าหน้า root
app.get('/', (req, res) => {
    res.send('Welcome to the Travel Resources ERP');
});

// เริ่มต้น server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
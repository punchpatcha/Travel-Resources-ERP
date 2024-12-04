const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const bookingRouter = require('./routes/booking.route');
const resourceRoutes = require('./routes/resource.route');

// สร้างแอป Express
const app = express();

// เชื่อมต่อ MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Middleware for handling errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// ใช้ router
app.use('/api/bookings', bookingRouter);
app.use('/api/resources', resourceRoutes); // ของ add-booking

// ตั้งค่าหน้า root
app.get('/', (req, res) => {
    res.send('Welcome to the Travel Resources ERP');
});

app.put('/api/resources/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    Resource.findByIdAndUpdate(id, updates, { new: true })
      .then(updatedResource => res.json(updatedResource))
      .catch(err => res.status(500).send(err));
  });
  

  
// เริ่มต้น server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

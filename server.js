const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
let dotenv = require('dotenv')
dotenv.config();


 const { pool, runMigrations } = require('./config/db');
 const apiRouter = require('./routes');

// Middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { apiRateLimiter } = require('./middleware/rateLimiter');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(apiRateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

 app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await pool.query('SELECT 1');
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

 start();
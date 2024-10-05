const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const chatbotRoute = require('./routes/chatbot');

const app = express();

// Middleware to parse JSON and add security headers
app.use(express.json());
app.use(helmet()); // Adds extra headers to protect from well-known web vulnerabilities

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Neuromnia API',
      version: '1.0.0',
      description: 'API for the Neuromnia project managing VB-MAPP milestones',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
  },
  apis: ['./routes/*.js'], // paths to files containing Swagger annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Custom route for /api/chatbot
app.post('/api/chatbot', (req, res) => {
  try {
    const { inputValue, selectedDomain, selectedLevel } = req.body;

    if (!inputValue || !selectedDomain || !selectedLevel) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (inputValue.trim() === '') {
      return res.status(400).json({ error: 'Input value cannot be empty' });
    }

    const domainMap = {
      "Domain 1": "Domain 1",
      "Domain 2": "Domain 2",
    };

    const levelMap = {
      "Level 1": "Level 1",
      "Level 2": "Level 2",
    };

    if (!domainMap[selectedDomain] || !levelMap[selectedLevel]) {
      return res.status(400).json({ error: 'Invalid domain or level' });
    }

    const output = `You entered: ${inputValue}, Domain: ${domainMap[selectedDomain]}, Level: ${levelMap[selectedLevel]}`;
    res.json({ message: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/neuromnia', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

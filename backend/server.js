const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
const recipeRoutes = require('./routes/recipeRoutes');
const pantryRoutes = require('./routes/pantryRoutes');
const groceryRoutes = require('./routes/groceryRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/grocery', groceryRoutes);
app.use('/api/mealplan', mealPlanRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeFinder from './pages/RecipeFinder';
import GroceryList from './pages/GroceryList';
import MealPlanner from './pages/MealPlanner';
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe-finder" element={<RecipeFinder />} />
          <Route path="/grocery-list" element={<GroceryList />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

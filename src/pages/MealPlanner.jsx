import { useState, useEffect } from 'react';
import './MealPlanner.css';

const MealPlanner = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(getStartOfWeek());
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchMealPlans();
    fetchRecipes();
  }, [currentWeek]);

  function getStartOfWeek(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  const fetchMealPlans = async () => {
    try {
      const endDate = new Date(currentWeek);
      endDate.setDate(endDate.getDate() + 6);

      const response = await fetch(
        `http://localhost:5000/api/mealplan?startDate=${currentWeek.toISOString()}&endDate=${endDate.toISOString()}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch meal plans');
      const data = await response.json();
      setMealPlans(data);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/recipes');
      if (!response.ok) throw new Error('Failed to fetch recipes');
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const addMeal = async (date, mealType) => {
    if (!selectedRecipe) return;

    try {
      const response = await fetch('http://localhost:5000/api/mealplan/meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          meal: {
            recipe: selectedRecipe._id,
            mealType,
            servings: 1
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to add meal');
      const updatedMealPlan = await response.json();
      setMealPlans(mealPlans.map(mp => 
        mp._id === updatedMealPlan._id ? updatedMealPlan : mp
      ));
      setSelectedRecipe(null);
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  const deleteMeal = async (mealPlanId, mealId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/mealplan/${mealPlanId}/meal/${mealId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to delete meal');
      setMealPlans(mealPlans.map(mp => {
        if (mp._id === mealPlanId) {
          return {
            ...mp,
            meals: mp.meals.filter(meal => meal._id !== mealId)
          };
        }
        return mp;
      }));
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentWeek(getStartOfWeek(newDate));
  };

  const getDayMeals = (date) => {
    const mealPlan = mealPlans.find(mp => 
      new Date(mp.date).toDateString() === new Date(date).toDateString()
    );
    return mealPlan?.meals || [];
  };

  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeek);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handleAddMealClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleAddMealSubmit = async () => {
    if (!selectedRecipe || !selectedDate) return;
    
    await addMeal(selectedDate, selectedMealType);
    setShowModal(false);
    setSelectedDate(null);
    setSelectedRecipe(null);
  };

  return (
    <div className="planner">
      <div className="calendar">
        <div className="header">
          <h2 className="title">Meal Plan</h2>
          <div className="nav">
            <button className="btn" onClick={() => navigateWeek(-1)}>Previous</button>
            <button className="btn" onClick={() => navigateWeek(1)}>Next</button>
          </div>
        </div>

        <div className="grid">
          {getDates().map((date) => (
            <div key={date.toISOString()} className="day">
              <div className="day-title">
                {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              {getDayMeals(date).map(meal => (
                <div key={meal._id} className="meal">
                  <div className="meal-header">
                    <span className="meal-type">{meal.mealType}</span>
                    <button 
                      className="delete-meal"
                      onClick={() => deleteMeal(meal.mealPlan, meal._id)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="meal-content">
                    {meal.recipe.title}
                    <span className="servings">({meal.servings} servings)</span>
                  </div>
                </div>
              ))}
              <button 
                className="add-btn"
                onClick={() => handleAddMealClick(date)}
              >
                + Add Meal
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Add Meal</h3>
              <button 
                className="close-modal"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <select
              className="meal-type-select"
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value)}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>

            <div className="recipe-list">
              {recipes.map(recipe => (
                <div
                  key={recipe._id}
                  className={`recipe-option ${selectedRecipe?._id === recipe._id ? 'selected' : ''}`}
                  onClick={() => handleRecipeSelect(recipe)}
                >
                  <div>
                    <h4>{recipe.title}</h4>
                    <p>{recipe.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn"
              onClick={handleAddMealSubmit}
              disabled={!selectedRecipe}
              style={{ marginTop: '1rem', width: '100%' }}
            >
              Add to Meal Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner; 
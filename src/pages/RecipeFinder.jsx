import { useState, useEffect } from 'react';
import './RecipeFinder.css';

const RecipeFinder = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    description: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
    instructions: [''],
    imageUrl: '',
    prepTime: '',
    cookTime: '',
    servings: ''
  });

  const mockRecipes = [
    {
      id: 1,
      title: 'Pasta Carbonara',
      image: '/pasta.jpg',
      requiredIngredients: ['pasta', 'eggs', 'bacon', 'parmesan', 'black pepper'],
      description: 'Classic Italian pasta dish'
    },
    {
      id: 2,
      title: 'Chicken Stir Fry',
      image: '/stirfry.jpg',
      requiredIngredients: ['chicken', 'soy sauce', 'vegetables', 'garlic', 'ginger'],
      description: 'Quick and healthy stir fry'
    }
  ];

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addIngredient(inputValue.trim().toLowerCase());
    }
  };

  const addIngredient = (ingredient) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
    setInputValue('');
  };

  const removeIngredient = (ingredientToRemove) => {
    setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
  };

  const searchRecipes = async () => {
    if (ingredients.length === 0) return;

    try {
      const response = await fetch('http://localhost:5000/api/recipes/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch recipes');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching recipes:', error);
    }
  };

  const handleNewRecipeChange = (e, field, index = null) => {
    if (field === 'ingredients') {
      const updatedIngredients = [...newRecipe.ingredients];
      updatedIngredients[index][e.target.name] = e.target.value;
      setNewRecipe({ ...newRecipe, ingredients: updatedIngredients });
    } else if (field === 'instructions') {
      const updatedInstructions = [...newRecipe.instructions];
      updatedInstructions[index] = e.target.value;
      setNewRecipe({ ...newRecipe, instructions: updatedInstructions });
    } else {
      setNewRecipe({ ...newRecipe, [field]: e.target.value });
    }
  };

  const addIngredientField = () => {
    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, { name: '', amount: '', unit: '' }]
    });
  };

  const addInstructionField = () => {
    setNewRecipe({
      ...newRecipe,
      instructions: [...newRecipe.instructions, '']
    });
  };

  const handleSubmitRecipe = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
      });

      if (!response.ok) throw new Error('Failed to add recipe');
      setShowAddRecipe(false);
      setNewRecipe({
        title: '',
        description: '',
        ingredients: [{ name: '', amount: '', unit: '' }],
        instructions: [''],
        imageUrl: '',
        prepTime: '',
        cookTime: '',
        servings: ''
      });
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  return (
    <div className="finder">
      <div className="search">
        <div className="ingredients-input">
          <div className="tags">
            {ingredients.map((ing, index) => (
              <span key={index} className="tag">
                {ing}
                <button 
                  className="tag-remove" 
                  onClick={() => removeIngredient(ing)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            className="input"
            placeholder="Add ingredients"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
        </div>
        <button className="btn search-btn" onClick={searchRecipes}>Find Recipes</button>
        <button className="btn add-btn" onClick={() => setShowAddRecipe(true)}>Add New Recipe</button>
      </div>

      {showAddRecipe && (
        <div className="modal-overlay">
          <div className="modal recipe-form">
            <div className="modal-header">
              <h3 className="modal-title">Add New Recipe</h3>
              <button className="close-modal" onClick={() => setShowAddRecipe(false)}>×</button>
            </div>
            <form onSubmit={handleSubmitRecipe}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newRecipe.title}
                  onChange={(e) => handleNewRecipeChange(e, 'title')}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newRecipe.description}
                  onChange={(e) => handleNewRecipeChange(e, 'description')}
                  required
                />
              </div>

              <div className="form-group">
                <label>Ingredients</label>
                {newRecipe.ingredients.map((ing, index) => (
                  <div key={index} className="ingredient-row">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={ing.name}
                      onChange={(e) => handleNewRecipeChange(e, 'ingredients', index)}
                      required
                    />
                    <input
                      type="text"
                      name="amount"
                      placeholder="Amount"
                      value={ing.amount}
                      onChange={(e) => handleNewRecipeChange(e, 'ingredients', index)}
                      required
                    />
                    <input
                      type="text"
                      name="unit"
                      placeholder="Unit"
                      value={ing.unit}
                      onChange={(e) => handleNewRecipeChange(e, 'ingredients', index)}
                      required
                    />
                  </div>
                ))}
                <button type="button" className="btn" onClick={addIngredientField}>
                  Add Ingredient
                </button>
              </div>

              <div className="form-group">
                <label>Instructions</label>
                {newRecipe.instructions.map((instruction, index) => (
                  <div key={index} className="instruction-row">
                    <textarea
                      value={instruction}
                      onChange={(e) => handleNewRecipeChange(e, 'instructions', index)}
                      placeholder={`Step ${index + 1}`}
                      required
                    />
                  </div>
                ))}
                <button type="button" className="btn" onClick={addInstructionField}>
                  Add Step
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Prep Time (mins)</label>
                  <input
                    type="number"
                    value={newRecipe.prepTime}
                    onChange={(e) => handleNewRecipeChange(e, 'prepTime')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cook Time (mins)</label>
                  <input
                    type="number"
                    value={newRecipe.cookTime}
                    onChange={(e) => handleNewRecipeChange(e, 'cookTime')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Servings</label>
                  <input
                    type="number"
                    value={newRecipe.servings}
                    onChange={(e) => handleNewRecipeChange(e, 'servings')}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={newRecipe.imageUrl}
                  onChange={(e) => handleNewRecipeChange(e, 'imageUrl')}
                  required
                />
              </div>

              <button type="submit" className="btn submit-btn">Add Recipe</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid">
        {searchResults.map(recipe => (
          <div key={recipe._id} className="recipe">
            <img src={recipe.imageUrl} alt={recipe.title} className="recipe-img" />
            <div className="recipe-body">
              <h2 className="recipe-title">{recipe.title}</h2>
              <p className="recipe-text">{recipe.description}</p>
              <div className="match">
                <div className="match-bar">
                  <div 
                    className="match-fill" 
                    style={{ width: `${recipe.matchPercentage}%` }}
                  ></div>
                </div>
                <span className="match-text">
                  {Math.round(recipe.matchPercentage)}% match
                </span>
              </div>
              {recipe.missingIngredients.length > 0 && (
                <div className="missing">
                  <h3 className="missing-title">Missing Ingredients:</h3>
                  <ul className="missing-list">
                    {recipe.missingIngredients.map((ing, index) => (
                      <li key={index}>{ing}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeFinder; 
import { useState, useEffect } from 'react';
import './GroceryList.css';

const GroceryList = () => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Other');

  useEffect(() => {
    fetchGroceryItems();
  }, []);

  const fetchGroceryItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/grocery');
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching grocery items:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/grocery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: inputValue.trim(),
          quantity: 1,
          unit: 'unit',
          category: selectedCategory
        }),
      });

      if (!response.ok) throw new Error('Failed to add item');
      const newItem = await response.json();
      setItems([...items, newItem]);
      setInputValue('');
    } catch (error) {
      console.error('Error adding grocery item:', error);
    }
  };

  const toggleItemComplete = async (id, completed) => {
    try {
      const response = await fetch(`http://localhost:5000/api/grocery/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!response.ok) throw new Error('Failed to update item');
      const updatedItem = await response.json();
      setItems(items.map(item => 
        item._id === id ? updatedItem : item
      ));
    } catch (error) {
      console.error('Error updating grocery item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/grocery/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting grocery item:', error);
    }
  };

  return (
    <div className="grocery">
      <div className="add-section">
        <form className="form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            className="input"
            placeholder="Add an item..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Produce">Produce</option>
            <option value="Dairy">Dairy</option>
            <option value="Meat">Meat</option>
            <option value="Pantry">Pantry</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit" className="btn">Add</button>
        </form>
      </div>

      <div className="list">
        {items.map((item) => (
          <div key={item._id} className="item">
            <input
              type="checkbox"
              className="checkbox"
              checked={item.completed}
              onChange={() => toggleItemComplete(item._id, item.completed)}
            />
            <span className={`text ${item.completed ? 'checked' : ''}`}>
              {item.name}
            </span>
            <span className="category-tag">{item.category}</span>
            <button 
              className="delete"
              onClick={() => deleteItem(item._id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroceryList; 
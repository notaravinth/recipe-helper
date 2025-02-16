import './Pantry.css';

const Pantry = () => {
  return (
    <div className="pantry">
      <div className="header">
        <h1 className="title">My Pantry</h1>
        <button className="btn">Add Items</button>
      </div>

      <div className="categories">
        <div className="category">
          <h2 className="category-title">Dry Goods</h2>
          <div className="items">
            <div className="item">
              <span className="item-name">Rice</span>
              <span className="quantity">2 kg</span>
              <button className="update-btn">Update</button>
            </div>
            <div className="item">
              <span className="item-name">Pasta</span>
              <span className="quantity">500g</span>
              <button className="update-btn">Update</button>
            </div>
          </div>
        </div>

        <div className="category">
          <h2 className="category-title">Spices</h2>
          <div className="items">
            <div className="item">
              <span className="item-name">Black Pepper</span>
              <span className="quantity">100g</span>
              <button className="update-btn">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pantry; 
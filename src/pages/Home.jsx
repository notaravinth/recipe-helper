import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">Welcome to Your Daily Meal Planning App</h1>
        <p className="hero-text">
          Start planning your meals, finding recipes, and managing your grocery lists all in one place.
        </p>
      </section>
      
      <div className="features">
        <div className="card">
          <h2 className="card-title">Recipe Finder</h2>
          <p className="card-text">Discover new recipes and save your favorites.</p>
        </div>
        <div className="card">
          <h2 className="card-title">Meal Planning</h2>
          <p className="card-text">Plan your meals for the week with ease.</p>
        </div>
        <div className="card">
          <h2 className="card-title">Grocery List</h2>
          <p className="card-text">Automatically generate shopping lists from your meal plan.</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 
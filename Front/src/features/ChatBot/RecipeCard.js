// src/features/ChatBot/RecipeCard.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="card mb-4 mx-auto" style={{ maxWidth: '600px' }}>
      <div className="card-body">
        <h2 className="card-title text-center">{recipe.title}</h2>
        <p className="card-text">{recipe.description}</p>

        <h4 className="mt-4">재료 ({recipe.servingSize} 기준):</h4>
        <ul className="list-group list-group-flush">
          {recipe.ingredients.map((ingredient, idx) => (
            <li key={idx} className="list-group-item">{ingredient}</li>
          ))}
        </ul>

        <h4 className="mt-4">요리 과정:</h4>
        <ol className="list-group list-group-numbered">
          {recipe.steps.map((step, idx) => (
            <li key={idx} className="list-group-item">{step}</li>
          ))}
        </ol>

        <h4 className="mt-4">팁:</h4>
        <ul className="list-group list-group-flush">
          {recipe.tips.map((tip, idx) => (
            <li key={idx} className="list-group-item">{tip}</li>
          ))}
        </ul>

        <h4 className="mt-4">음료 추천:</h4>
        <p><strong>비알코올:</strong> {recipe.nonAlcoholicDrink}</p>
        <p><strong>알코올:</strong> {recipe.alcoholicDrink}</p>

        <h4 className="mt-4">영양 정보 (1인분):</h4>
        <ul className="list-group list-group-flush">
          {Object.entries(recipe.nutrition).map(([key, value], idx) => (
            <li key={idx} className="list-group-item">{`${key}: ${value}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeCard;

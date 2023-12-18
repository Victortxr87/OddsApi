import React, { useState, useEffect } from 'react';
import './ResultsComponent.css';

function ResultsComponent() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.the-odds-api.com/v4/sports/soccer_brazil_campeonato/scores/?daysFrom=1&apiKey=86112a2e36cf451c5792134e6a916d41'
        );
        const data = await response.json();

        // Filtrar apenas os resultados concluídos hoje
        const todayResults = data.filter(result => {
          const now = new Date();
          const gameTime = new Date(result.commence_time);
          return result.completed && gameTime.toDateString() === now.toDateString();
        });

        setResults(todayResults);
      } catch (error) {
        console.error('Erro ao obter dados:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="results-container">
      <h2>Resultados de Hoje - Campeonato Brasileiro</h2>
      <ul className="results-list">
        {results.map(result => (
          <li key={result.id} className="result-item">
            <strong>{result.home_team}</strong> {result.scores[0].score} - {result.scores[1].score} <strong>{result.away_team}</strong>
            <p>{result.completed ? 'Jogo Concluído' : 'Jogo em Andamento'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResultsComponent;

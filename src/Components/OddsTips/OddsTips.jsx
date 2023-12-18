import React, { useState, useEffect } from 'react';
import './OddsTips.css';

function OddsTips() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.the-odds-api.com/v4/sports/soccer_brazil_campeonato/odds/?apiKey=86112a2e36cf451c5792134e6a916d41&regions=us&markets=h2h&oddsFormat=decimal'
        );
        const data = await response.json();

        // Filtrar apenas os jogos da rodada atual
        const currentRoundGames = data.filter(game => {
          const now = new Date();
          const gameTime = new Date(game.commence_time);
          return gameTime > now;
        });

        setGames(currentRoundGames);
      } catch (error) {
        console.error('Erro ao obter dados:', error);
      }
    };

    fetchData();
  }, []);

  // Função para calcular a média dos preços
  const calcularMedia = outcomes => {
    const valoresNumericos = outcomes.filter(price => !isNaN(price));
    if (valoresNumericos.length === 0) return 0;
    const total = valoresNumericos.reduce((acc, outcome) => acc + outcome, 0);
    return total / valoresNumericos.length;
  };

  // Função para criar um identificador único para cada par de times
  const criarIdentificadorUnico = (awayTeam, homeTeam) => `${awayTeam} vs ${homeTeam}`;

  // Função para agrupar os jogos por par de times e calcular a média
  const agruparPorJogo = games.reduce((acc, game) => {
    const identificador = criarIdentificadorUnico(game.away_team, game.home_team);

    if (!acc[identificador]) {
      acc[identificador] = {
        away_team: game.away_team,
        home_team: game.home_team,
        media_precos_away: [],
        media_precos_home: [],
        media_precos_draw: [],
      };
    }

    game.bookmakers.forEach(bookmaker => {
      bookmaker.markets.forEach(market => {
        market.outcomes.forEach(outcome => {
          if (outcome.name === game.away_team) {
            acc[identificador].media_precos_away.push(outcome.price);
          } else if (outcome.name === game.home_team) {
            acc[identificador].media_precos_home.push(outcome.price);
          } else if (outcome.name === 'Draw') {
            acc[identificador].media_precos_draw.push(outcome.price);
          }
        });
      });
    });

    return acc;
  }, {});

 // Função para obter a sugestão com base na menor média (maior probabilidade de vitória)
const obterSugestao = jogo => {
  const mediaAway = calcularMedia(jogo.media_precos_away);
  const mediaHome = calcularMedia(jogo.media_precos_home);
  const mediaDraw = calcularMedia(jogo.media_precos_draw);

  if (mediaAway < mediaHome && mediaAway < mediaDraw) {
    return `O ${jogo.away_team} vence o jogo`;
  } else if (mediaHome < mediaAway && mediaHome < mediaDraw) {
    return `O ${jogo.home_team} vence o jogo`;
  } else {
    return 'Empate';
  }
};

return (
  <div className="app-container">
    <h1>Campeonato Brasileiros - Jogos da Rodada Atual</h1>
    <ul className="games-list">
      {Object.values(agruparPorJogo).map(jogo => (
        <li key={`${jogo.away_team}-${jogo.home_team}`} className="game-item">
          <strong>{jogo.away_team}</strong> vs <strong>{jogo.home_team}</strong>
          <p>Média dos Preços (Fora): {calcularMedia(jogo.media_precos_away).toFixed(2)}</p>
          <p>Média dos Preços (Casa): {calcularMedia(jogo.media_precos_home).toFixed(2)}</p>
          <p>Média dos Preços (Empate): {calcularMedia(jogo.media_precos_draw).toFixed(2)}</p>
          <p>Sugestão: {obterSugestao(jogo)}</p>
        </li>
      ))}
    </ul>
  </div>
);
}

export default OddsTips;

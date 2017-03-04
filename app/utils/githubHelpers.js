import axios from 'axios';

const id = "YOUR_CLIENT_ID";
const sec = "YOUR_SECRET_ID";
const param = `?client_id${id}&client_secret${sec}`;
function getUserInfo (username = 'dtran39') {
  return axios.get(`https://api.github.com/users/${username}${param}`);
}

function getRepos (username = 'dtran39') {
  return axios.get(`https://api.github.com/users/${username}/repos${param}&per_page=100`);
}

function getTotalStars (repos) {
  return repos.data.reduce((prev, current) => prev + current.stargazers_count, 0); // implicit return
}

function getPlayersData (player) {
  return getRepos(player.login)
    .then(getTotalStars)
    .then((totalStars) =>  {
      return {
        followers: player.followers,
        totalStars
      }
    })
}

function calculateScores (players) {
  return [
    players[0].followers * 3 + players[0].totalStars,
    players[1].followers * 3 + players[1].totalStars
  ]
}

export function  getPlayersInfo(players) {
  return axios.all(players.map((username) => getUserInfo(username) ))
  .then((info) => info.map((user) =>  user.data))
  .catch(function (err) {console.warn('Error in getPlayersInfo: ', err)})
}
export function  battle(players) {
  const playerOneData = getPlayersData(players[0]);
  const playerTwoData = getPlayersData(players[1]);
  return axios.all([playerOneData, playerTwoData])
    .then(calculateScores)
    .catch((err) => {console.warn('Error in getPlayersInfo: ', err)})
}

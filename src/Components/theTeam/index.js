import React, { Component } from 'react';
import { firebasePlayers, firebase } from '../../firebase';
import { firebaseLooper } from '../../helpers';
import Fade from 'react-reveal/Fade';
import PlayerCard from '../ui/playerCard';
import LinearProgress from '@material-ui/core/LinearProgress';

import Stripes from '../../Resources/images/stripes.png';
import Avatar from '../../Resources/images/avatar-player.png';
import { Promise } from 'core-js';

class TheTeam extends Component {

  state = {
    loading: true,
    players: []
  }

  componentDidMount() {
    firebasePlayers.once('value')
    .then(snapshot => {
      const players = firebaseLooper(snapshot);
      let promises = [];

      for(let key in players) {
        promises.push(
          new Promise((resolve, reject) => {
            firebase.storage().ref('players').child(players[key].image).getDownloadURL()
              .then(url => {
                players[key].url = url;
                resolve();
              })
              .catch(e => {
                players[key].url = Avatar
              })
              .finally(() => {
                this.setState({
                  loading: false,
                  players
                })
              })
          })
        )
      }

      Promise.all(promises)
        .then(() => {
          this.setState({
            loading: false,
            players
          })
        })
    });
  }

  showPlayersByCategory = (category) => (
    this.state.players ? (
      this.state.players.map((player, i) => {
        return player.position === category ? (
          <Fade
            left
            key={i}
          >
            <div className="item">
              <PlayerCard
                number={player.number}
                name={player.name}
                lastname={player.lastname}
                background={player.url}
              />
            </div>
          </Fade>
        ) : (
          null
        )
      })
    ) : (
      null
    )
  )

  render() {
    return (
      <div
        className="the_team_container"
        style={{
          background: `url(${Stripes}) repeat`
        }}
      >
        {
          !this.state.loading ? (
            <div>
              
              <div className="team_category_wrapper">
                <div className="title">Keepers</div>
                <div className="team_cards">
                  {this.showPlayersByCategory('Keeper')}
                </div>
              </div>

              <div className="team_category_wrapper">
                <div className="title">Defence</div>
                <div className="team_cards">
                  {this.showPlayersByCategory('Defence')}
                </div>
              </div>

              <div className="team_category_wrapper">
                <div className="title">Midfield</div>
                <div className="team_cards">
                  {this.showPlayersByCategory('Midfield')}
                </div>
              </div>

              <div className="team_category_wrapper">
                <div className="title">Striker</div>
                <div className="team_cards">
                  {this.showPlayersByCategory('Striker')}
                </div>
              </div>

            </div>
          ) : (
            <LinearProgress
              style={{
                color: '#98c5e9',
                position: 'fixed',
                left: '0',
                top: '92px',
                width: '100%'
              }}
            />
          )
        }
      </div>
    )
  }
}

export default TheTeam;
import React, { Component } from 'react';
import { easePolyOut } from 'd3-ease';
import Animate from 'react-move/Animate';
import PlayerCard from '../../ui/playerCard';
import { firebasePlayers } from '../../../firebase';
import { firebaseLooper } from '../../../helpers';
import Otamendi from '../../../Resources/images/players/Otamendi.png';

class HomeCards extends Component {

  state = {
    cards: []
  }

  componentDidMount() {
    firebasePlayers.limitToLast(4).once('value').then((snapshot) => {
      const players = firebaseLooper(snapshot);
      this.setState({
        cards: players
      });
    });
  }

  showCards = (maxBottom, maxLeft) => (
    this.state.cards.map((card, i) => {
      return (
        <Animate
          key={i}
          show={this.props.show}
          start={{
            bottom: 0,
            left: 0
          }}
          enter={{
            bottom: [maxBottom -= 30],
            left: [maxLeft -= 100],
            timing: { duration: 500, ease: easePolyOut }
          }}
        >
          {({bottom, left}) => {
            return (
              <div
                style={{
                  position: 'absolute',
                  bottom,
                  left
                }}
                attr={card.bottom}
              >
                <PlayerCard
                  number={card.number}
                  name={card.name}
                  lastname={card.lastname}
                  background={Otamendi}
                />
              </div>
            )
          }}
        </Animate>
      )
    })
  )

  render() {
    return (
      <div>
        {this.showCards(120, 400)}
      </div>
    )
  }
}

export default HomeCards;
import React, { Component } from 'react';
import Stripes from '../../../Resources/images/stripes.png';
import { Tag } from '../../ui/misc';
import HomeCards from './cards';
import Reveal from 'react-reveal/Reveal';

class MeetPlayers extends Component {

  state = {
    show: false
  }

  render() {
    return (
      <Reveal
        fraction={0.7}
        onReveal={() => {
          this.setState({show: true})
        }}
      >
        <div
          className="home_meetplayers"
          style={{background: `#fff url(${Stripes})`}}
        >
          <div className="container">
            <div className="home_meetplayers_wrapper">
              <div className="home_card_wrapper">
                <HomeCards
                  show={this.state.show}
                />
              </div>
              <div className="home_text_wrapper">
                <div>
                  <Tag background="#0e1731" color="#fff" fontSize="100px" add={{marginBottom:"20px"}}>
                    Meet
                  </Tag>
                  <Tag background="#0e1731" color="#fff" fontSize="100px" add={{marginBottom:"20px"}}>
                    The
                  </Tag>
                  <Tag background="#0e1731" color="#fff" fontSize="100px" add={{marginBottom:"20px"}}>
                    Players
                  </Tag>
                  <Tag background="#fff" color="#0e1731" fontSize="27" add={{
                    marginBottom: '27px',
                    border: '1px solid #0e1731'
                  }}
                    link={true}
                    linkTo="/the-team"
                  >
                    Meet team here
                  </Tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    )
  }
}

export default MeetPlayers;
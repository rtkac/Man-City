import React, { Component } from 'react';
import { easePolyOut } from 'd3-ease';
import Animate from 'react-move/Animate';

class Stripes extends Component {

  state = {
    stripes: [
      {
        background: '#98c5e9',
        left: 120,
        top: -260,
        delay: 0
      },
      {
        background: '#fff',
        left: 360,
        top: -397,
        delay: 200
      },
      {
        background: '#98c5e9',
        left: 600,
        top: -498,
        delay: 400
      }
    ]
  }
  
  showStripes = () => (
    this.state.stripes.map((stripe, i) => (
        <Animate
          key={i}
          show={true}
          start={{
            background: '#fff',
            opacity: 0,
            left: 0,
            top: 0,
            rotate: 0
          }}
          enter={{
            background: [stripe.background],
            opacity: [1],
            rotate: [25],
            left: [stripe.left],
            top: [stripe.top],
            timing: { duration: 200, delay: [stripe.delay], ease: easePolyOut }
          }}
        >
          {({opacity, background, rotate, left, top, delay}) => {
            return(
              <div
                className="stripe"
                style={{
                  opacity,
                  background,
                  transform: `rotate(${rotate}deg) translate(${left}px,${top}px)`
                }}
              >
              </div>
            )
          }}
        </Animate>
      )
    )
  )

  render() {
    return (
      <div className="featured_stripes">
        {this.showStripes()}
      </div>
    )
  }
}

export default Stripes;
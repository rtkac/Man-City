import React, { Component } from 'react';
import MatchesList from './matchesList';
import { firebase, firebaseMatches } from '../../firebase';
import { firebaseLooper, reverseArray } from '../../helpers';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';

class TheMatches extends Component {

  state = {
    loading: true,
    matches: [],
    filterMatches: [],
    playedFilter: 'All',
    resultFilter: 'All'
  }

  componentDidMount() {
    firebaseMatches.once('value')
      .then(snapshot => {
        const matches = firebaseLooper(snapshot);
        
        this.setState({
          loading: false,
          matches: reverseArray(matches),
          filterMatches: reverseArray(matches)
        });
      })
      .catch(e => {
        this.setState({
          loading: false
        })
      })
  }

  showMatches = (played) => {
    const list = this.state.matches.filter(match => {
      return match.final === played;
    });

    this.setState({
      filterMatches: played === 'All' ? this.state.matches : list,
      playedFilter: played,
      resultFilter: 'All'
    });
  }

  showResult = (result) => {
    const list = this.state.matches.filter(match => {
      return match.result === result;
    });

    this.setState({
      filterMatches: result === 'All' ? this.state.matches : list,
      playedFilter: 'All',
      resultFilter: result
    });
  }

  render() {
    const { loading, filterMatches, playedFilter, resultFilter } = this.state;
    return (
      <div className="the_matches_container" style={{minHeight: 'calc(100vh - 267px)'}}>
        {
          !loading ? (
            <div className="the_matches_wrapper">
              <div className="left">
                <div className="match_filters">
                  <div className="match_filters_box">
                    <div className="tag">
                      Show Match
                    </div>
                    <div className="cont">
                      <Button
                        size="small"
                        variant={playedFilter === 'All' ? 'contained' : 'outlined'}
                        color="primary"
                        style={{marginRight: '10px'}}
                        onClick={() => this.showMatches('All')}
                      >
                        All
                      </Button>
                      <Button
                        size="small"
                        variant={playedFilter === 'Yes' ? 'contained' : 'outlined'}
                        color="primary"
                        style={{marginRight: '10px'}}
                        onClick={() => this.showMatches('Yes')}
                      >
                        Played
                      </Button>
                      <Button
                        size="small"
                        variant={playedFilter === 'No' ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => this.showMatches('No')}
                      >
                        Not played
                      </Button>
                    </div>
                  </div>
                  <div className="match_filters_box">
                    <div className="tag">
                      Result game
                    </div>
                    <div className="cont">
                      <Button
                        size="small"
                        variant={resultFilter === 'All' ? 'contained' : 'outlined'}
                        color="primary"
                        style={{marginRight: '10px'}}
                        onClick={() => this.showResult('All')}
                      >
                        All
                      </Button>
                      <Button
                        size="small"
                        variant={resultFilter === 'W' ? 'contained' : 'outlined'}
                        color="primary"
                        style={{marginRight: '10px'}}
                        onClick={() => this.showResult('W')}
                      >
                        W
                      </Button>
                      <Button
                        size="small"
                        variant={resultFilter === 'L' ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => this.showResult('L')}
                      >
                        L
                      </Button>
                      <Button
                        size="small"
                        variant={resultFilter === 'D' ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => this.showResult('D')}
                      >
                        D
                      </Button>
                    </div>
                  </div>
                </div>
                <MatchesList matches={filterMatches} />
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

export default TheMatches;
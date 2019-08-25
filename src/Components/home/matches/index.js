import React from 'react';
import { Tag } from '../../ui/misc';
import Blocks from './Blocks';

const MatchesHome = () => {
  return (
    <div className="home_matches_wrapper">
      <div className="container">
        <Tag
          background="#0e1731"
          color="#fff"
          fontSize="50px"
        >
          Matches
        </Tag>
        <Blocks/>
        <Tag
          background="#fff"
          color="#0e1731"
          fontSize="20px"
          link={true}
          linkTo="the-matches"
        >
          See more matches
        </Tag>
      </div>
    </div>
  )
}

export default MatchesHome;
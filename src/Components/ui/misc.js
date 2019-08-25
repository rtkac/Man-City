import React from 'react';
import { Link } from 'react-router-dom';

export const Tag = (props) => {
  const template = <div
    style={{
      background: props.background,
      color: props.color,
      fontSize: props.fontSize,
      padding: '5px 10px',
      display: 'inline-block',
      fontFamily: 'Righteous',
      ...props.add
    }}
  >{props.children}</div>;

  if(props.link) {
    return (
      <Link to={props.linkTo}>
        {template}
      </Link>
    )
  } else {
    return template;
  }
}
import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import { firebase } from '../../../firebase';

const AdminNav = () => {

  const links = [
    {
      title: 'Matches',
      linkTo: '/admin/matches'
    },
    {
      title: 'Add Match',
      linkTo: '/admin/matches/add'
    },
    {
      title: 'Players',
      linkTo: '/admin/players'
    },
    {
      title: 'Add Player',
      linkTo: '/admin/players/add'
    }
  ]

  const style = {
    color: '#fff',
    fontWeight: '300',
    borderBotton: '1px solid #353535'
  }

  const logoutHandler = () => {
    firebase.auth().signOut()
      .then(() => {
        console.log('logout success');
      })
      .catch(error => {
        console.log('error logout');
      })
  }

  const renderItems = () => (
    links.map((link, i) => (
      <Link to={link.linkTo} key={i}>
        <ListItem button style={style}>
          {link.title}
        </ListItem>
      </Link>
    ))
  )

  return (
    <div>
      {renderItems()}
      <ListItem button style={style} onClick={() => logoutHandler()}>
        Logout
      </ListItem>
    </div>
  )
}

export default AdminNav;
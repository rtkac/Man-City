import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../Hoc/AdminLayout';

import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';

import { firebasePlayers } from '../../../firebase';
import { firebaseLooper, reverseArray } from '../../../helpers';

class AdminPlayers extends Component {

  state = {
    isLoading: true,
    players: []
  }

  componentDidMount() {
    firebasePlayers.once('value').then(snapshot => {
      const players = firebaseLooper(snapshot);

      this.setState({
        isLoading: false,
        players: reverseArray(players)
      });
    });
  }

  render() {
    const { isLoading, players } = this.state;

    return (
      <AdminLayout>
        <div>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>First name</TableCell>
                  <TableCell>Last name</TableCell>
                  <TableCell>Number</TableCell>
                  <TableCell>Postion</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              {
                players
                ?
                <TableBody>
                  {
                    players.map((player, i) => (
                      <TableRow key={i}>
                        <TableCell>{ player.name }</TableCell>
                        <TableCell>{ player.lastname }</TableCell>
                        <TableCell>{ player.number }</TableCell>
                        <TableCell>{ player.position }</TableCell>
                        <TableCell>
                          <Link to={`/admin/players/edit/${player.id}`} className="edit"><EditIcon/></Link>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
                :
                null
              }
            </Table>
          </Paper>
          {
            isLoading
            ?
              <LinearProgress style={{color: '#98c5e9'}} />
            :
              null
          }
        </div>
      </AdminLayout>
    )
  }
}

export default AdminPlayers;
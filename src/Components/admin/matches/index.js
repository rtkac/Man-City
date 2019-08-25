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

import { firebaseMatches } from '../../../firebase';
import { firebaseLooper, reverseArray } from '../../../helpers';

class AdminMatches extends Component {

  state = {
    isLoading: true,
    matches: []
  }

  componentDidMount() {
    firebaseMatches.once('value').then(snapshot => {
      const matches = firebaseLooper(snapshot);
      this.setState({
        isLoading: false,
        matches: reverseArray(matches)
      })
    })
  }

  render() {
    const { isLoading, matches } = this.state;

    return (
      <AdminLayout>
        <div>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Match</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Final</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              {
                matches
                ?
                <TableBody>
                  {
                    matches.map((match, i) => (
                      <TableRow key={i}>
                        <TableCell>{ match.date }</TableCell>
                        <TableCell>
                          { match.away } <strong>-</strong> { match.local }
                        </TableCell>
                        <TableCell>
                          { match.resultAway } <strong>-</strong> { match.resultLocal }
                        </TableCell>
                        <TableCell>
                          {
                            match.final === 'Yes'
                            ?
                              <span className="matches_tag_red">Final</span>
                            :
                              <span className="matches_tag_green">Not played yet</span>
                          }
                        </TableCell>
                        <TableCell>
                          <Link to={`/admin/matches/edit/${match.id}`} className="edit"><EditIcon/></Link>
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

export default AdminMatches;
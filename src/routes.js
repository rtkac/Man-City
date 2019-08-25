import React from 'react';
import Layout from './Hoc/Layout';
import { Switch, Route } from 'react-router-dom';

import NotFound from './Components/NotFound';
import SignIn from './Components/signin';
import Home from './Components/home';
import TheTeam from './Components/theTeam';
import TheMatches from './Components/theMatches';

import Dashboard from './Components/admin/Dashboard';
import AdminMatches from './Components/admin/matches';
import AddEditMatch from './Components/admin/matches/addEditMatch';
import AdminPlayers from './Components/admin/players';
import AddEditPlayer from './Components/admin/players/addEditPlayer';

import PrivateRoute from './Components/authRoute/privateRoute';
import PublicRoute from './Components/authRoute/publicRoute';

const Routes = (props) => {
  return (
    <Layout>
      <Switch>
        <PrivateRoute {...props} path="/admin" exact component={Dashboard} />
        <PrivateRoute {...props} path="/admin/matches" exact component={AdminMatches} />
        <PrivateRoute {...props} path="/admin/matches/add" exact component={AddEditMatch} />
        <PrivateRoute {...props} path="/admin/matches/edit/:id" exact component={AddEditMatch} />
        <PrivateRoute {...props} path="/admin/players" exact component={AdminPlayers} />
        <PrivateRoute {...props} path="/admin/players/add" exact component={AddEditPlayer} />
        <PrivateRoute {...props} path="/admin/players/edit/:id" exact component={AddEditPlayer} />
        <PublicRoute {...props} restricted={true} path="/signin" exact component={SignIn} />
        <PublicRoute {...props} restricted={false} path="/" exact component={Home} />
        <PublicRoute {...props} restricted={false} path="/the-team" exact component={TheTeam} />
        <PublicRoute {...props} restricted={false} path="/the-matches" exact component={TheMatches} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  )
}

export default Routes;
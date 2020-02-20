import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
  // {Link as RtLink}
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box'

import Home from './pages/Home';
import DriveList from './pages/DriveList';
import Status from './pages/Status';

// import logo from './logo.svg';
// import './App.css';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'white',

  },
  icon: {
    marginRight: theme.spacing(2),
  },
  main: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  footer: {
    // backgroundColor: theme.palette.background.paper,
    // padding: theme.spacing(6),
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
        theme.palette.type === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
  },
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://refoto.com.br/">
        ReFoto
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function App() {
  const classes = useStyles();

  return (
    <Router>
      <Box className={classes.root}>
        <CssBaseline />

        {/* Top Menu */}
        <AppBar position="relative">
          <Toolbar>
            <CameraIcon className={classes.icon} />
            <Typography variant="h6" color="inherit" noWrap>
              ReFoto!
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Block */}
        <Container component="main" className={classes.main} maxWidth="sm">
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/drive">
              <DriveList />
            </Route>
            <Route path="/status">
              <Status />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Container>

        {/* Footer */}
        <footer className={classes.footer}>
          <Container maxWidth="sm">
            <Typography variant="h6" align="center" gutterBottom>
              ReFoto
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
              Desenvolvido por: Rodrigo Werneck Franco
            </Typography>
            <Copyright />
          </Container>
        </footer>
        {/* End footer */}
      </Box>
    </Router>
  );
}

export default App;

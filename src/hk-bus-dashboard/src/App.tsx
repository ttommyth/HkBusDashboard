import React from 'react';
import logo from './logo.svg';
import './App.css';
import './i18n';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import routeConfig from './global/Routes';
import { renderRoutes, RouteConfig } from 'react-router-config';
import { Container, createTheme, useTheme } from '@material-ui/core';
import { LayoutView } from './functions/LayoutView';
//https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-router-config/react-router-config-tests.tsx
const App = ()=> {
  const theme = useTheme();
  return (
    <>
    <Router>
        <Switch>
          <LayoutView>

          <Container maxWidth="xl" style={{paddingTop:theme.spacing(2)}}>
                  
            {
            renderRoutes(routeConfig)
          }
          </Container>
          </LayoutView>
    </Switch>
    </Router>
    </>
  );
}

export default App;

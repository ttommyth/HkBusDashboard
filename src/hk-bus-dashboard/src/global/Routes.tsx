import * as React from 'react';
import { RouteConfig } from 'react-router-config';
import App from '../App';
import { HomeView } from '../functions';

const routeConfig: RouteConfig[] = [
    {
        path: '/:pasteKey?',
        component: HomeView,
        routes: [
        ]
    }
]

export default routeConfig;
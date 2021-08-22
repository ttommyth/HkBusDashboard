import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import { LazyGitHubAuthProvider } from './hooks/LazyGitHubAuthHook';

const queryClient = new QueryClient({
  defaultOptions:{
  }
})
const darkTheme = createTheme({
  palette: {
    type: 'dark',
  },
});

ReactDOM.render(
  <React.StrictMode>
  <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <LazyGitHubAuthProvider>
    <QueryClientProvider  client={queryClient}>
          <App />
    </QueryClientProvider>
    </LazyGitHubAuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

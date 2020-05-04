import React from 'react';

import ReactDOM from 'react-dom';

import App from './App';

import { MuiThemeProvider  } from '@material-ui/core/styles';

import theme  from './themes';

import { Provider } from 'react-redux';

import { store } from './appredux';

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </MuiThemeProvider>,
  document.getElementById('root')
);

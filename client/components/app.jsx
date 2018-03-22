import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { observer } from 'mobx-react';

import Header from 'components/header';
import Dashboard from 'components/pages/dashboard';

@observer
export default class App extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <Header />

        <Switch>
          <Route path="/" component={Dashboard} />
        </Switch>
      </div>
    );
  }
}

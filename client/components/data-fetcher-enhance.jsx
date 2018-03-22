import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ServerError from 'components/server-error';
import ContentBody from 'components/content-body';
import Preloader from 'components/preloader';

/*
 * Wrapper for decorate page component and fetch data into data stores.
 * fetchDataStoreNames - array of strings that are names of data stores
 * passed in component through props.
 */
export default (...fetchDataStoreNames) => WrappedComponent => (
  observer(class DataFetcherWrapper extends Component {
    constructor(props) {
      super(props);

      this.fetchStores = fetchDataStoreNames.map((storeName) => {
        const store = props[storeName];

        if (store === undefined) {
          throw new Error(`Store with name "${storeName}" must be in props`);
        }

        return props[storeName];
      });

      this.state = {
        isLoading: true,
        hasError: false,
      };
    }

    componentWillMount() {
      this.promises = [];

      // Trigger fetch action in all stores
      this.fetchStores.forEach((store) => {
        this.promises.push(store.fetch());
      });

      Promise.all(this.promises).then((data) => {
        if (this.mounted !== true) {
          return;
        }

        const isError = data.some(({ isSuccess }) => isSuccess !== true);

        if (isError) {
          this.setState({ hasError: true });

          return;
        }

        this.setState({ isLoading: false });
      });
    }

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;

      // Cancel all unfinished promises
      this.promises.forEach(promise => promise.cancel());
    }

    render() {
      if (this.state.hasError) {
        return (
          <ContentBody>
            <ServerError />
          </ContentBody>
        );
      }

      return (
        <ContentBody>
          {this.state.isLoading ? <Preloader /> : <WrappedComponent {...this.props} />}
        </ContentBody>
      );
    }
  })
);

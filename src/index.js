import Qs from 'qs';
import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

export default class extends Component {
  constructor(props) {
    super(props);

    if (props.onMessage) {
      window.addEventListener('message', this.onMessage, true);
    }

    if (props.source.method === 'POST') {
      const contentType = props.source.headers['Content-Type'];
      let body = '';
      if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
        body = Qs.parse(props.source.body);
      } else {
        console.warn('[WebView] Content type is not supported yet, please make a PR!', contentType);
        return;
      }

      window.open(
        require('./postMock.html') + '?' +
          Qs.stringify({
            uri: props.source.uri,
            body: JSON.stringify(body),
          })
      );
    }
  }

  onMessage = nativeEvent => nativeEvent.isTrusted && this.props.onMessage({ nativeEvent });

  render() {
    if (this.props.source.method === 'POST') {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <iframe
        src={this.props.source.uri}
        srcDoc={this.props.source.html}
        style={{ width: '100%', height: '100%', border: 0 }}
        allowFullScreen
        allowpaymentrequest="true"
        frameBorder="0"
        seamless
      />
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

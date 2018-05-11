/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated
} from 'react-native';

class Deck extends Component {


  render() {
    return (
      <View style={styles.container} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Deck;

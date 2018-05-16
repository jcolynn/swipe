/* @flow */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder
} from 'react-native';

class Deck extends Component {
  //normal constructor
  constructor(props) {
    super(props);
    //PanResponder is for Gesture recognition
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {

      },
      onPanResponderRelease: () => {}
    });
    this.state = { panResponder }; //Works as this.panResponder = panResponder;
  }

  //prop method renderCard
  renderCards() {
    return this.props.data.map(item => {
      return this.props.renderCard(item);
    });
  }

  render() {
    return (
      <View
        {...this.state.panResponder.panHandlers}
        style={styles.container}
      >
        {this.renderCards()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Deck;

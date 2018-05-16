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
  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    //PanResponder is for Gesture System
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      //Called many times in quick succession
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx ,y: gesture.dy })
      },
      onPanResponderRelease: () => {}
    });
    //Not supposed to mutate state
    this.state = { panResponder, position }; //Works as this.panResponder = panResponder; and this.position = position
  }

  //prop method renderCard
  renderCards() {
    return this.props.data.map(item => {
      return this.props.renderCard(item);
    });
  }

  render() {
    return (
      <Animated.View
        {...this.state.panResponder.panHandlers}
        style={this.state.position.getLayout()}
      >
        {this.renderCards()}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Deck;

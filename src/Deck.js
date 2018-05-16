/* @flow */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

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

  getCardStyle() {
    const { position } = this.state;
    //interpolation
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  }

  //prop method renderCard
  renderCards() {
    return this.props.data.map((item, index) => {
      if(index === 0) {
        return (
          <Animated.View
            {...this.state.panResponder.panHandlers}
            style={this.getCardStyle()}
          >
              {this.props.renderCard(item)}
          </Animated.View>
        );
      }
      return this.props.renderCard(item);
    });
  }

  render() {
    return (
      <View>
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

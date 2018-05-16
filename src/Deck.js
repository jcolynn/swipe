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

//Constants for Dimensions and hard coded numbers
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.35 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

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
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left')
        } else {
          this.resetPosition();
        }
      }
    });
    //Not supposed to mutate state
    this.state = { panResponder, position }; //Works as this.panResponder = panResponder; and this.position = position
  }

  //Helper function for swiping endpoint
  forceSwipe(direction) {
    //ternary expression to decide direction
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.state.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight } = this.props;
    //Callback to functions passed in as props
    direction === 'right' ? onSwipeRight() : onSwipeLeft();
  }

  //Helper function for resetting position of card to start
  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  //Style Card helper function that introduces rotation
  getCardStyle() {
    const { position } = this.state;
    //interpolation
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
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

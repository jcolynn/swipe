/* @flow */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager
} from 'react-native';

//Constants for Dimensions and hard coded numbers
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.35 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {}
  }

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
    this.state = { panResponder, position, index: 0 }; //Works as this.panResponder = panResponder; and this.position = position
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data !== this.props.data) {
      this.setState({ index: 0 });
    }
  }

  //For UI and Layout
  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
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
  //force exit and set up for next card in deck
  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight } = this.props;
    const item = this.props.data[this.state.index];

    //Callback to functions passed in as props
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);

    //update position and pass to next card
    this.state.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index+ 1 });
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
    //no more card
    if(this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }

    return this.props.data.map((item, id) => {
      if(id < this.state.index) { return null; }
      if(id === this.state.index) {
        return (
          <Animated.View
            key={item.id}
            {...this.state.panResponder.panHandlers}
            style={[this.getCardStyle(), styles.cardStyle]}
          >
              {this.props.renderCard(item)}
          </Animated.View>
        );
      }
      return (
        <Animated.View
          key={item.id}
          style={[styles.cardStyle, { top: 10 * (id - this.state.index) }]}
        >
          {this.props.renderCard(item)}
        </Animated.View>
      );
    }).reverse();
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
    paddingVertical: 50
  },
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH
  }
});

export default Deck;

/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated
} from 'react-native';

/*
Animation system runs outside of normal react native flow
only rerenders once
doesnt edit state for every pixel it changes
*/

class Ball extends Component {
  componentWillMount() {
    //Set current position for Ball using ValueXY
    //(Where is the item right now?)
    this.position = new Animated.ValueXY(0, 0);
    //Spring used to change current position
    //(Where is the element moving to?)
    Animated.spring(this.position, {
      toValue: { x: 200, y: 500 }
    }).start();
  }

  render() {
    return (
      {/*pass animation from componentWillMount
        Animated.View knows what to do with animation*/}
      <Animated.View style={this.position.getLayout()}>
        <View style={styles.container} />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: 'black'
  },
});

export default Ball;

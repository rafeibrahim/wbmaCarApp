import React from 'react';
import {Animated,
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView} from 'react-native';
import {mediaURL} from '../constants/urlConst';
import PropTypes from 'prop-types';
const deviceWidth = Dimensions.get('window').width;
const FIXED_BAR_WIDTH = 280;
const BAR_SPACE = 10;

const SimpleCarousel = (props) => {
  const numItems = props.images.length;
  const itemWidth = (FIXED_BAR_WIDTH / numItems) - ((numItems - 1) * BAR_SPACE);
  const animVal = new Animated.Value(0);


  const imageArray = [];
  const barArray = [];

  props.images.forEach((image, i) => {
    // console.log(image, i);
    const thisImage = (
      <Image
        key={`image${i}`}
        source={{uri: mediaURL + image.filename}}
        style={{width: deviceWidth}}
      />
    );
    imageArray.push(thisImage);
    // console.log('imageArray', imageArray);
    const scrollBarVal = animVal.interpolate({
      inputRange: [deviceWidth * (i - 1), deviceWidth * (i + 1)],
      outputRange: [-itemWidth, itemWidth],
      extrapolate: 'clamp',
    });

    const thisBar = (
      <View
        key={`bar${i}`}
        style={[
          styles.track,
          {
            width: itemWidth,
            marginLeft: i === 0 ? 0 : BAR_SPACE,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.bar,
            {
              width: itemWidth,
              transform: [
                {translateX: scrollBarVal},
              ],
            },
          ]}
        />
      </View>
    );
    barArray.push(thisBar);
    // console.log('barArray', barArray);
  });
  return (
    <View
      style={styles.container}
      flex={1}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={10}
        pagingEnabled
        onScroll={
          Animated.event(
              [{nativeEvent: {contentOffset: {x: animVal}}}],
          )
        }
      >
        {imageArray}
        <View
          style={styles.skip}
        >
          {/* <Text
            style={{backgroundColor: '#fff',
            color: '#F44',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center'}}>skip</Text> */}
        </View>
      </ScrollView>
      <View
        style={styles.barContainer}
      >
        {barArray}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barContainer: {
    position: 'absolute',
    zIndex: 2,
    bottom: 40,
    flexDirection: 'row',
  },
  skip: {
    position: 'absolute',
    zIndex: 2,
    bottom: 80,
    flexDirection: 'row',
  },
  track: {
    // backgroundColor: '#ccc',
    backgroundColor: 'red',
    overflow: 'hidden',
    height: 2,
  },
  bar: {
    // backgroundColor: '#5294d6',
    backgroundColor: 'yellow',
    height: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

// proptypes here
SimpleCarousel.propTypes = {
  images: PropTypes.array,
};
export default SimpleCarousel;

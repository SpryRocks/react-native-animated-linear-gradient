/* eslint-disable @typescript-eslint/no-use-before-define */
import {Animated, Easing, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {Component, PropsWithChildren} from 'react';
import NativeLinearGradient from 'react-native-linear-gradient';
import rgb2hex from 'rgb2hex';

type Color = string;

type Point = {x: number; y: number};

type Points = {start: Point; end: Point};

type LinearGradientProps = {
  color0: Color;
  color1: Color;
  points: Points;
  gradientStyle?: StyleProp<ViewStyle>;
};

class LinearGradient extends Component<PropsWithChildren<LinearGradientProps>> {
  render() {
    const {color0, color1, children, points, gradientStyle} = this.props;
    const gStart = points.start;
    const gEnd = points.end;
    return (
      <NativeLinearGradient
        colors={[color0, color1].map((c) => rgb2hex(c).hex)}
        start={gStart}
        end={gEnd}
        style={[!children && !gradientStyle && styles.fillHeight, gradientStyle]}
      >
        {children}
      </NativeLinearGradient>
    );
  }
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const presetColors = {
  instagram: [
    'rgb(106, 57, 171)',
    'rgb(151, 52, 160)',
    'rgb(197, 57, 92)',
    'rgb(231, 166, 73)',
    'rgb(181, 70, 92)',
  ],
  firefox: [
    'rgb(236, 190, 55)',
    'rgb(215, 110, 51)',
    'rgb(181, 63, 49)',
    'rgb(192, 71, 45)',
  ],
  sunrise: [
    'rgb(92, 160, 186)',
    'rgb(106, 166, 186)',
    'rgb(142, 191, 186)',
    'rgb(172, 211, 186)',
    'rgb(239, 235, 186)',
    'rgb(212, 222, 206)',
    'rgb(187, 216, 200)',
    'rgb(152, 197, 190)',
    'rgb(100, 173, 186)',
  ],
};

type AnimatedGradientProps = {
  style?: StyleProp<ViewStyle>;
  customColors: Color[];
  speed: number;
  useNativeDriver?: boolean;
  points: Points;
};

class AnimatedGradient extends Component<PropsWithChildren<AnimatedGradientProps>> {
  static defaultProps = {
    customColors: presetColors.instagram,
    speed: 4000,
    points: {
      start: {x: 0, y: 0.4},
      end: {x: 1, y: 0.6},
    },
  };

  state = {
    color0: new Animated.Value(0),
    color1: new Animated.Value(0),
  };

  componentDidMount = () => {
    this.startAnimation();
  };

  startAnimation = () => {
    const {color0, color1} = this.state;
    const {customColors, speed} = this.props;
    [color0, color1].forEach((color) => color.setValue(0));

    Animated.parallel(
      [color0, color1].map((animatedColor) => {
        return Animated.timing(animatedColor, {
          toValue: customColors.length,
          duration: customColors.length * speed,
          easing: Easing.linear,
          useNativeDriver: this.props.useNativeDriver || false,
        });
      }),
    ).start(this.startAnimation);
  };

  render() {
    const {color0, color1} = this.state;
    const {customColors, children, points, style} = this.props;
    const preferColors: Color[][] = [];
    while (preferColors.length < 2) {
      preferColors.push(
        customColors
          .slice(preferColors.length)
          .concat(customColors.slice(0, preferColors.length + 1)),
      );
    }
    const interpolatedColors = [color0, color1].map((animatedColor, index) => {
      return animatedColor.interpolate({
        inputRange: Array.from({length: customColors.length + 1}, (_, k) => k),
        outputRange: preferColors[index] ?? [],
      });
    });

    return (
      <AnimatedLinearGradient
        gradientStyle={style}
        points={points}
        color0={interpolatedColors[0] ?? ''}
        color1={interpolatedColors[1] ?? ''}
      >
        {children}
      </AnimatedLinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  fillHeight: {
    flex: 1,
  },
});

export default AnimatedGradient;

export {Color as GradientColor, Point as GradientPoint, Points as GradientPoints};

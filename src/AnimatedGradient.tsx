import {Animated, Easing, StyleProp, ViewStyle} from 'react-native';
import {Color, Point} from './types';
import {FC, PropsWithChildren, useEffect, useRef, useState} from 'react';
import {LinearGradient} from './LinearGradient';
import AnimatedValue = Animated.AnimatedValue;

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type AnimatedGradientProps = {
  style?: StyleProp<ViewStyle>;
  customColors: Color[];
  speed: number;
  useNativeDriver?: boolean;
  start: Point;
  end: Point;
};

const useAnimatedColor = (animatedValue: AnimatedValue) => {
  const [color, setColor] = useState(''); // начальное значение по умолчанию

  useEffect(() => {
    // Подписываемся на изменения animatedValue
    animatedValue.addListener(({value}) => {
      setColor(value as unknown as string);
    });

    // Очистка подписки при размонтировании
    return () => {
      animatedValue.removeAllListeners();
    };
  }, [animatedValue]);

  return color;
};

const interpolate = (
  animatedColor: Animated.Value,
  customColors: string[],
  preferColors: string[][],
  index: number,
) => {
  return animatedColor.interpolate({
    inputRange: Array.from({length: customColors.length + 1}, (_, k) => k),
    outputRange: preferColors[index] ?? [],
  });
};

export const AnimatedGradient: FC<PropsWithChildren<AnimatedGradientProps>> = (props) => {
  const color0 = useRef(new Animated.Value(0)).current;
  const color1 = useRef(new Animated.Value(0)).current;

  // force re-render
  useAnimatedColor(color0);

  useEffect(() => {
    const {customColors, speed} = props;
    [color0, color1].forEach((color) => color.setValue(0));

    const animation = Animated.loop(
      Animated.parallel(
        [color0, color1].map((animatedColor) => {
          return Animated.timing(animatedColor, {
            toValue: customColors.length,
            duration: customColors.length * speed,
            easing: Easing.linear,
            useNativeDriver: false,
          });
        }),
      ),
    );

    animation.start();

    return () => animation.stop();
  }, []);

  const {customColors, children, start, end, style} = props;
  const preferColors: Color[][] = [];
  while (preferColors.length < 2) {
    preferColors.push(
      customColors
        .slice(preferColors.length)
        .concat(customColors.slice(0, preferColors.length + 1)),
    );
  }

  return (
    <AnimatedLinearGradient
      gradientStyle={style}
      start={start}
      end={end}
      color0={interpolate(color0, customColors, preferColors, 0)}
      color1={interpolate(color1, customColors, preferColors, 1)}
    >
      {children}
    </AnimatedLinearGradient>
  );
};

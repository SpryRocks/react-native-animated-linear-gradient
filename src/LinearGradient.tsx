import {FC, PropsWithChildren} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import NativeLinearGradient from 'react-native-linear-gradient';
import {Point} from './types';
import rgb2hex from 'rgb2hex';

type LinearGradientProps = {
  color0: string;
  color1: string;
  start: Point;
  end: Point;
  gradientStyle?: StyleProp<ViewStyle>;
};

export const LinearGradient: FC<PropsWithChildren<LinearGradientProps>> = ({
  color0,
  color1,
  children,
  start,
  end,
  gradientStyle,
}) => {
  return (
    <NativeLinearGradient
      colors={[color0, color1].map((c) => rgb2hex(c).hex)}
      start={start}
      end={end}
      style={gradientStyle}
      children={children}
    />
  );
};

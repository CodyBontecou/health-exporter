'use strict';

import { hsvToColor, RGBtoHSV, rgbaColor, processColor, red, green, blue, opacity } from "./Colors.js";
import { makeMutable } from "./core.js";
import { Extrapolation, interpolate } from "./interpolation.js";
import { useSharedValue } from "./hook/useSharedValue.js";
import { ReanimatedError } from "./errors.js";

/** @deprecated Please use Extrapolation instead */
export const Extrapolate = Extrapolation;

/**
 * Options for color interpolation.
 *
 * @param gamma - Gamma value used in gamma correction. Defaults to `2.2`.
 * @param useCorrectedHSVInterpolation - Whether to reduce the number of colors
 *   the interpolation has to go through. Defaults to `true`.
 */

const interpolateColorsHSV = (value, inputRange, colors, options) => {
  'worklet';

  let h = 0;
  const {
    useCorrectedHSVInterpolation = true
  } = options;
  if (useCorrectedHSVInterpolation) {
    // if the difference between hues in a range is > 180 deg
    // then move the hue at the right end of the range +/- 360 deg
    // and add the next point in the original place + 0.00001 with original hue
    // to not break the next range
    const correctedInputRange = [inputRange[0]];
    const originalH = colors.h;
    const correctedH = [originalH[0]];
    for (let i = 1; i < originalH.length; ++i) {
      const d = originalH[i] - originalH[i - 1];
      if (originalH[i] > originalH[i - 1] && d > 0.5) {
        correctedInputRange.push(inputRange[i]);
        correctedInputRange.push(inputRange[i] + 0.00001);
        correctedH.push(originalH[i] - 1);
        correctedH.push(originalH[i]);
      } else if (originalH[i] < originalH[i - 1] && d < -0.5) {
        correctedInputRange.push(inputRange[i]);
        correctedInputRange.push(inputRange[i] + 0.00001);
        correctedH.push(originalH[i] + 1);
        correctedH.push(originalH[i]);
      } else {
        correctedInputRange.push(inputRange[i]);
        correctedH.push(originalH[i]);
      }
    }
    h = (interpolate(value, correctedInputRange, correctedH, Extrapolation.CLAMP) + 1) % 1;
  } else {
    h = interpolate(value, inputRange, colors.h, Extrapolation.CLAMP);
  }
  const s = interpolate(value, inputRange, colors.s, Extrapolation.CLAMP);
  const v = interpolate(value, inputRange, colors.v, Extrapolation.CLAMP);
  const a = interpolate(value, inputRange, colors.a, Extrapolation.CLAMP);
  return hsvToColor(h, s, v, a);
};
const toLinearSpace = (x, gamma) => {
  'worklet';

  return x.map(v => Math.pow(v / 255, gamma));
};
const toGammaSpace = (x, gamma) => {
  'worklet';

  return Math.round(Math.pow(x, 1 / gamma) * 255);
};
const interpolateColorsRGB = (value, inputRange, colors, options) => {
  'worklet';

  const {
    gamma = 2.2
  } = options;
  let {
    r: outputR,
    g: outputG,
    b: outputB
  } = colors;
  if (gamma !== 1) {
    outputR = toLinearSpace(outputR, gamma);
    outputG = toLinearSpace(outputG, gamma);
    outputB = toLinearSpace(outputB, gamma);
  }
  const r = interpolate(value, inputRange, outputR, Extrapolation.CLAMP);
  const g = interpolate(value, inputRange, outputG, Extrapolation.CLAMP);
  const b = interpolate(value, inputRange, outputB, Extrapolation.CLAMP);
  const a = interpolate(value, inputRange, colors.a, Extrapolation.CLAMP);
  if (gamma === 1) {
    return rgbaColor(r, g, b, a);
  }
  return rgbaColor(toGammaSpace(r, gamma), toGammaSpace(g, gamma), toGammaSpace(b, gamma), a);
};
const getInterpolateRGB = colors => {
  'worklet';

  const r = [];
  const g = [];
  const b = [];
  const a = [];
  for (let i = 0; i < colors.length; ++i) {
    const color = colors[i];
    const processedColor = processColor(color);
    // explicit check in case if processedColor is 0
    if (processedColor !== null && processedColor !== undefined) {
      r.push(red(processedColor));
      g.push(green(processedColor));
      b.push(blue(processedColor));
      a.push(opacity(processedColor));
    }
  }
  return {
    r,
    g,
    b,
    a
  };
};
const getInterpolateHSV = colors => {
  'worklet';

  const h = [];
  const s = [];
  const v = [];
  const a = [];
  for (let i = 0; i < colors.length; ++i) {
    const color = colors[i];
    const processedColor = processColor(color);
    if (typeof processedColor === 'number') {
      const processedHSVColor = RGBtoHSV(red(processedColor), green(processedColor), blue(processedColor));
      h.push(processedHSVColor.h);
      s.push(processedHSVColor.s);
      v.push(processedHSVColor.v);
      a.push(opacity(processedColor));
    }
  }
  return {
    h,
    s,
    v,
    a
  };
};

/**
 * Lets you map a value from a range of numbers to a range of colors using
 * linear interpolation.
 *
 * @param value - A number from the `input` range that is going to be mapped to
 *   the color in the `output` range.
 * @param inputRange - An array of numbers specifying the input range of the
 *   interpolation.
 * @param outputRange - An array of output colors values (eg. "red", "#00FFCC",
 *   "rgba(255, 0, 0, 0.5)").
 * @param colorSpace - The color space to use for interpolation. Defaults to
 *   'RGB'.
 * @param options - Additional options for interpolation -
 *   {@link InterpolationOptions}.
 * @returns The color after interpolation from within the output range in
 *   rgba(r, g, b, a) format.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/utilities/interpolateColor
 */

export function interpolateColor(value, inputRange, outputRange, colorSpace = 'RGB', options = {}) {
  'worklet';

  if (colorSpace === 'HSV') {
    return interpolateColorsHSV(value, inputRange, getInterpolateHSV(outputRange), options);
  } else if (colorSpace === 'RGB') {
    return interpolateColorsRGB(value, inputRange, getInterpolateRGB(outputRange), options);
  }
  throw new ReanimatedError(`Invalid color space provided: ${colorSpace}. Supported values are: ['RGB', 'HSV'].`);
}
export let ColorSpace = /*#__PURE__*/function (ColorSpace) {
  ColorSpace[ColorSpace["RGB"] = 0] = "RGB";
  ColorSpace[ColorSpace["HSV"] = 1] = "HSV";
  return ColorSpace;
}({});
export function useInterpolateConfig(inputRange, outputRange, colorSpace = ColorSpace.RGB, options = {}) {
  return useSharedValue({
    inputRange,
    outputRange,
    colorSpace,
    cache: makeMutable(null),
    options
  });
}
//# sourceMappingURL=interpolateColor.js.map
import { Dimensions, PixelRatio } from "react-native";

// 设备宽度，单位 dp
const deviceWidthDp = Dimensions.get("window").width;
const pixelRatio = PixelRatio.get();
// alert(deviceWidthDp + "==" + pixelRatio);

// 设计稿宽度（这里为640px,以iphone6为设计稿基准），单位 px
const uiWidthPx = 640;

// px 转 dp（设计稿中的 px 转 rn 中的 dp）
export default (pxtodp = uiElePx => {
  return (uiElePx * deviceWidthDp * pixelRatio) / uiWidthPx;
});

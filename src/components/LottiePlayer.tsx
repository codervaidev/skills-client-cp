import Lottie from "react-lottie";

type LottieOptions = {
  loop?: boolean;
  autoplay?: boolean;
  animationData: object;
  rendererSettings?: { preserveAspectRatio?: string };
};

type Props = {
  options: LottieOptions;
  height: string | number;
  width: string | number;
};

export default function LottiePlayer({ options, height, width }: Props) {
  return <Lottie options={options} height={height} width={width} />;
}

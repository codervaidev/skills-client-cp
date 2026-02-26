import Lottie from "react-lottie";
import celebrationLottieData from "@/pages/course-details/[courseId]/Animation - 1711894031153.json";

const lottieOptions = {
  loop: true,
  autoplay: true,
  animationData: celebrationLottieData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

type Props = {
  height: string | number;
  width: string | number;
};

export default function CelebrationLottie({ height, width }: Props) {
  return <Lottie options={lottieOptions} height={height} width={width} />;
}

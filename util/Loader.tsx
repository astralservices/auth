import Lottie from "react-lottie";
import * as animationData from "./LottieLoader.json";

export default function Loader() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Lottie
        options={defaultOptions}
        height={128}
        width={128}
        isClickToPauseDisabled
      />
    </div>
  );
}

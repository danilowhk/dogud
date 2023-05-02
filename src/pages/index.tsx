import { useState } from "react";
import NextImage from "next/image";
import StepFollow from "../components/StepFollow";
import Step1Screen from "../components/Steps/Step1Screen";
import Step2Screen from "../components/Steps/Step2Screen";
import Step3Screen from "../components/Steps/Step3Screen";
import Logo from "../../public/logo-dogud.jpeg";

export default function Home() {
  const [steps, setSteps] = useState(1);

  return (
    <main className="flex bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black h-full flex-col min-h-screen justify-center">
      <div className="flex justify-center pb-5">
        <NextImage src={Logo} width={100} height={100} alt="logo" />
      </div>
      <div className="flex flex-col relative h-full items-center justify-center border-4 border-white mx-20 p-10 rounded-[30px]">
        <StepFollow steps={steps} />
        {steps === 1 && <Step1Screen setSteps={setSteps} />}
        {steps === 2 && <Step2Screen setSteps={setSteps} />}
        {steps === 3 && <Step3Screen />}
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";

import HeadingGradientTextsGreen from "@/src/components/Texts/HeadingGradientTexts";
import OnBoardingInputs from "../components/onBoardingInput";
import { LocationIcon } from "@/src/lib/utilities/icons";
import ImageUpload from "@/src/components/features/ImageUpload";

export default function CompanyDetails() {
  return (

    <div
      className={`w-full flex flex-col items-center justify-center grow z-10 max-md:px-3`}
    >
      {/* Header Section */}
      <HeadingGradientTextsGreen
        top=""
        bottom="Lets brand your CRM"
        gradient="var(--gradient-text-gray)"
      />
      <p
        style={{ marginTop: "-2rem", marginBottom: "5rem" }}
        className="text-b2 text-var(--color-text-gray) flex items-center justify-center text-center max-md:!mb-12 max-sm:!mb-8 max-sm:px-4"
      >
        Add your logo and address to complete your personalized setup
      </p>
      <OnBoardingInputs
        Icon={LocationIcon}
        label="Company address"
        placeholder="Search or type your full address"
      />
      <ImageUpload />
      <OnBoardingInputs
        Icon={LocationIcon}
        label=""
        placeholder="Paste image Url"
      />

      {/* <div className="h-20 opacity-0">space</div> */}
    </div>
  );
}




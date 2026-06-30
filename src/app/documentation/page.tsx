import { AnimatedTutorial } from "@/components/documentation/AnimatedTutorial";

export const metadata = {
  title: "Documentation | RoboEdu QC Hub",
};

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-16 px-4">
      <AnimatedTutorial />
    </div>
  );
}

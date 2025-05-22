
import LoveLanguages from "@/components/LoveLanguages";

const LoveLanguagesPage = () => {
  return (
    <div className="container px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Love Languages</h1>
      <p className="text-muted-foreground mb-8">
        Discover, understand, and act on the ways you and your partner express and receive love.
      </p>
      <LoveLanguages />
    </div>
  );
};

export default LoveLanguagesPage;

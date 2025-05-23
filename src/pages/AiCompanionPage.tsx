
import AiCompanion from "@/components/AiCompanion";

const AiCompanionPage = () => {
  return (
    <div className="container px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Bloom - AI Relationship Companion</h1>
      <p className="text-muted-foreground mb-8">
        Chat with Bloom, your AI relationship companion, for personalized advice, guidance, and support for your relationship journey.
      </p>
      <AiCompanion />
    </div>
  );
};

export default AiCompanionPage;

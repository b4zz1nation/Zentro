import { PlaceholderPanel } from "./placeholder-panel";

type SectionGridProps = {
  sections: Array<{
    title: string;
    description: string;
    items: string[];
  }>;
};

export function SectionGrid({ sections }: SectionGridProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {sections.map((section) => (
        <PlaceholderPanel
          key={section.title}
          title={section.title}
          description={section.description}
          items={section.items}
        />
      ))}
    </div>
  );
}

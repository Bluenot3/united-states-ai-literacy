const programSlots = [
  "AI Pioneer Program",
  "Vanguard",
  "Web3 Literacy",
  "Homeschool Kit",
  "Train-a-Trainer",
];

const Index = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-8">
    <h1 className="text-3xl font-semibold tracking-tight text-foreground">ZEN Programs Staging</h1>
    <p className="mt-2 text-muted-foreground text-center max-w-xl">
      Temporary integration shell for stabilizing program modules before merging into Arsenal.
    </p>

    <div className="mt-12 w-full max-w-3xl">
      <h2 className="text-lg font-medium text-foreground mb-4">Integration Slots</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {programSlots.map((name) => (
          <div
            key={name}
            className="rounded-lg border border-border bg-card p-5 text-card-foreground"
          >
            <span className="text-sm font-medium">{name}</span>
            <p className="mt-1 text-xs text-muted-foreground">Awaiting integration</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Index;

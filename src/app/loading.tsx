export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 mesh-bg">
      <div className="animate-pulse flex flex-col items-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-primary/20 shadow-inner flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/40"></div>
        </div>
        <div className="space-y-3 flex flex-col items-center">
          <div className="w-48 h-6 bg-foreground/10 rounded-full"></div>
          <div className="w-32 h-4 bg-foreground/5 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

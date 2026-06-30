export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Top action bar skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="h-10 w-64 bg-foreground/10 rounded-xl"></div>
        <div className="h-10 w-32 bg-primary/20 rounded-xl"></div>
      </div>
      
      {/* Stats/Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-surface-variant rounded-[2rem] border border-border p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-foreground/5"></div>
              <div className="w-8 h-8 rounded-full bg-foreground/5"></div>
            </div>
            <div className="w-1/2 h-6 bg-foreground/10 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="h-96 w-full bg-surface-variant rounded-[2rem] border border-border p-6 flex flex-col gap-4">
        <div className="w-48 h-8 bg-foreground/10 rounded-xl"></div>
        <div className="space-y-3 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-full h-12 bg-foreground/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

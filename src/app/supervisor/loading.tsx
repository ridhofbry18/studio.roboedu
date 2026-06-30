export default function SupervisorLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Top action bar skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="h-10 w-64 bg-foreground/10 rounded-xl"></div>
        <div className="h-10 w-32 bg-primary/20 rounded-xl"></div>
      </div>
      
      {/* Stats/Cards skeleton for Supervisor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-surface-variant rounded-[2rem] border border-border p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-foreground/5"></div>
              <div className="w-8 h-8 rounded-full bg-foreground/5"></div>
            </div>
            <div className="w-1/2 h-6 bg-foreground/10 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Main Table/List Area Skeleton */}
      <div className="h-[500px] w-full bg-surface-variant rounded-[2rem] border border-border p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="w-48 h-8 bg-foreground/10 rounded-xl"></div>
          <div className="w-32 h-8 bg-foreground/5 rounded-full"></div>
        </div>
        
        {/* Table header skeleton */}
        <div className="w-full h-10 bg-foreground/10 rounded-xl mt-4"></div>
        
        {/* Table rows skeleton */}
        <div className="space-y-3 flex-1 overflow-hidden mt-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="w-full h-16 bg-foreground/5 rounded-xl flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10"></div>
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-foreground/10 rounded-md"></div>
                  <div className="w-24 h-3 bg-foreground/5 rounded-md"></div>
                </div>
              </div>
              <div className="w-20 h-6 bg-primary/10 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

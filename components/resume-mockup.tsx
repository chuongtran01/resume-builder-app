export function ResumeMockup() {
  return (
    <div className="w-full max-w-md mx-auto lg:mx-0">
      <div className="bg-background border border-border p-8 space-y-6">
        {/* Header Section */}
        <div className="space-y-2 border-b border-border pb-4">
          <div className="h-4 bg-foreground/20 w-3/4 rounded"></div>
          <div className="h-3 bg-foreground/10 w-1/2 rounded"></div>
        </div>

        {/* Summary Section */}
        <div className="space-y-2">
          <div className="h-3 bg-foreground/15 w-1/4 rounded mb-3"></div>
          <div className="space-y-2">
            <div className="h-2 bg-foreground/10 w-full rounded"></div>
            <div className="h-2 bg-foreground/10 w-5/6 rounded"></div>
            <div className="h-2 bg-foreground/10 w-4/5 rounded"></div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="space-y-4">
          <div className="h-3 bg-foreground/15 w-1/3 rounded"></div>
          <div className="space-y-3 pl-4 border-l-2 border-border">
            <div className="space-y-2">
              <div className="h-2.5 bg-foreground/12 w-2/3 rounded"></div>
              <div className="h-2 bg-foreground/8 w-1/4 rounded"></div>
              <div className="h-2 bg-foreground/10 w-full rounded mt-2"></div>
              <div className="h-2 bg-foreground/10 w-4/5 rounded"></div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-2">
          <div className="h-3 bg-foreground/15 w-1/4 rounded"></div>
          <div className="flex flex-wrap gap-2">
            <div className="h-6 bg-foreground/10 w-16 rounded"></div>
            <div className="h-6 bg-foreground/10 w-20 rounded"></div>
            <div className="h-6 bg-foreground/10 w-18 rounded"></div>
            <div className="h-6 bg-foreground/10 w-14 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

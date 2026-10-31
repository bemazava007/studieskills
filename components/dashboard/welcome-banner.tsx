import { Progress } from "@/components/ui/progress"

export function WelcomeBanner() {
  return (
    <div className="rounded-xl bg-primary p-5 text-primary-foreground sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-bold sm:text-2xl">Bienvenue, Anderson</h2>
          <p className="mt-1 text-sm text-primary-foreground/80">
            {"Suivez vos progres et decouvrez de nouvelles opportunites."}
          </p>
        </div>
        <div className="flex items-center gap-3 sm:min-w-48">
          <Progress value={80} className="h-2.5 flex-1 bg-primary-foreground/20" />
          <span className="shrink-0 text-sm font-bold">80%</span>
        </div>
      </div>
    </div>
  )
}

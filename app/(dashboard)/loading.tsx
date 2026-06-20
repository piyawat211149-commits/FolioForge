export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl border-2 border-indigo-100 dark:border-indigo-900 border-t-indigo-500 animate-spin" />
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-[pulse_1.5s_ease-in-out_infinite]" />
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-[pulse_1.5s_ease-in-out_0.3s_infinite]" />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-[pulse_1.5s_ease-in-out_0.6s_infinite]" />
        </div>
      </div>
    </div>
  )
}

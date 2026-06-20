export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-[#07070f]/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 animate-[spin_3s_linear_infinite] opacity-30 blur-lg" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]">
            <span className="text-white font-extrabold text-xl">F</span>
          </div>
        </div>
        {/* Dots */}
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-[bounce_1.4s_ease-in-out_infinite]" />
          <div className="w-2 h-2 rounded-full bg-violet-500 animate-[bounce_1.4s_ease-in-out_0.2s_infinite]" />
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-[bounce_1.4s_ease-in-out_0.4s_infinite]" />
        </div>
      </div>
    </div>
  )
}

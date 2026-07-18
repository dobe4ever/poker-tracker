// components/Widget.tsx

export default function Widget({ title }: { title: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 min-h-[250px] flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-zinc-400 dark:text-zinc-500">
        {title} Component
      </h2>
      <p className="text-sm text-zinc-400 mt-2">
        Complex subcomponents will go here.
      </p>
    </div>
  );
}

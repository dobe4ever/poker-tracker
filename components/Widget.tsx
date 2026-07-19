// components/Widget.tsx

export default function Widget({ title }: { title: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 min-h-[100px] flex flex-col items-center justify-center">
      <h2 className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
        {title} Placeholder
      </h2>
    </div>
  );
}

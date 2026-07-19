// // components/Widget.tsx

// export default function Widget({ title }: { title: string }) {
//   return (
//     <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 min-h-[100px] flex flex-col items-center justify-center">
//       <h2 className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
//         {title} Placeholder
//       </h2>
//     </div>
//   );
// }



// components/Widget.tsx

export default function Widget({ title }: { title: string }) {
  return (
    <div
      className="rounded-xl p-4 min-h-[100px] flex flex-col items-center justify-center"
      style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--surface-3)", boxShadow: "var(--shadow-card)" }}
    >
      <h2 className="text-sm font-semibold" style={{ color: "var(--text-tertiary)" }}>
        {title} placeholder
      </h2>
    </div>
  );
}

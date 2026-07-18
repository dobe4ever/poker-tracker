// app/page.tsx

import Header from "@/components/Header";
import Widget from "@/components/Widget";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Header />
      
      {/* 
        Main scrollable content area. 
        pt-20 ensures content starts below the 16px (4rem) header.
        overflow-y-auto allows vertical scrolling.
      */}
      <main className="flex-1 overflow-y-auto pt-20 pb-8 px-4 space-y-6 w-full max-w-md mx-auto">
        <Widget title="Widget 1" />
        <Widget title="Widget 2" />
        <Widget title="Widget 3" />
      </main>
    </div>
  );
}

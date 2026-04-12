"use client";
import Posts from "@/app/posts/page";


export default function Home() {
  return (
    <>
    <div className="h-screen">
      <h1 className="font-bergamasco font-light text-[15rem]">DIARY</h1>
      <h3 className="font-passions text-5xl text-right">Съешь ещё этих мягких<br/> французских булок</h3>
    </div>
      <Posts />
    </>
  );
}

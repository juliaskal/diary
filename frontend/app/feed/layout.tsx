export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="py-8 md:py-10">
      <div className="max-w-5xl text-center justify-center mx-auto">
        {children}
      </div>
    </section>
  );
}

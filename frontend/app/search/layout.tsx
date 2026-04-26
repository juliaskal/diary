export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {children}
      </div>
    </section>
  );
}

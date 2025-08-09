// app/page.js
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Tailwind is working!</h1>
      <p className="mt-4 text-lg text-gray-700">
        If you can see this styled, you're good to go.
      </p>
      <div className="mt-6 p-4 bg-white rounded shadow test-tailwind">
        This box uses custom Tailwind class!
      </div>
    </main>
  );
}

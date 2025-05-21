// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Welcome to MyNotes
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            A simple, modern note-taking app to organize your thoughts, ideas, and tasks in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition shadow-md"
            >
              Go to Dashboard
            </Link>
            <Link href="/create"
              className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition shadow-md"
            >
              Create a New Note
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-2xl mb-3">✏️</div>
              <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Create, edit, and organize your notes with a clean and intuitive interface.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-2xl mb-3">🏷️</div>
              <h3 className="text-xl font-semibold mb-2">Tag System</h3>
              <p className="text-gray-600">
                Organize your notes with tags to easily find related content.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-2xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast & Responsive</h3>
              <p className="text-gray-600">
                Built with Next.js and React for a smooth, responsive experience.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
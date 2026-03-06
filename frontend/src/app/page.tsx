import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden p-10 space-y-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
          Personal Diary App
        </h1>

        <div className="space-y-4 text-gray-600">
          <p className="text-xl">Your secure place to store daily life notes permanently.</p>
          <div className="pt-4 pb-2 border-t border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Team Members:</h3>
            <p>1. Shrinivas</p>
            {/* Add more team members as needed */}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">College:</h3>
            <p>The National Institute of Engineering, Mysuru</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Link href="/login" className="flex-1 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all text-lg">
            Login
          </Link>
          <Link href="/signup" className="flex-1 px-8 py-4 bg-white text-indigo-600 font-bold border-2 border-indigo-100 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all text-lg">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

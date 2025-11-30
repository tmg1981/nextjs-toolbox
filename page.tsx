export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-5xl font-bold text-white mb-4">Welcome to AffiliateFlow</h1>
      <p className="text-xl text-gray-300 mb-8">Generate high-converting affiliate blog posts in seconds with AI</p>
      <a href="/create" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-white font-semibold text-lg transition">
        Create Your First Post
      </a>
    </div>
  );
}
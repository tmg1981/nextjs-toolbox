'use client';
import { useState, useEffect } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

interface Post {
  id: string;
  title: string;
  previewHtml: string;
  images: string[];
  createdAt: string;
}

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ liveUrl?: string; message?: string } | null>(null);

  useEffect(() => {
    // اینجا پست‌های ذخیره‌شده رو از localStorage یا API می‌گیریم
    const saved = localStorage.getItem('affiliatePosts');
    if (saved) {
      setPosts(JSON.parse(saved));
    }
  }, []);

  const handlePublish = async (post: Post) => {
    setSelectedPost(post);
    setPublishing(true);
    setPublishResult(null);

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: post.previewHtml,
          images: post.images,
          title: post.title || 'Affiliate Review'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPublishResult({ liveUrl: data.liveUrl, message: data.message });

        // دانلود خودکار ZIP
        const link = document.createElement('a');
        link.href = data.zip;
        link.download = `${post.title || 'post'}.zip`;
        link.click();
      } else {
        alert('خطا: ' + data.error);
      }
    } catch (error) {
      alert('خطای اتصال به سرور');
    }
    setPublishing(false);
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-gray-400">هنوز پستی نساختی!</h2>
        <a href="/create" className="mt-4 inline-block bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700">
          اولین پست رو بساز
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">My Posts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
            <div className="h-48 bg-gray-700 border-2 border-dashed border-gray-600" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{post.title || 'بدون عنوان'}</h3>
              <p className="text-sm text-gray-400 mb-4">
                {new Date(post.createdAt).toLocaleDateString('fa-IR')}
              </p>

              <div className="flex gap-3">
                <button className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg text-sm">
                  پیش‌نمایش
                </button>
                <button
                  onClick={() => handlePublish(post)}
                  disabled={publishing}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 py-2 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition"
                >
                  <GlobeAltIcon className="w-5 h-5" />
                  {publishing && selectedPost?.id === post.id ? 'در حال انتشار...' : 'Publish Live'}
                </button>
              </div>

              {publishResult && selectedPost?.id === post.id && (
                <div className="mt-4 p-4 bg-emerald-900/50 border border-emerald-700 rounded-lg text-sm">
                  <p className="text-emerald-300 font-medium mb-2">موفقیت!</p>
                  <a href={publishResult.liveUrl} target="_blank" className="text-cyan-400 underline break-all">
                    {publishResult.liveUrl}
                  </a>
                  <p className="text-gray-400 mt-2 text-xs">ZIP دانلود شد</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
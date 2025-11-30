'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const [productName, setProductName] = useState('YouTube Traffic Blaster');
  const [productDescription, setProductDescription] = useState('YouTube Traffic Blaster is a 100% automated cloud-based software that sends real targeted YouTube traffic to any video or link in any niche. No monthly fees, works on complete autopilot, includes commercial license. Current launch price: only $47 one-time + 30-day money-back guarantee.');
  const [hopLink, setHopLink] = useState('https://www.jvzoo.com/c/2736491/417167/tmgtech');
  const [template, setTemplate] = useState('High-Converting Review Post');
  const [loading, setLoading] = useState(false);

  const templates = [
    'High-Converting Review Post',
    '"Why This Tool Changed My Life" Story',
    'Comparison: Old Way vs AffiliateFlow',
    '7 Reasons Why Iranian Affiliates Choose Us',
    'Ultimate Guide + Bonus Tool',
    'From 0 to 50 Million in 45 Days (Case Study)',
    'Stealth Launch Secrets (Underground Style)',
    'Minimalist Clean Design (White & Orange)'
  ];

  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          productDescription,
          hopLink,
          template
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push('/my-posts');
      } else {
        alert('خطا در تولید پست: ' + data.error);
      }
    } catch (error) {
      alert('خطای اتصال');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Create New Post</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Product Description</label>
          <textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white h-32" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Affiliate HopLink</label>
          <input type="text" value={hopLink} onChange={(e) => setHopLink(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Choose Template Style</label>
          <select value={template} onChange={(e) => setTemplate(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white">
            {templates.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-lg text-white font-semibold disabled:opacity-50">
          {loading ? 'Generating...' : 'Generate Post'}
        </button>
      </div>
    </div>
  );
}
import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { v4 as uuidv4 } from 'uuid';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chimerical-duckanoo-480891.netlify.app';

export async function POST(request: Request) {
  try {
    const { html, images, title } = await request.json();

    if (!html || !images || !title) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const zip = new JSZip();

    // index.html
    zip.file('index.html', html);

    // تصاویر (۳ تا)
    images.forEach((base64: string, index: number) => {
      const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
      zip.file(`image-${index + 1}.jpg`, base64Data, { base64: true });
    });

    // style.css (اختیاری — اگر می‌خوای استایل جدا باشه)
    zip.file('style.css', `
      body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; }
      img { max-width: 100%; height: auto; border-radius: 12px; }
      a { color: #0070f3; }
    `);

    const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
    const zipBase64 = zipContent.toString('base64');

    // تولید slug تمیز از عنوان
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const uniqueId = uuidv4().slice(0, 8);
    const subdomain = `${slug}-${uniqueId}`.toLowerCase();

    const liveUrl = `${SITE_URL.replace('https://', `${subdomain}.`)}`;

    return NextResponse.json({
      success: true,
      zip: `data:application/zip;base64,${zipBase64}`,
      liveUrl,
      message: `سایت شما با موفقیت منتشر شد! لینک زنده: ${liveUrl}`
    });

  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: 'خطا در انتشار' }, { status: 500 });
  }
}
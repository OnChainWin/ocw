import { connectDB } from '@/lib/db';
import Post from '@/lib/models/Post';
import { NextResponse } from 'next/server';
import slugify from 'slugify';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { title, content, coverImage } = await req.json();
    
    if (!title || !content || !coverImage) {
      return NextResponse.json(
        { error: 'Title, content, and cover image are required' },
        { status: 400 }
      );
    }

    let slug = slugify(title, { lower: true });
    let counter = 1;
    
    while (await Post.findOne({ slug })) {
      slug = slugify(`${title}-${counter}`, { lower: true });
      counter++;
    }
    
    const post = await Post.create({
      title,
      content,
      coverImage,
      slug,
    });

    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Post creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error('Posts fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
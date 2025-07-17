import { connectDB } from '@/lib/db';
import Post from '@/lib/models/Post';
import { NextResponse } from 'next/server';
import slugify from 'slugify';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const post = await Post.findOne({ slug: params.slug });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const { title, content, coverImage } = await request.json();
    
    if (!title || !content || !coverImage) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const post = await Post.findOne({ slug: params.slug });
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Update the post
    post.title = title;
    post.content = content;
    post.coverImage = coverImage;

    // Only update slug if title changed
    if (title !== post.title) {
      let newSlug = slugify(title, { lower: true });
      let counter = 1;
      
      // Ensure unique slug
      while (await Post.findOne({ slug: newSlug, _id: { $ne: post._id } })) {
        newSlug = slugify(`${title}-${counter}`, { lower: true });
        counter++;
      }
      
      post.slug = newSlug;
    }

    await post.save();
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const post = await Post.findOneAndDelete({ slug: params.slug });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
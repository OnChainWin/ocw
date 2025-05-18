import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { PenLine } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import Post from "@/lib/models/Post";
import { useAccount } from "wagmi";
import Write from "./_components/Write";

// Function to strip HTML and get plain text preview
function getTextPreview(html: string) {
  const text = html.replace(/<[^>]*>/g, " ");
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length > 200 ? cleaned.substring(0, 200) + "..." : cleaned;
}

async function getPosts() {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 });
    return posts;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">All Blog Posts</h1>
        <Write />
      </div>
      {posts.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            No posts yet. Be the first to write one!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <Link key={post._id} href={`/blog/${post.slug}`}>
              <Card className="overflow-hidden hover:bg-muted/50 transition-colors h-full flex flex-col">
                <div className="relative aspect-video">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-fill"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {format(new Date(post.createdAt), "MMMM d, yyyy")}
                  </p>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {getTextPreview(post.content)}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// app/blog/[slug]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import EditDelete from "../_components/EditDelete"; // Adjust the import path as needed

interface Post {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  slug: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export default function BlogPost() {
  const params = useParams();
  const { slug } = params;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data: Post = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex justify-between">
        <Link href={"/blog"} className="mb-4">
          <Button>Blog Home</Button>
        </Link>
        <Link
          href={"/play"}
          className="mb-4"
        >
          <Button className="bg-black/80 hover:bg-black/70">Play Now</Button>
        </Link>
      </div>
      <Card className="overflow-hidden">
        <div className="relative aspect-[2/1]">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-top object-fill"
            priority
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
              <div className="text-muted-foreground">
                {format(new Date(post.createdAt), "dd MMMM yyyy")}
              </div>
            </div>
            <EditDelete slug={post.slug} />
          </div>
          <article className="max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="blog-content [&_p]:mb-0 [&_p:empty]:h-6 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4"
            />
          </article>
        </div>
      </Card>
    </div>
  );
}

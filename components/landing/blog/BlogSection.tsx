import React from "react";
import GlowCard from "../helper/glow-card";
import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import Post from "@/lib/models/Post";
import { format } from "date-fns";

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
    console.error("Gönderiler alınamadı:", error);
    return [];
  }
}

const BlogSection = async () => {
  const posts = await getPosts();

  return (
    <section className="container relative z-50 border-t my-12 lg:my-24 border-black dark:border-white">
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent w-full" />
        </div>
      </div>

      <div className="text-orange-500 text-[24px] my-24 flex justify-center uppercase tracking-widest">
        ▶︎ Blog ◀︎
      </div>

      <div>
        <section className="container relative z-50 my-12 lg:my-24">

          <div className="py-8 items-center text-center justify-center flex">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
              {posts.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  There are no posts yet. Be the first to write one!
                </p>
              ) : (
                posts.map((post) => (
                  <GlowCard key={post._id} identifier={`post-${post._id}`}>
                    <Link href={`/blog/${post.slug}`}>
                      <article className="h-full flex flex-col overflow-hidden rounded-lg">
                        <div className="relative aspect-video w-full">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-fit"
                          />
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h2 className="text-xl font-medium mb-3 line-clamp-2">
                            {post.title}
                          </h2>
                          <p className="text-md leading-8 mb-4 line-clamp-3">
                            {getTextPreview(post.content)}
                          </p>
                          <div className="mt-auto">
                            <p className="text-xs sm:text-sm text-orange-500 hover:text-orange-700 inline-block border border-orange-500 px-3 py-2 hover:bg-orange-100 rounded-lg cursor-pointer">
                              Read More
                            </p>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </GlowCard>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default BlogSection;

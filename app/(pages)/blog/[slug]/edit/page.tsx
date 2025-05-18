"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageIcon, Pen, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { useAccount } from "wagmi";
import NotFoundPage from "@/app/not-found";

const TipTapEditor = dynamic(() => import("@/components/editor/TipTapEditor"), {
  ssr: false,
});

export default function EditPost({ params }: { params: { slug: string } }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const account = useAccount();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.slug}`);
        if (!response.ok) throw new Error("Post not found");
        const post = await response.json();

        setTitle(post.title);
        setContent(post.content);
        setCoverImage(post.coverImage);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load post",
          variant: "destructive",
        });
        router.push("/");
      } finally {
        setIsLoadingPost(false);
      }
    };

    fetchPost();
  }, [params.slug, router, toast]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setCoverImage(data.url);
      toast({
        title: "Image uploaded",
        description: "Your cover image has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverImageAdd = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !coverImage) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${params.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, coverImage }),
      });

      if (!response.ok) throw new Error("Failed to update post");

      const post = await response.json();

      toast({
        title: "Post updated! 🎉",
        description: "Your blog post has been successfully updated.",
      });

      router.push(`/blog/${post.slug}`);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error updating post",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPost) {
    return (
      <div className="container max-w-4xl py-10">
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      {account.address == "0x0C81eAb0896b32AAB44175872462cC4126AaB0F7" ? (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Pen className="w-6 h-6" />
            <h1 className="text-3xl font-bold">Edit Post</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCoverImageAdd}
                  className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Change Cover Image
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              {coverImage && (
                <div className="relative aspect-video mt-2 rounded-lg overflow-hidden">
                  <Image
                    src={coverImage}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <TipTapEditor content={content} onChange={setContent} />
            </div>
            <div className="flex gap-4">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <NotFoundPage />
      )}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageIcon, Pen, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { useAccount } from "wagmi";
import NotFoundPage from "../../not-found";

const TipTapEditor = dynamic(() => import("@/components/editor/TipTapEditor"), {
  ssr: false,
});

const isValidImageUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const account = useAccount();

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
        description: "Your cover image has been uploaded successfully.",
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

  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your blog post.",
        variant: "destructive",
      });
      return false;
    }

    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please write some content for your blog post.",
        variant: "destructive",
      });
      return false;
    }

    if (!coverImage) {
      toast({
        title: "Cover image required",
        description: "Please add a cover image for your blog post.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, coverImage }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create post");
      }

      const post = await response.json();

      toast({
        title: "Post published! 🎉",
        description: "Your blog post has been successfully published.",
      });

      router.push(`/blog/${post.slug}`);
    } catch (error: any) {
      toast({
        title: "Error publishing post",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-10">
      {account.address == "0x0C81eAb0896b32AAB44175872462cC4126AaB0F7" ? (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Pen className="w-6 h-6" />
            <h1 className="text-3xl font-bold">Write a New Post</h1>
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
                  {coverImage ? "Change Cover Image" : "Upload Cover Image"}
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
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? "Publishing..." : "Publish Post"}
            </Button>
          </form>
        </Card>
      ) : (
        <NotFoundPage />
      )}
    </div>
  );
}

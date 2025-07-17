"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { MenuBar } from "./MenuBar";
import { useEffect } from "react";

export default function TipTapEditor({
  content = "",
  onChange,
  editable = true,
}: {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-4",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "mb-0",
          },
        },
      }),
      Typography,
      Link.configure({
        openOnClick: false,
      }),
      Highlight,
      Image,
      Placeholder.configure({
        placeholder: "Write your post content here...",
      }),
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none min-h-[400px] focus:outline-none p-4",
      },
    },
    onUpdate: ({ editor }) => {
      // Preserve line breaks by replacing them with <br> tags
      const html = editor.getHTML().replace(/<p><\/p>/g, "<p><br></p>");
      onChange(html);
    },
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div className="border rounded-md">
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}

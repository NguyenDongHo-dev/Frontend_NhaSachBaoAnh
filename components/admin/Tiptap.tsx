"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

interface TextEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function TextEditor({ value, onChange }: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      TextStyle,
      StarterKit,
      Underline,
      Link,
      Image,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Đồng bộ dữ liệu từ props.value vào editor
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  const toolbarButton = (label: string, action: () => void, active = false) => (
    <button
      type="button"
      onClick={action}
      className={`px-2 py-1 border rounded ${active ? "bg-gray-300" : ""}`}
    >
      {label}
    </button>
  );

  return (
    <div className="border rounded p-2">
      {/* Toolbar */}
      <div className="flex gap-1 flex-wrap mb-2">
        {toolbarButton(
          "B",
          () => editor.chain().focus().toggleBold().run(),
          editor.isActive("bold")
        )}
        {toolbarButton(
          "I",
          () => editor.chain().focus().toggleItalic().run(),
          editor.isActive("italic")
        )}
        {toolbarButton(
          "U",
          () => editor.chain().focus().toggleUnderline().run(),
          editor.isActive("underline")
        )}
        {toolbarButton(
          "H1",
          () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          editor.isActive("heading", { level: 1 })
        )}
        {toolbarButton(
          "H2",
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          editor.isActive("heading", { level: 2 })
        )}
        {toolbarButton(
          "• List",
          () => editor.chain().focus().toggleBulletList().run(),
          editor.isActive("bulletList")
        )}
        {toolbarButton(
          "1. List",
          () => editor.chain().focus().toggleOrderedList().run(),
          editor.isActive("orderedList")
        )}
        {toolbarButton(
          "Left",
          () => editor.chain().focus().setTextAlign("left").run(),
          editor.isActive({ textAlign: "left" })
        )}
        {toolbarButton(
          "Center",
          () => editor.chain().focus().setTextAlign("center").run(),
          editor.isActive({ textAlign: "center" })
        )}
        {toolbarButton(
          "Right",
          () => editor.chain().focus().setTextAlign("right").run(),
          editor.isActive({ textAlign: "right" })
        )}
        {toolbarButton("Image", () => {
          const url = prompt("Image URL");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        })}
        {toolbarButton("Link", () => {
          const url = prompt("Link URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        })}
        <input
          type="color"
          onInput={(e) =>
            editor
              .chain()
              .focus()
              .setColor((e.target as HTMLInputElement).value)
              .run()
          }
          title="Chọn màu chữ"
        />
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="border p-2 min-h-[150px]" />
    </div>
  );
}

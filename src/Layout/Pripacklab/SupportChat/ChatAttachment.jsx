/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { MdAttachFile, MdInsertDriveFile, MdClose, MdFileDownload } from "react-icons/md";
import { base_url } from "../../../config/config";

// Keep in sync with CHAT_MAX_FILE_SIZE / CHAT_ALLOWED_EXTS in rBackend/src/middleware/upload.js
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPT =
  ".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.ai,.psd,.eps,.cdr";

const IMAGE_EXT = /\.(jpe?g|png|gif|webp)$/i;

const isImageAttachment = (attachment) =>
  attachment?.type?.startsWith("image/") || IMAGE_EXT.test(attachment?.url || "");

const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const uploadChatFile = async (file) => {
  if (file.size > MAX_FILE_SIZE) throw new Error("File is too large (max 20 MB)");

  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${base_url}/schat/upload`, { method: "POST", body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data;
};

// Paperclip button: picks a file, uploads it, then hands the attachment back.
export const AttachButton = ({ onUploaded, onError, disabled }) => {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsUploading(true);
    onError?.("");
    try {
      onUploaded(await uploadChatFile(file));
    } catch (err) {
      onError?.(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept={ACCEPT} className="hidden" onChange={handleChange} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || isUploading}
        title="Attach a file"
        className="px-2 text-gray-500 dark:text-slate-400 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <span className="block h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <MdAttachFile className="h-5 w-5" />
        )}
      </button>
    </>
  );
};

// Chip above the input showing the file that will go out with the next message.
export const PendingAttachment = ({ attachment, onRemove, error }) => {
  if (!attachment && !error) return null;
  return (
    <div className="px-2 pt-2 bg-white dark:bg-slate-900">
      {error && <p className="text-xs text-red-500">{error}</p>}
      {attachment && (
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-gray-700 dark:text-slate-200">
          <MdInsertDriveFile className="h-4 w-4 text-blue-500 shrink-0" />
          <span className="truncate flex-1">{attachment.name}</span>
          <span className="text-gray-400 shrink-0">{formatFileSize(attachment.size)}</span>
          <button type="button" onClick={onRemove} title="Remove" className="text-gray-400 hover:text-red-500">
            <MdClose className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Rendered inside a chat bubble.
export const MessageAttachment = ({ attachment }) => {
  if (!attachment?.url) return null;
  const href = `${base_url}${attachment.url}`;

  if (isImageAttachment(attachment)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block mb-1">
        <img src={href} alt={attachment.name} className="max-w-[200px] max-h-[200px] rounded object-cover" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      download={attachment.name}
      className="flex items-center gap-2 mb-1 rounded px-2 py-1.5 text-left border border-gray-300 dark:border-slate-600 bg-white/60 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 text-gray-800 dark:text-slate-100"
    >
      <MdInsertDriveFile className="h-5 w-5 shrink-0" />
      <span className="flex-1 min-w-0">
        <span className="block text-sm truncate">{attachment.name}</span>
        {attachment.size != null && (
          <span className="block text-[10px] opacity-70">{formatFileSize(attachment.size)}</span>
        )}
      </span>
      <MdFileDownload className="h-4 w-4 shrink-0 opacity-70" />
    </a>
  );
};

"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  Upload,
  File,
  Folder,
  MoreVertical,
  Trash2,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Loader2,
} from "lucide-react";
import {
  getFiles,
  createFolder,
  uploadFile,
  deleteFile,
  renameFile,
  getSignedDownloadUrl,
} from "@/actions/files";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size: number;
  lastModified: string;
  path: string;
  parentPath: string;
  url?: string;
  cloudinaryId?: string;
}

// Helper function to calculate folder size
// const calculateFolderSize = (
//   folder: FileItem,
//   allFiles: FileItem[]
// ): number => {
//   let totalSize = 0;
//   const folderPath = folder.path;

//   // Recursively calculate size of all files within this folder and its subfolders
//   allFiles.forEach((item) => {
//     if (item.path.startsWith(folderPath) && item.path !== folderPath) {
//       if (item.type === "file") {
//         totalSize += item.size;
//       }
//     }
//   });

//   return totalSize;
// };

const calculateFolderSize = (
  folder: FileItem,
  allFiles: FileItem[]
): number => {
  let totalSize = 0;
  const folderPath = folder.path.endsWith("/")
    ? folder.path
    : `${folder.path}/`; // Ensure trailing slash

  allFiles.forEach((item) => {
    if (item.path.startsWith(folderPath) && item.path !== folder.path) {
      if (item.type === "file") {
        totalSize += item.size;
      }
    }
  });

  return totalSize;
};

// Helper function to format date in a user-friendly way
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // For timestamps less than 24 hours ago, show relative time
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    if (hours < 1) {
      const minutes = Math.floor(diff / (60 * 1000));
      return minutes <= 1 ? "Just now" : `${minutes} minutes ago`;
    }
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  // For timestamps less than 7 days ago, show day of week
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // For older timestamps, show full date
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function DocumentsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPath, setCurrentPath] = useState<string[]>(["root"]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);

  // Fetch files on mount and when currentPath changes
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    const result = await getFiles();
    if (result.files) {
      setFiles(result.files);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    setIsUploading(true);
    const currentPathString = "/" + currentPath.slice(1).join("/");

    try {
      for (const file of uploadedFiles) {
        const result = await uploadFile(file, currentPathString);
        if (result.file) {
          setFiles((prev) => [...prev, result.file as FileItem]);
        }
      }
      await loadFiles();
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      const currentPathString = "/" + currentPath.slice(1).join("/");
      const result = await createFolder(folderName, currentPathString);
      if (result.folder) {
        setFiles((prev) => [...prev, result.folder as FileItem]);
      }
    }
  };

  const handleRename = async (file: FileItem) => {
    const newName = prompt("Enter new name:", file.name);
    if (newName && newName !== file.name) {
      const result = await renameFile(file.id, newName);
      if (result.success) {
        await loadFiles(); // Reload all files to get updated paths
      }
    }
  };

  const folderSizes = useMemo(() => {
    const sizes: Record<string, number> = {};
    files.forEach((file) => {
      console.log(file.type);
      if (file.type === "file") {
        let parentPath = file.parentPath;
        console.log(parentPath);
        while (parentPath && parentPath !== "/") {
          sizes[parentPath] = (sizes[parentPath] || 0) + file.size;
          const parentFolder = files.find(
            (f) => f.path === parentPath && f.type === "folder"
          );
          parentPath = parentFolder?.parentPath || "";
        }
      }
    });
    console.log(sizes);
    return sizes;
  }, [files]);

  const renderFileSize = (file: FileItem): string => {
    let size =
      file.type === "folder" ? folderSizes[file.path.slice(1)] || 0 : file.size;
    console.log("size", size);
    if (size === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDownload = async (file: FileItem) => {
    if (!file.cloudinaryId) {
      console.error("No cloudinary ID available for this file");
      return;
    }

    try {
      setIsDownloading(file.id);

      console.log(file.cloudinaryId);

      // Get signed URL for download
      const result = await getSignedDownloadUrl(file.cloudinaryId);

      if (result.error) {
        console.error("Error getting download URL:", result.error);
        return;
      }

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = result.url ?? "";
      link.setAttribute("download", file.name); // Force download with original filename

      // Add to document and click
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Fallback to direct URL if available
      if (file.url) {
        window.open(file.url, "_blank");
      }
    } finally {
      setIsDownloading(null);
    }
  };

  const handleShare = async (file: FileItem) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: file.name,
          text: `Check out this file: ${file.name}`,
          url: file.url || window.location.href,
        });
      } else {
        const shareUrl = file.url || `${window.location.origin}${file.path}`;
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const result = await deleteFile(fileId);
      if (result.success) {
        await loadFiles(); // Reload files to get updated list
      }
    }
  };

  const handleFolderClick = (folder: FileItem) => {
    if (folder.type === "folder") {
      setCurrentPath((prev) => [...prev, folder.name]);
    }
  };

  const handleNavigateBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath((prev) => prev.slice(0, -1));
    }
  };

  //Render size in human-readable format
  // const renderFileSize = (file: FileItem): string => {
  //   let size =
  //     file.type === "folder" ? calculateFolderSize(file, files) : file.size;

  //   if (size === 0) return "0 B";
  //   const k = 1024;
  //   const sizes = ["B", "KB", "MB", "GB"];
  //   const i = Math.floor(Math.log(size) / Math.log(k));
  //   return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  // };

  // Filter files for current directory
  const filteredFiles = files.filter(
    (file) => file.parentPath === "/" + currentPath.slice(1).join("/")
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold dark:text-white">Documents</h1>
          <div className="flex items-center gap-2">
            {currentPath.length > 1 && (
              <button
                onClick={handleNavigateBack}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentPath.join(" / ")}
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            multiple
            disabled={isUploading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Files
              </>
            )}
          </button>
          <button
            onClick={handleCreateFolder}
            disabled={isUploading}
            className={`px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2 ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Folder className="w-4 h-4" />
            New Folder
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            <div>Name</div>
            <div>Type</div>
            <div>Size</div>
            <div>Last Modified</div>
          </div>
        </div>

        <div className="divide-y dark:divide-gray-700">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => file.type === "folder" && handleFolderClick(file)}
            >
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-2">
                  {file.type === "folder" ? (
                    <Folder className="w-5 h-5 text-blue-500" />
                  ) : (
                    <File className="w-5 h-5 text-gray-500" />
                  )}
                  <span className="dark:text-white">{file.name}</span>
                </div>
                <div className="dark:text-white capitalize">{file.type}</div>
                <div className="dark:text-white">{renderFileSize(file)}</div>
                <div className="flex items-center justify-between">
                  <span className="dark:text-white">
                    {formatDate(file.lastModified)}
                  </span>
                  <div className="flex items-center gap-2">
                    {file.type === "file" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file);
                          //window.location.href = file.url ?? "";
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        disabled={isDownloading === file.id}
                      >
                        {isDownloading === file.id ? (
                          <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(file);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Share2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRename(file);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

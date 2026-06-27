import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";

export async function downloadUploadedFile(url: string, fileName: string) {
  const fileUrl = resolveUploadSrc(url);
  const response = await fetch(fileUrl);

  if (!response.ok) {
    throw new Error("Failed to download file");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

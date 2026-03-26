export const uploadToImageBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("key", process.env.NEXT_PUBLIC_IMAGEBB_API_KEY!);

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error("Image upload failed");
  }

  const rawUrl = (data?.data?.display_url ?? data?.data?.url) as
    | string
    | undefined;

  if (!rawUrl) {
    throw new Error("Image URL missing from upload response");
  }

  return rawUrl.replace(/^http:\/\//i, "https://");
};

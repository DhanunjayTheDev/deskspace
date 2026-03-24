import api from "./api";

export async function uploadImage(file: File, type = "default"): Promise<string> {
  const fd = new FormData();
  fd.append("image", file);
  const { data } = await api.post(`/upload?type=${type}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url as string;
}

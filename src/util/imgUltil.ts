export const getImageUrl = (path: string) => {
  if (path.startsWith("http")) return path;
  return `http://localhost:8080${path}`;
};
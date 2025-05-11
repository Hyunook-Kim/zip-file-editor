export const TEXT_EXTENSIONS = [
  "txt",
  "md",
  "js",
  "jsx",
  "ts",
  "tsx",
  "html",
  "css",
  "json",
  "xml",
  "csv",
];

export const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "webp",
  "bmp",
  "ico",
];

export const LANGUAGE_MAP: { [key: string]: string } = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  html: "html",
  css: "css",
  json: "json",
  md: "markdown",
  xml: "xml",
  csv: "plaintext",
  txt: "plaintext",
};

export function getLanguageFromExtension(extension?: string): string {
  if (!extension) return "plaintext";

  const ext = extension.toLowerCase();
  return LANGUAGE_MAP[ext] || "plaintext";
}

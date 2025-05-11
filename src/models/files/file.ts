export type FileType = "text" | "image" | "binary" | "directory";

export interface ZipItem {
  name: string;
  path: string;
  type: FileType;
  content?: string | Blob; // 파일 내용 (디렉토리인 경우 없음)
  size?: number;
  children?: ZipItem[]; // 하위 파일/폴더 (디렉토리인 경우만)
  parent?: ZipItem; // 부모 폴더
  extension?: string;
}

export interface ZipData {
  originalFile: File;
  root: ZipItem;
  flatList: { [key: string]: ZipItem }; // 경로를 키로 한 빠른 검색용 맵
}

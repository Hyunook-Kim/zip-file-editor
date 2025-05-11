# Zip 파일 편집기

Zip 파일을 업로드하고, 내부 파일들을 탐색하고 편집할 수 있는 웹 애플리케이션입니다. React와 TypeScript로 개발되었으며, 직관적인 UI로 Zip 파일 내용을 쉽게 확인하고 수정할 수 있습니다.

## 주요 기능

- **Zip 파일 업로드**: 버튼 클릭이나 드래그 앤 드롭으로 Zip 파일 업로드
- **파일 트리 탐색**: 업로드된 Zip 파일의 폴더 구조를 트리 형태로 표시
- **파일 내용 확인**: 텍스트, 이미지, 바이너리 등 다양한 파일 타입 지원
- **파일 편집**: 텍스트 파일의 내용을 Monaco 에디터로 편집
- **탭 기반 인터페이스**: 여러 파일을 동시에 열고 탭으로 전환 가능

## 기술 스택

- **프론트엔드**: React 19, TypeScript
- **상태 관리**: Zustand
- **스타일링**: styled-components
- **에디터**: Monaco Editor
- **ZIP 파일 처리**: JSZip
- **번들러**: Vite

## 시작하기

### 필요 조건

- Node.js 18.0 이상
- npm

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 프로젝트 구조

```
src/
├── components/        # UI 컴포넌트
│   ├── Editor/        # 파일 편집 컴포넌트
│   ├── FileIcons/     # 파일 유형별 아이콘
│   ├── FileTree/      # 파일 트리 네비게이션
│   ├── MonacoEditor/  # Monaco 에디터 통합
│   ├── Sidebar/       # 사이드바 컴포넌트
│   └── Topbar/        # 상단 툴바 컴포넌트
├── models/
│   └── files/         # 파일 관련 모델 및 상태 관리
├── App.tsx            # 메인 앱 컴포넌트
├── index.css          # 글로벌 스타일
└── main.tsx           # 앱 진입점
```

## 데이터 모델링

애플리케이션의.models 디렉토리에는 Zip 파일 데이터 구조와 상태 관리를 위한 모델이 정의되어 있습니다:

### 파일 모델 (files/file.ts)

```typescript
// 파일 타입 정의
export type FileType = "text" | "image" | "binary" | "directory";

// Zip 파일 내 항목을 나타내는 인터페이스
export interface ZipItem {
  name: string; // 파일/폴더 이름
  path: string; // 전체 경로
  type: FileType; // 파일 유형
  content?: string | Blob; // 파일 내용
  size?: number; // 파일 크기
  children?: ZipItem[]; // 하위 파일/폴더
  parent?: ZipItem; // 부모 폴더
  extension?: string; // 파일 확장자
}

// 전체 Zip 데이터를 나타내는 인터페이스
export interface ZipData {
  originalFile: File; // 원본 Zip 파일
  root: ZipItem; // 루트 디렉토리
  flatList: { [key: string]: ZipItem }; // 경로 기반 빠른 검색용 맵
}
```

### 상태 관리 (files/store.ts)

Zustand를 사용하여 애플리케이션 상태를 관리합니다:

```typescript
// 열린 탭을 나타내는 인터페이스
export interface Tab {
  id: string; // 탭 ID (파일 경로)
  file: ZipItem; // 탭에 표시된 파일
  isEdited?: boolean; // 편집 여부
}

// 파일 상태 스토어 인터페이스
interface FileStore {
  zipData: ZipData | null; // 현재 로드된 Zip 데이터
  isLoading: boolean; // 로딩 상태
  currentFile: ZipItem | null; // 현재 선택된 파일
  expandedFolders: Set<string>; // 펼쳐진 폴더들
  openTabs: Tab[]; // 열린 탭 목록
  activeTabId: string | null; // 현재 활성화된 탭

  // 상태 변경 메서드들
  setZipData: (data: ZipData | null) => void;
  setIsLoading: (loading: boolean) => void;
  setCurrentFile: (file: ZipItem | null) => void;
  toggleFolder: (folderPath: string) => void;
  isExpanded: (folderPath: string) => boolean;
  setActiveTab: (tabId: string | null) => void;
  openNewTab: (file: ZipItem) => void;
  closeTab: (tabId: string) => void;
  markTabAsEdited: (tabId: string, isEdited: boolean) => void;
}
```

이 모델링 구조는 Zip 파일의 계층적 구조를 표현하고, 사용자 인터페이스의 상태를 관리하는 기반이 됩니다.

## 작동 방식

1. Zip 파일을 업로드하면 JSZip 라이브러리를 사용하여 파일을 파싱합니다
2. 파싱된 파일의 폴더 구조는 트리 형태로 변환되어 사이드바에 표시됩니다
3. 폴더를 클릭하면 하위 항목을 펼치거나 접을 수 있습니다
4. 파일을 클릭하면 에디터 영역에 파일 내용이 표시됩니다
5. 텍스트 파일은 Monaco 에디터로 편집할 수 있습니다
6. 여러 파일을 탭으로 관리하여 빠르게 전환할 수 있습니다

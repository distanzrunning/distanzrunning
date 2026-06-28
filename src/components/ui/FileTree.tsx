"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

// ============================================================================
// File Tree — Geist's expandable directory view
// ============================================================================
// A recursive folder/file tree with vertical indent guides. Compose with
// FileTree.Folder (toggles open on click) and FileTree.File (optional href).
//
//   <FileTree>
//     <FileTree.Folder name=".vercel" defaultOpen>
//       <FileTree.File name="index.js" href="/..." />
//     </FileTree.Folder>
//   </FileTree>

// Depth drives the indent-guide count; the container is depth 0 and each
// Folder bumps it for its children.
const DepthContext = createContext(0);

// Geist glyphs (16×16). Folder toggles open/closed; file is the leaf.
const FOLDER_OPEN =
  "M13.5 4v2h-11V2.5H6l1.33 1q.68.49 1.5.5zM1 6V1h5.17a1 1 0 0 1 .6.2l1.46 1.1a1 1 0 0 0 .6.2H15V6h1l-.17 1.5-.58 5.28A2.5 2.5 0 0 1 12.76 15H3.24a2.5 2.5 0 0 1-2.49-2.22L.17 7.5 0 6zm13 1.5H1.68l.56 5.11a1 1 0 0 0 1 .89h9.52a1 1 0 0 0 1-.89l.56-5.11z";
const FOLDER_CLOSED =
  "M14.5 7.5v5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-5zm0-1.5V4H8.83a2.5 2.5 0 0 1-1.5-.5L6 2.5H1.5V6zM0 1h6.17a1 1 0 0 1 .6.2l1.46 1.1a1 1 0 0 0 .6.2H16v10a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5V1";
const FILE =
  "M9.18 0a1 1 0 0 1 .61.3l4.42 4.4a1 1 0 0 1 .29.71v8.09A2.5 2.5 0 0 1 12 16H4a2.5 2.5 0 0 1-2.5-2.5V0h7.69M3 13.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5.62L8.88 1.5H3z";

// Scoped CSS — the indent guide draws a 1px rule via a linear-gradient whose
// commas mis-compile as a stacked Tailwind arbitrary variant in our v3, so
// it lives here rather than inline classes.
const FILE_TREE_CSS = `
  .ds-file-tree {
    display: flex;
    flex-direction: column;
    gap: 1px;
    margin: 0;
    padding: 0;
    font-size: 13px;
    list-style: none;
  }
  .ds-file-tree li {
    list-style: none;
    line-height: 28px;
    color: var(--ds-gray-1000);
    white-space: nowrap;
    user-select: none;
  }
  .ds-file-tree ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .ds-ftree-folder {
    display: flex;
    flex-direction: column;
  }
  .ds-ftree-file {
    display: flex;
    align-items: center;
  }
  /* Row (button or anchor) — pulled left 8px and widened to keep the hover
     chip flush with the indent guides. */
  .ds-ftree-row {
    display: flex;
    align-items: center;
    height: 28px;
    width: calc(100% + 8px);
    margin-left: -8px;
    padding: 0 8px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--ds-gray-1000);
    font: inherit;
    text-decoration: none;
    cursor: pointer;
    overflow: hidden;
  }
  .ds-ftree-row:hover {
    background: var(--ds-gray-200);
  }
  .ds-ftree-icon {
    display: inline-block;
    margin-right: 8px;
    text-align: center;
    color: var(--ds-gray-900);
  }
  .ds-ftree-icon svg {
    vertical-align: middle;
  }
  .ds-ftree-file .ds-ftree-icon {
    margin-left: 2px;
  }
  .ds-ftree-label {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ds-file-tree [data-tree-indent] {
    --indent-color: var(--ds-gray-400);
    display: inline-block;
    width: 23px;
    height: 28px;
    flex-shrink: 0;
    vertical-align: top;
    transform: translateX(-4px);
    background-repeat: no-repeat;
    background-image: linear-gradient(
      to right,
      transparent 11.5px,
      var(--indent-color) 11.5px,
      var(--indent-color) 12.5px,
      transparent 12.5px
    );
  }
`;

function Indents({ depth }: { depth: number }) {
  return (
    <>
      {Array.from({ length: depth }, (_, i) => (
        <span key={i} data-tree-indent aria-hidden />
      ))}
    </>
  );
}

function Glyph({ d, size, evenOdd }: { d: string; size: number; evenOdd?: boolean }) {
  return (
    <span className="ds-ftree-icon">
      <svg
        viewBox="0 0 16 16"
        height={size}
        width={size}
        aria-hidden="true"
        style={{ color: "currentcolor" }}
      >
        <path
          fill="currentColor"
          {...(evenOdd ? { fillRule: "evenodd", clipRule: "evenodd" } : {})}
          d={d}
        />
      </svg>
    </span>
  );
}

// ============================================================================
// Types
// ============================================================================

export interface FileTreeProps {
  children: ReactNode;
}

export interface FileTreeFolderProps {
  /** Folder name (rendered monospace). */
  name: string;
  /** Whether the folder starts expanded. */
  defaultOpen?: boolean;
  /** Nested FileTree.Folder / FileTree.File. */
  children?: ReactNode;
}

export interface FileTreeFileProps {
  /** File name (rendered monospace). */
  name: string;
  /** If set, the row renders as a link. */
  href?: string;
}

// ============================================================================
// Components
// ============================================================================

function FileTreeFolder({ name, defaultOpen = false, children }: FileTreeFolderProps) {
  const depth = useContext(DepthContext);
  const [open, setOpen] = useState(defaultOpen);
  const hasChildren = Boolean(children);

  return (
    <li className="ds-ftree-folder" title={name}>
      <button
        type="button"
        className="ds-ftree-row"
        aria-expanded={hasChildren ? open : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <Indents depth={depth} />
        <Glyph d={open ? FOLDER_OPEN : FOLDER_CLOSED} size={16} evenOdd />
        <span className="ds-ftree-label font-mono">{name}</span>
      </button>
      {hasChildren && open && (
        <ul>
          <DepthContext.Provider value={depth + 1}>
            {children}
          </DepthContext.Provider>
        </ul>
      )}
    </li>
  );
}

function FileTreeFile({ name, href }: FileTreeFileProps) {
  const depth = useContext(DepthContext);
  const body = (
    <>
      <Glyph d={FILE} size={14} />
      <span className="ds-ftree-label font-mono">{name}</span>
    </>
  );

  return (
    <li className="ds-ftree-file" title={name}>
      {/* Indent guides sit beside the anchor (Geist renders them as siblings
          for files, but inside the button for folders). */}
      <Indents depth={depth} />
      <a className="ds-ftree-row" href={href}>
        {body}
      </a>
    </li>
  );
}

export function FileTree({ children }: FileTreeProps) {
  return (
    <ul className="ds-file-tree" role="tree">
      <style>{FILE_TREE_CSS}</style>
      <DepthContext.Provider value={0}>{children}</DepthContext.Provider>
    </ul>
  );
}

FileTree.Folder = FileTreeFolder;
FileTree.File = FileTreeFile;

export default FileTree;

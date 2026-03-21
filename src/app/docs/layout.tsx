import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import type { Root, Folder } from 'fumadocs-core/page-tree';

function reverseFolderChildren(tree: Root): Root {
  return {
    ...tree,
    children: tree.children.map((node) => {
      if (node.type === 'folder') {
        return { ...node, children: [...node.children].reverse() } as Folder;
      }
      return node;
    }),
  };
}

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={reverseFolderChildren(source.getPageTree())} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}

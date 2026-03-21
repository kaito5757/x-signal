import { source } from '@/lib/source';
import { Cards, Card } from 'fumadocs-ui/components/card';

export function ArticleList({ basePath }: { basePath: string }) {
  const pages = source
    .getPages()
    .filter(
      (page) =>
        page.slugs.length === 2 &&
        page.slugs[0] === basePath,
    )
    .sort((a, b) => b.slugs[1].localeCompare(a.slugs[1]));

  return (
    <Cards>
      {pages.map((page) => (
        <Card key={page.url} title={page.data.title} href={page.url} />
      ))}
    </Cards>
  );
}

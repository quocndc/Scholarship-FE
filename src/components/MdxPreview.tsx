import { MDXComponents } from '@components/MDX';
import Markdown, { Components } from 'react-markdown';

function MdxPreview({ children }: React.ComponentPropsWithoutRef<typeof Markdown>) {
  return <Markdown components={MDXComponents as Components}>{children}</Markdown>;
}

export default MdxPreview;

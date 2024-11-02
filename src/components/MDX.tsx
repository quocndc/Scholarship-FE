import { Link, List, Text, Title } from '@components/tailus-ui/typography';
import { cn } from '@lib/utils';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from 'mdx/types';

const defaultComponents: MDXComponents = {
  h1: (props) => <Title as="h1" size="3xl" weight="bold" {...props} className={cn(props.className, 'mt-5')} />,
  h2: (props) => <Title as="h2" size="xl" weight="medium" {...props} className={cn(props.className, 'mt-5')} />,
  h3: (props) => <Title as="h3" size="base" weight="medium" {...props} className={cn(props.className, 'mt-5')} />,
  p: (props) => <Text size="base" {...props} className={cn(props.className, 'mt-4 first-of-type:mt-0')} />,
  b: (props) => <Text as="strong" weight="bold" {...props} />,
  i: (props) => <Text as="em" weight="medium" {...props} />,
  a: (props) => <Link {...props} />,
  ul: (props) => <List as="ul" {...(props as any)} className={cn(props.className, 'mt-2 list-disc')} />,
  ol: (props) => <List as="ol" {...(props as any)} className={cn(props.className, 'mt-2 list-decimal')} />,
};

function MDX({ children, components, ...props }: React.ComponentPropsWithoutRef<typeof MDXProvider>) {
  return (
    <div className="leading-6">
      <MDXProvider
        components={{
          ...defaultComponents,
          ...components,
        }}
        {...props}
      >
        {children}
      </MDXProvider>
    </div>
  );
}

export { defaultComponents as MDXComponents };
export default MDX;

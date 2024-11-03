import Button from '@components/tailus-ui/Button';
import { IconClipboard, IconClipboardCheck } from '@tabler/icons-react';
import { ButtonProps } from '@tailus/themer';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import { useCallback, useEffect, useState } from 'react';

function CopyButton(
  props: ButtonProps & {
    content: string;
  }
) {
  const { content, ...rest } = props;
  const [_, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

  const handleClick = useCallback(
    (e: any) => {
      if (e) e.preventDefault();
      if (isCopied) return;
      copyToClipboard(content);
      setIsCopied(true);
    },
    [content, copyToClipboard, isCopied]
  );

  return (
    <Button.Root onClick={handleClick} {...rest}>
      <Button.Icon type="only">{isCopied ? <IconClipboardCheck className="text-success-500" /> : <IconClipboard />}</Button.Icon>
    </Button.Root>
  );
}

export default CopyButton;

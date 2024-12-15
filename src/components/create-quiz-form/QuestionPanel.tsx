import { Skeleton } from '@components/Skeleton';
import Button from '@components/tailus-ui/Button';
import Card from '@components/tailus-ui/Card';
import Input from '@components/tailus-ui/Input';
import { Text } from '@components/tailus-ui/typography';
import { Question } from '@lib/types';
import { IconPlus } from '@tabler/icons-react';
import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';

type QuestionPanelProps = {
  onAdd: (data: Question) => void;
  options?: Question[];
  isLoading?: boolean;
  onSearch?: (search: string) => void;
};

export function QuestionPanel({ onAdd, options, isLoading, onSearch }: QuestionPanelProps) {
  const onSubmit = (data: Question) => {
    onAdd(data);
  };
  const [search, setSearch] = useState('');
  const debouncedSearchTerm = useDebounce(search, 200);

  useEffect(() => {
    onSearch?.(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  return (
    <Card variant="soft" className="space-y-4">
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm câu hỏi" />
      <div className="space-y-4">
        {isLoading && (
          <>
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
          </>
        )}
        {options?.map((q, index) => (
          <div key={q._id} className="flex items-start gap-2">
            <Button.Root className="flex-shrink-0" variant="outlined" intent="gray" type="button" size="xs" onClick={() => onSubmit(q)}>
              <Button.Icon type="only">
                <IconPlus />
              </Button.Icon>
            </Button.Root>
            <Text size="sm">{q.question}</Text>
          </div>
        ))}
      </div>
    </Card>
  );
}

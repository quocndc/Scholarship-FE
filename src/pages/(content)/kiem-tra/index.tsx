import LoadMoreTrigger from '@components/data-table/LoadMoreTrigger';
import TestModeTabs from '@components/quiz-list/ModeTabs';
import { useGetQuizzes } from '@components/quiz-list/useGetQuiz';
import { Skeleton } from '@components/Skeleton';
import Button from '@components/tailus-ui/Button';
import Card from '@components/tailus-ui/Card';
import { Caption, Title } from '@components/tailus-ui/typography';
import { QuizType } from '@lib/types';
import { IconArrowRight } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';

function KiemTraPage() {
  const [search] = useSearchParams({
    m: QuizType.certification,
  });

  const { isFetchingNextPage, isLoading, data, hasNextPage, fetchNextPage } = useGetQuizzes({
    filter: {
      type: search.get('m') || QuizType.certification,
    },
  });

  const items = data?.pages.flatMap((page) => page.data.result) || [];

  return (
    <div className="space-y-8 pb-20 pt-2">
      <div className="max-w-sm">
        <TestModeTabs />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {isLoading &&
          Array(10)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/2" />
              </Card>
            ))}
        {items.map((item, index) => (
          <Card key={index} className="flex flex-col justify-between h-48">
            <Title size="lg" className="line-clamp-2">
              {item.title}
            </Title>
            <Caption className="line-clamp-3">{item.description}</Caption>
            <Button.Root intent="accent" variant="ghost" size="sm" className="ml-auto" href={`/kiem-tra/${item._id}`}>
              <Button.Label>Tham gia</Button.Label>
              <Button.Icon type="trailing">
                <IconArrowRight />
              </Button.Icon>
            </Button.Root>
          </Card>
        ))}
        <LoadMoreTrigger isLoading={isFetchingNextPage} onLoadMore={fetchNextPage} hasMore={hasNextPage} />
        {isFetchingNextPage &&
          Array(10)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/2" />
              </Card>
            ))}
      </div>
    </div>
  );
}

export default KiemTraPage;

import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import Button from '@components/tailus-ui/Button';
import Card from '@components/tailus-ui/Card';
import { Form } from '@components/tailus-ui/form';
import { RadioGroupForm } from '@components/tailus-ui/form/RadioGroup';
import { Caption, Display, List, Text } from '@components/tailus-ui/typography';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { Quiz } from '@lib/types';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData, useParams } from 'react-router-dom';

function QuizDetailPage() {
  const { id } = useParams();
  if (!id) throw new Error('Missing id');

  const data = useLoaderData() as Quiz;

  const [score, setScore] = React.useState<number>();

  const { setItems } = useBreadcrumb();
  useEffectOnce(() => {
    setItems([
      {
        title: 'Kiểm tra',
        href: '/kiem-tra',
      },
      {
        title: data.title,
        href: `/kiem-tra/${data._id}`,
      },
    ]);
  });

  const form = useForm<{ _id: string; answer: string }[]>({
    defaultValues: data.question.map((q) => ({ _id: q._id, answer: '' })),
    disabled: score != undefined,
  });

  const handleSubmit = (payload: Record<number, { _id: string; answer: string }>) => {
    const answers = Object.values(payload);
    const eachQuestionScore = 100 / data.question.length;
    const wrongAnswerIndexes: number[] = [];

    const score = answers.reduce((acc, { _id, answer }) => {
      const question = data.question.find((q) => q._id === _id);
      if (!question) return acc;
      if (question.answer === answer) {
        return acc + eachQuestionScore;
      }
      wrongAnswerIndexes.push(data.question.indexOf(question));
      return acc;
    }, 0);

    setScore(score);

    wrongAnswerIndexes.forEach((index) => {
      form.setError(`${index}.answer`, { type: 'manual', message: 'Đáp án là: ' + data.question[index].answer });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (data) => handleSubmit(data),
          (e) => console.log(e)
        )}
        className="space-y-8 py-6"
      >
        <section className="space-y-8 py-6">
          <div className="space-y-4">
            <Display size="5xl">{data?.title}</Display>
            <Caption>{data.description}</Caption>
          </div>
        </section>
        <List as="ol" className="space-y-8 py-6 list-decimal">
          {data.question.map((q, i) => (
            <li key={q._id} className="space-y-4">
              <input type="hidden" {...form.register(`${i}._id` as const)} value={q._id} />
              <RadioGroupForm
                key={'radio' + i + score + q._id}
                control={form.control}
                name={`${i}.answer`}
                label={q.question}
                values={q.option.map((o) => ({ value: o }))}
                rules={{ required: 'Vui lòng chọn câu trả lời' }}
              />
            </li>
          ))}
        </List>
        {score != undefined ? (
          <Card variant="soft" className="flex divide-x-2 items-center">
            <div className="px-5 w-1/3">
              <Text>Điểm số:</Text>
              <Display>{score}</Display>
            </div>
            <List className="px-5 flex-1 h-full my-0" inside type="none">
              <li>Số câu đúng: {data.question.length * (score / 100)}</li>
              <li>Tổng số câu: {data.question.length}</li>
            </List>
            <div className="px-5 flex flex-col items-stretch justify-between gap-3">
              <Button.Root
                intent="primary"
                variant="soft"
                onClick={() => {
                  setScore(undefined);
                  form.reset();
                }}
              >
                <Button.Label>Làm lại</Button.Label>
              </Button.Root>
              <Button.Root intent="danger" variant="soft" href={`${window.location.pathname}`}>
                <Button.Label>Thoát</Button.Label>
              </Button.Root>
            </div>
          </Card>
        ) : (
          <Button.Root type="submit">
            <Button.Label>Nộp bài {score}</Button.Label>
          </Button.Root>
        )}
      </form>
    </Form>
  );
}

export default QuizDetailPage;

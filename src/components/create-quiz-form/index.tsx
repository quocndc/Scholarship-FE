import { QuestionPanel } from '@components/create-quiz-form/QuestionPanel';
import LoadMoreTrigger from '@components/data-table/LoadMoreTrigger';
import { useGetQuestion } from '@components/question-list';
import { Skeleton } from '@components/Skeleton';
import Button from '@components/tailus-ui/Button';
import { Form, FormLabel, InputForm, SelectForm, SelectItem } from '@components/tailus-ui/form';
import { Text } from '@components/tailus-ui/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { Question, Quiz, QuizType } from '@lib/types';
import { IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
export const CreateQuizSchema = z.object({
  _id: z.string().optional(),
  type: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  question: z.array(z.string().min(1)),
});
export type CreateQuizSchema = z.infer<typeof CreateQuizSchema>;
type CreateQuizFormProps = {
  defaultValues?: Partial<Quiz>;
  onSubmit: (data: CreateQuizSchema) => void;
};
function CreateQuizForm({ defaultValues, onSubmit }: CreateQuizFormProps) {
  const form = useForm<CreateQuizSchema>({ resolver: zodResolver(CreateQuizSchema), defaultValues });

  const [search, setSearch] = useState('');
  const { isLoading, data, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetQuestion({
    filter: {
      question: search,
    },
  });
  const [questions, setQuestions] = useState<Question[]>(defaultValues?.question ?? []);

  const items = useMemo(() => {
    const items = data?.pages.flatMap((d) => d.data.result) ?? [];
    return items.filter((item) => !questions.find((q) => q._id === item._id));
  }, [data?.pages, questions]);

  const { append, remove } = useFieldArray({
    control: form.control,
    name: 'question',
  });
  const onRemove = (index: number) => {
    remove(index);
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    form.reset({
      ...defaultValues,
      question: defaultValues?.question?.map((q) => q._id) ?? [],
    });
    setQuestions(defaultValues?.question ?? []);
  };
  useEffect(() => {
    form.reset({
      ...defaultValues,
      question: defaultValues?.question?.map((q) => q._id) ?? [],
    });
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form className="grid gap-8 grid-cols-3 h-full overflow-y-auto" onSubmit={form.handleSubmit(onSubmit)} id="createform">
        <div className="gap-4 col-span-2 pl-4">
          <div className="space-y-4">
            <InputForm required control={form.control} name="title" label="Tiêu đề" />
            <InputForm required control={form.control} name="description" label="Mô tả" />
            <SelectForm required control={form.control} name="type" label="Loại">
              <SelectItem value={QuizType.certification}>
                <Text>Certification</Text>
              </SelectItem>
              <SelectItem value={QuizType.interview}>
                <Text>Interview</Text>
              </SelectItem>
            </SelectForm>
            <div className="space-y-2">
              <FormLabel>
                Câu hỏi
                <span className="text-danger-500 ml-1">*</span>
              </FormLabel>
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={q._id} className="flex items-start gap-2">
                    <Button.Root className="flex-shrink-0" variant="outlined" intent="gray" type="button" size="xs" onClick={() => onRemove(index)}>
                      <Button.Icon type="only">
                        <IconX />
                      </Button.Icon>
                    </Button.Root>
                    <Text size="sm" className="line-clamp-2">
                      {q.question}
                    </Text>
                  </div>
                ))}
              </div>
              <LoadMoreTrigger hasMore={hasNextPage} isLoading={isFetchingNextPage} onLoadMore={fetchNextPage} />
              {isFetchingNextPage && <Skeleton className="w-full h-8" />}
            </div>
          </div>
        </div>
        <QuestionPanel
          options={items}
          isLoading={isLoading}
          onSearch={setSearch}
          onAdd={(question) => {
            append(question._id);
            setQuestions((prev) => [...prev, question]);
          }}
        />
        {/* <QuestionForm control={form.control} name="question" label="Câu hỏi" /> */}
      </form>
      <div className="bg-white px-4 py-5 sticky bottom-0 right-0 left-0 border-t flex items-center justify-end w-full gap-4 max-h-20">
        <Button.Root type="reset" form="createform" intent="gray" variant="outlined" onClick={reset}>
          <Button.Label>Đặt lại</Button.Label>
        </Button.Root>
        <Button.Root type="submit" form="createform">
          <Button.Label>Tạo mới</Button.Label>
        </Button.Root>
      </div>
    </Form>
  );
}

export default CreateQuizForm;

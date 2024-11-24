import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import CreateQuizForm, { CreateQuizSchema } from '@components/create-quiz-form';
import { useEditQuiz } from '@components/quiz-list/useEditQuiz';
import { useEffectOnce } from '@hooks/useEffectOnce';
import axios from '@lib/axios';
import { IResponse, Quiz } from '@lib/types';
import { useLoaderData } from 'react-router-dom';
import { toast } from 'sonner';

export function loader(id: string) {
  return axios.get<IResponse<Quiz>>(`/quiz/${id}`).then((res) => res.data);
}

function EditQuizAdminPage() {
  const { setItems } = useBreadcrumb();
  const { data } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  useEffectOnce(() => {
    setItems([
      {
        title: 'Quản lý quiz',
        href: '/admin/quiz',
      },
      {
        title: 'Chỉnh sửa quiz',
        href: '/admin/quiz/edit',
      },
    ]);
  });

  const { mutateAsync: edit } = useEditQuiz();
  const onCreate = async (data: CreateQuizSchema) => {
    toast.promise(edit(data), {
      loading: 'Đang sửa quiz...',
      success: () => {
        return 'Sửa quiz thành công';
      },
      error: 'Sửa quiz thất bại',
    });
  };

  return <CreateQuizForm onSubmit={onCreate} defaultValues={data} />;
}

export default EditQuizAdminPage;

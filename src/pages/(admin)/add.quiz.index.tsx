import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import CreateQuizForm, { CreateQuizSchema } from '@components/create-quiz-form';
import { useCreateQuiz } from '@components/quiz-list/useCreateQuiz';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { toast } from 'sonner';

function AddQuizAdminPage() {
  const { setItems } = useBreadcrumb();
  useEffectOnce(() => {
    setItems([
      {
        title: 'Quản lý quiz',
        href: '/admin/quiz',
      },
      {
        title: 'Tạo mới quiz',
        href: '/admin/quiz/add',
      },
    ]);
  });

  const { mutateAsync: create } = useCreateQuiz();
  const onCreate = async (data: CreateQuizSchema) => {
    toast.promise(create(data), {
      loading: 'Đang tạo quiz...',
      success: () => {
        return 'Tạo quiz thành công';
      },
      error: 'Tạo quiz thất bại',
    });
  };

  return <CreateQuizForm onSubmit={onCreate} defaultValues={{}} />;
}

export default AddQuizAdminPage;

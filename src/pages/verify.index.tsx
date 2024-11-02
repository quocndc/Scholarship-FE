import VerifyForm from '@components/verify-form/VerifyForm';
import { Navigate, useSearchParams } from 'react-router-dom';

function VerifyPage() {
  const [search] = useSearchParams();

  const id = search.get('id') ?? undefined;
  const email = search.get('email');

  if (!email) {
    return <Navigate to="/register" />;
  }

  return <VerifyForm data={{ _id: id, email }} />;
}

export default VerifyPage;

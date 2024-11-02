import LoginForm from '@components/login-form/LoginForm';
import { useIsAuthenticated } from '@lib/auth';
import { Navigate } from 'react-router-dom';

function LoginPage() {
  return <LoginForm />;
}

export default LoginPage;

import { useState } from 'react';
import { AuthTemplate } from '../components/templates/AuthTemplate';
import { AuthForm } from '../components/organisms/AuthForm';

export const AuthPage = () => {
  const [type, setType] = useState<'login' | 'register'>('login');
  return (
    <AuthTemplate>
      <AuthForm
        type={type}
        onToggleType={() => setType(type === 'login' ? 'register' : 'login')}
      />
    </AuthTemplate>
  );
};

import type { Meta, StoryObj } from '@storybook/react';
import { AuthForm } from './AuthForm';

const meta: Meta<typeof AuthForm> = {
  title: 'Organisms/AuthForm',
  component: AuthForm,
  decorators: [
    (Story) => (
      <div className="flex justify-center p-10 bg-gray-100 min-h-screen">
        <div className="w-full max-w-md">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AuthForm>;

export const LoginForm: Story = { args: { type: 'login' } };
export const RegisterForm: Story = { args: { type: 'register' } };

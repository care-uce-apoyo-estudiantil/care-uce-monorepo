import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta = {
  title: 'Example/Header',
  component: Header,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    user: {
      name: 'Jane Doe',
    },
    onLogin: () => console.log('Login clicked'),
    onLogout: () => console.log('Logout clicked'),
    onCreateAccount: () => console.log('Create account clicked'),
  },
};

export const LoggedOut: Story = {
  args: {
    onLogin: () => console.log('Login clicked'),
    onLogout: () => console.log('Logout clicked'),
    onCreateAccount: () => console.log('Create account clicked'),
  },
};

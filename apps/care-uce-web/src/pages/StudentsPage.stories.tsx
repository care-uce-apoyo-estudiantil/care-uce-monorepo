import type { Meta, StoryObj } from '@storybook/react';
import { StudentsPage } from './StudentsPage';
import { MemoryRouter } from 'react-router-dom';
import { AdminTemplate } from '../components/templates/AdminTemplate';

const meta: Meta<typeof StudentsPage> = {
  title: 'Pages/StudentsPage',
  component: StudentsPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/estudiantes']}>
        <AdminTemplate>
          <Story />
        </AdminTemplate>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StudentsPage>;

export const Default: Story = {};

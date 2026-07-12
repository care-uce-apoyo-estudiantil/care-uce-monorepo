import type { Meta, StoryObj } from '@storybook/react';
import { DashboardPage } from './DashboardPage';
import { MemoryRouter } from 'react-router-dom';
import { AdminTemplate } from '../components/templates/AdminTemplate';

const meta: Meta<typeof DashboardPage> = {
  title: 'Pages/Dashboard',
  component: DashboardPage,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/dashboard']}>
        <AdminTemplate>
          <Story />
        </AdminTemplate>
      </MemoryRouter>
    ),
  ],
};
export default meta;

export const Default: StoryObj = {};

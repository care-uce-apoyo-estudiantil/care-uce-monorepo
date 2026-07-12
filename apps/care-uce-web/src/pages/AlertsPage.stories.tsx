import type { Meta, StoryObj } from '@storybook/react';
import { AlertsPage } from './AlertsPage';
import { MemoryRouter } from 'react-router-dom';
import { AdminTemplate } from '../components/templates/AdminTemplate';

const meta: Meta<typeof AlertsPage> = {
  title: 'Pages/AlertsPage',
  component: AlertsPage,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/alertas']}>
        <AdminTemplate>
          <Story />
        </AdminTemplate>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AlertsPage>;

export const Default: Story = {};

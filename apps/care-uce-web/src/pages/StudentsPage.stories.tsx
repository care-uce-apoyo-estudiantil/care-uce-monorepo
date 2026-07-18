// Location: apps/care-uce-web/src/app/pages/StudentsPage.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { StudentsPage } from './StudentsPage';

// Storybook metadata configuration
const meta: Meta<typeof StudentsPage> = {
  component: StudentsPage,
  title: 'Pages/StudentsPage',
  parameters: {
    layout: 'fullscreen',
  },
  // Ensure the container mimics a full viewport height context
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: '100vw' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StudentsPage>;

/**
 * Default view representing the live state of the Admin Students Dashboard.
 * In a real Storybook setup involving Axios, MSW (Mock Service Worker) is generally recommended
 * to mock the API calls. Here the component will render its empty/loading state initially.
 */
export const DefaultView: Story = {};

import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof Sidebar> = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};
export default meta;

export const Default: StoryObj = {};

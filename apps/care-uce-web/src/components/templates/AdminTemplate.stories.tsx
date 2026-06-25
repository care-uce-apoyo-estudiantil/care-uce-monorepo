import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom'; // <-- 1. Importamos el Router
import { AdminTemplate } from './AdminTemplate';

const meta: Meta<typeof AdminTemplate> = {
  title: 'Templates/AdminTemplate',
  component: AdminTemplate,
  parameters: {
    layout: 'fullscreen',
  },
  // <-- 2. Envolvemos la historia visual en un Router simulado
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AdminTemplate>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-8 bg-white border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
        <h2 className="text-xl font-semibold mb-2">Área de Contenido</h2>
        <p>
          Aquí se inyectarán las páginas como el Dashboard o la Gestión de
          Usuarios.
        </p>
      </div>
    ),
  },
};

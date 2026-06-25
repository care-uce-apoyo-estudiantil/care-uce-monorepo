import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

// Settings of Storybook
const meta: Meta<typeof Button> = {
  title: 'Atoms/Web Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'danger', 'outline'],
      description: 'Variante de color institucional',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'Tamaño del botón',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Cases of use (Stories)
export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Iniciar Sesión',
    size: 'medium',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    label: 'Alerta de Crisis',
    size: 'medium',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    label: 'Cancelar',
    size: 'medium',
  },
};

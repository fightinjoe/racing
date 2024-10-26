import type { Meta, StoryObj } from '@storybook/react'

import Tile from '@/components/tile'

const meta = {
  title: 'MFA/Tile',
  component: Tile,
  parameters: {},
  tags: [],
  decorators: [
    (Story) => (
      <div className="bg-ocean-radial p-4 w-[390px] box-content">
        <div style={{ 'containerType': 'inline-size' }}>
          <Story />
        </div>
      </div>
    )
  ]
} satisfies Meta<typeof Tile>

export default meta

type Story = StoryObj<typeof meta>

export const Racer: Story = {
  args: {
    title: '108',
    subtitle: 'Aaron Wheeler (A fleet)',
  }
}

export const Todo: Story = {
  args: {
    title: '+',
    subtitle: 'Add racers',
    className: 'tile-todo'
  }
}

export const Emphasize: Story = {
  args: {
    title: '+',
    subtitle: 'Add racers',
    className: 'tile-emphasize'
  }
}

export const Done: Story = {
  args: {
    title: '31 Racers',
    subtitle: <><strong>5</strong> A fleet<br /><strong>0</strong> B fleet</>,
    className: 'tile-done'
  }
}

export const Click: Story = {
  args: {
    title: 'Click',
    subtitle: 'Will open alert',
    onClick: () => alert('Clicked')
  }
}
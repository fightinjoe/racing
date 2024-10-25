import type { Meta, StoryObj } from '@storybook/react'

import Race from '@/components/race'

const meta = {
  title: 'MFA/Race',
  component: Race.Start,
  parameters: {},
  tags: [],
  decorators: [
    (Story) => (
      <div className="bg-ocean-radial p-4 box-content">
        <div style={{ 'containerType': 'inline-size' }}>
          <Story />
        </div>
      </div>
    )
  ]
} satisfies Meta<typeof Race.Start>

export default meta

type Story = StoryObj<typeof meta>

export const Start: Story = {
  args: {
    fleet: 'A',
    course: '1. Triangle',
    count: 5
  }
}
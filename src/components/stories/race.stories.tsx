import type { Meta, StoryObj } from '@storybook/react'

import Race from '@/components/race'

const meta = {
  title: 'MFA/Race',
  component: Race.Start,
  parameters: {},
  tags: [],
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
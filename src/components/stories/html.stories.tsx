import type { Meta, StoryObj } from '@storybook/react'

import HTML from '@/components/html'

const meta = {
  title: 'MFA/HTML',
  component: HTML.H1,
  parameters: {},
  tags: []
} satisfies Meta<typeof HTML.H1>

export default meta

type Story = StoryObj<typeof meta>

export const Heading1: Story = {
  args: {
    title: 'Heading 1'
  }
}
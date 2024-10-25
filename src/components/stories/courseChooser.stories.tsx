import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test';

import CourseChooser from '@/components/courseChooser'

const meta = {
  title: 'MFA/CourseChooser',
  component: CourseChooser,
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

} satisfies Meta<typeof CourseChooser>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    fleet: 'A',
    count: 5,
    onCancel: fn
  }
}
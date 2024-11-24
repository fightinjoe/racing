import type { Meta, StoryObj } from '@storybook/react'

import { SmartSailorTile } from '@/components/tile'
import { mockRacerA1, mockSailorA1 } from '@/__mocks__/default'

const meta = {
  title: 'MFA/Sailor',
  component: SmartSailorTile,
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
} satisfies Meta<typeof SmartSailorTile>

export default meta

type Story = StoryObj<typeof meta>

export const Racer: Story = {
  args: {
    sailor: mockRacerA1
  }
}

export const Volunteer: Story = {
  args: {
    sailor: {
      ...mockSailorA1,
      role: 'Race committee'
    }
  }
}

export const Finisher: Story = {
  args: {
    sailor: {
      ...mockRacerA1,
      finishedAt: Date.now(),
      positionOverride: 2
    }
  }
}

export const Failure: Story = {
  args: {
    sailor: {
      ...mockRacerA1,
      failure: 'DSQ'
    }
  }
}
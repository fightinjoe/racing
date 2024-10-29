import type { Meta, StoryObj } from '@storybook/react'

import Race from '@/components/race'
import { RaceDay } from '@/models/raceday'
import { mockRacers, mockRaceA1 } from '@/__mocks__/default'

const meta = {
  title: 'MFA/Race',
  parameters: {},
  tags: [],
  decorators: [
    (Story: any) => (
      <div className="bg-ocean-linear p-4 w-[390px] box-content">
        <div className="gap-2 grid grid-cols-1">
          <Story />
        </div>
      </div>
    )
  ]
}

export default meta

type StartStory = StoryObj<typeof Race.Start>
type RunningStory = StoryObj<typeof Race.Running>
type NewStory = StoryObj<typeof Race.New>
type ViewStory = StoryObj<typeof Race.View>

const runningArgs: {race: RaceSchema} = {
  race: {
    id: '1A',
    fleet: 'A',
    course: '6. No Jibe upwind finish',
    startTime: Date.now() + (5*1000),//(2*60*1000),
    finishers: []
  }
}

const mockRaceDay = new RaceDay(mockRacers, [], {
  sailSize: 'small',
  raceSeparateFleets: true,
  hasSaved: false
})

export const Start: StartStory = {
  render: (args) => <Race.Start {...args} />,
  args: {
    fleet: 'A',
    course: '1. Triangle',
    count: 5
  }
}

export const New: NewStory = {
  render: (args) => <Race.New {...args} />,
  args: {
    fleet: 'A',
    raceDay: mockRaceDay
  }
}

export const Running: RunningStory = {
  render: (args) => <Race.Running {...args} />,
  args: runningArgs
}

export const Double: RunningStory = {
  args: runningArgs,
  render: (args) => <Race.Running {...args} />,
  decorators: (Story: any) => (
    <div className="gap-2 grid grid-cols-2">
      <Story />
      <Race.New fleet="B" raceDay={ mockRaceDay } />
    </div>
  )
}

export const View: ViewStory = {
  render: (args) => <Race.View {...args} />,
  args: {
    race: mockRaceA1
  }
}


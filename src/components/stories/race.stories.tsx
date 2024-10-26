import type { Meta, StoryObj } from '@storybook/react'

import Race from '@/components/race'
import { RaceDay } from '@/models/raceday'
import { mockRacers } from '@/__mocks__/default'

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

const runningArgs: {race: RaceSchema} = {
  race: {
    id: '1A',
    fleet: 'A',
    course: '6. No Jibe upwind finish',
    startTime: Date.now() + (2*60*1000),
    finishers: []
  }
}

const mockRaceDay = new RaceDay(mockRacers, [], {
  sailSize: 'small',
  raceSeparateFleets: true,
  hasSaved: false
})

export const New: NewStory = {
  render: (args) => <Race.New {...args} />,
  args: {
    fleet: 'A',
    raceDay: mockRaceDay
  }
}

export const Start: StartStory = {
  render: (args) => <Race.Start {...args} />,
  args: {
    fleet: 'A',
    course: '1. Triangle',
    count: 5
  }
}

export const Running: RunningStory = {
  render: (args) => <Race.Running {...args} />,
  args: {
    race: {
      id: '1',
      fleet: 'A',
      course: '1. Triangle',
      startTime: Date.now() + (2*60*1000),
      finishers: []
    }
  }
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


import type { Meta, StoryObj } from '@storybook/react'

import Banner from '@/components/banner'

const meta = {
  title: 'MFA/Banner',
  parameters: {},
  tags: []
}

export default meta

type AlertStory = StoryObj<typeof Banner.Alert>
export const AlertBanner: AlertStory = {
  render: (args) => <Banner.Alert {...args} />,
  args: {
    children: <span>Banner message <strong>goes here</strong></span>
  }
}

type DefaultStory = StoryObj<typeof Banner.Default>
export const DefaultBanner: DefaultStory = {
  render: (args) => <Banner.Default {...args} />,
  args: {
    children: <span>If you like you can <a href="#">click this link</a></span>
  }
}
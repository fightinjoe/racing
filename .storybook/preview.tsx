import React from 'react'
import type { Preview } from "@storybook/react";
import { Inter } from 'next/font/google';

// Mock Next.js router
// https://github.com/storybookjs/storybook/issues/24722#issuecomment-2087844754
import {
	AppRouterContext,
	type AppRouterInstance,
} from 'next/dist/shared/lib/app-router-context.shared-runtime'

import '../src/app/globals.css';

const inter = Inter({ subsets: ["latin"] })

const preview: Preview = {
  decorators: [
		(Story) => (
			<AppRouterContext.Provider value={{} as AppRouterInstance}>
				<Story />
			</AppRouterContext.Provider>
		),
    (Story) => <div className={inter.className}><Story /></div>,
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
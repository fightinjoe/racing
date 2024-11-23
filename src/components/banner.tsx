import React from 'react'

import styles from './styles/banner.module.css'

/**
 * The Banner component is used to display information to the user, typically near the top
 * of the screen. It is full bleed and comes in two variations: Alert (colored to draw
 * attention), and Default (colored to fit into the design of the app)
 * 
 * @example
 * import Banner from '@/components/banner'
 * 
 * <Banner.Alert>{ "My message goes here" }</Banner.Alert>
 */

const GenericBanner: GenericFC = ({ className, children }) => {
  const classNames: string = [
    'p-4 block text-center',
    className
  ].join(' ')

  return (
    <small className={ classNames }>
      { children }
    </small>
  )
}

const AlertBanner: GenericFC = ({children}) => (
  <GenericBanner className="bg-yellow-100">{ children }</GenericBanner>
)

const DefaultBanner: GenericFC = ({children}) => {
  const classNames = [
    'text-white bg-ocean-linear',
    styles.defaultBanner
  ].join(' ')

  return (
    <GenericBanner className={ classNames }>{ children }</GenericBanner>
  )
}

const Banner = {
  Alert: AlertBanner,
  Default: DefaultBanner
}

export default Banner
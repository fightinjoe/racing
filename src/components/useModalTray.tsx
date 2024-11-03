import { useEffect, useRef, useState } from "react"
import { Transition } from "@headlessui/react"

import styles from "@/components/styles/useModalTray.module.css"

export default function useModalTray(props: ModalTrayProps): ModalTray {
  const [visible, setVisible] = useState(false)

  const show = () => setVisible(true)

  const hide = () => setVisible(false)

  return {
    props: {show, hide, visible},
    Tray
  }
}

function Tray(props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & TrayProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const onOffClick = (e: MouseEvent) => {
    // If the modal is not visible, do nothing
    if (!props.visible) return
  
    if (ref.current && !ref.current.contains(e.target as Node)) {
      props.hide()
    }
  }

  useEffect(() => {
    document.addEventListener('click', onOffClick)

    return () => {
      document.removeEventListener('click', onOffClick)
    }
  }, [props.visible])

  return (
    <Transition show={ props.visible }>
      <div
        ref={ref}
        className={`${styles.modal} ${props.className} data-[closed]:translate-y-full`}
      >
        { props.children }
      </div>
    </Transition>
  )
}

interface ModalTrayProps {
}

interface ModalTray {
  props: TrayProps,
  Tray: typeof Tray
}

interface TrayProps {
  show: () => void,
  hide: () => void,
  visible: boolean
}
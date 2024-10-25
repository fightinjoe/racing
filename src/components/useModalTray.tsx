import { useRef, useState } from "react"

import styles from './useModalTray.module.css'

interface Props {
  doForce: () => boolean,
  onCancel: () => void,
}

export default function useModalTray(props: Props) {
  const modalRef = useRef<HTMLElement>(null)

  const [showModal, setShowModal] = useState( props.doForce())

  const handleOutsideClick = (e: MouseEvent) => {
    // Make sure that the outside click is not confused with clicking on the
    // CANCEL button
    // if( e.target === addRef.current ) return

    if( !props.doForce() &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
    ) {
      hide()
    }
  }

  function show(onlyAdd?: boolean) {
    if( showModal ) return
      
    setShowModal(true)
    document.querySelector('body')?.addEventListener('click', handleOutsideClick)
  }

  function hide() {
    setShowModal(false)
    
    props.onCancel()

    document.querySelector('body')?.removeEventListener('click', handleOutsideClick)
  }

  function Tray({classNames, children}: {classNames?: string, children: React.ReactNode}) {
    let names = [styles.modal]
    if( showModal ) names.push(styles.visible)
    if( classNames ) names.push(classNames)

    return (
      <section ref={modalRef} className={ names.join(' ')}>
        {children}
      </section>
    )
  }

  return {Tray, show, hide, visible: showModal}
}
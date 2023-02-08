import { useState } from 'react'

const useModal = (initIsVisible = false) => {
  const [isVisible, setIsVisible] = useState(initIsVisible)
  const toggle = () => setIsVisible(!isVisible)
  return [isVisible, setIsVisible, toggle]
}

export default useModal

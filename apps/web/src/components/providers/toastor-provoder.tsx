'use client'

import { useTheme } from 'next-themes'
import React from 'react'
import { Toaster } from 'sonner'

type Props = {}

const ToasterProvider = (props: Props) => {
    const {theme , setTheme} = useTheme()
    let toastTheme = theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'system'

  return (
    <Toaster closeButton position="bottom-right" richColors theme={toastTheme as 'light' | 'dark' | 'system'} />
  )
}

export default ToasterProvider
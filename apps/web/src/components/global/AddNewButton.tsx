'use client'

import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

type Props = {}

const AddNewButton = (props: Props) => {
    const router = useRouter()
  return (
    <Button onClick={() => router.push('/')} className='cursor-copy' variant={'outline'} >
        Add New
    </Button>
  )
}

export default AddNewButton
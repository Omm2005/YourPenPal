'use client'

import React from 'react'
import { Button } from '../ui/button'
import { signIn } from 'next-auth/react'
import { User } from 'next-auth'
import AvatarDropdown from './AvatarDropdown'
import { Dot, Link, MoveRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AddNewButton from './AddNewButton'

type Props = {
  user: User | undefined,
  menu? : boolean,
  addNew? : boolean
}

function Navbar({user , menu , addNew}: Props) {
  const router = useRouter()
  return (
    <nav className='flex justify-between items-center w-full' >
      {
        menu ? (
          <div className='flex gap-2 justify-center items-center' >
          <AddNewButton />
          </div>
        ) : (

          <div className='flex gap-2 justify-center items-center cursor-pointer' onClick={() => router.push('/menu')} >
              <Dot size={20} />
                <p className='underline hover:decoration-wavy' >
                    Memories
                </p>
                <Link size={18} className='text-muted-foreground' />
                {
                  addNew && (
                    <>
                    <MoveRight size={20} className='text-muted-foreground' />
                  <AddNewButton />
                    </>
                  )
                }
            </div>
            )
          }
          {
            user ? <AvatarDropdown user={user} /> : (

              <Button onClick={() => {signIn('google')}}>
              Sign in
            </Button>
            )
          }
    </nav>
  )
}

export default Navbar
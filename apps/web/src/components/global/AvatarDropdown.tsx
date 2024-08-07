'use client'

import React from 'react'
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { User } from 'next-auth'
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu'
import { Separator } from '../ui/separator'
import { ModeToggle } from './ModeToggle'
import { Button } from '../ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

type Props = {
    user: User
}

const AvatarDropdown = ({user}: Props) => {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Avatar className='cursor-pointer' >
                <AvatarImage src={user.image!} alt={user.name!} />
                <AvatarFallback>{user.name}</AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent asChild align='end' className='mt-1'>
            <div className='flex flex-col h-auto w-auto bg-background z-10 border rounded-lg'>

        <div className='flex p-3 gap-3'>
                            <Avatar className="cursor-pointer">
                        <AvatarImage src={user?.image!} />
                        <AvatarFallback>{user?.name!}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                    <h3>
                        {user?.name!}
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                        {user?.email!}
                    </p>
                    </div>
                            </div>
                            <Separator className='bg-muted-foreground' />
                            <ModeToggle />
                            <Separator className='bg-muted-foreground' />
                            <Button className='flex justify-between items-center w-full px-2 py-1 bg-destructive/30 hover:bg-destructive rounded-none rounded-b-lg' variant={'outline'} onClick={() => signOut()} > 
                                Sign out
                                <LogOut size={24} />
                            </Button>

            </div>

        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarDropdown
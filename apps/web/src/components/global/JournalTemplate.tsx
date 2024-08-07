'use client'

import { format } from 'date-fns'
import { Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

type Props = {
  entry: {
    id: string,
    body: string | null,
    createdAt: Date | null
  }[] 
}

const JournalTemplate = ({
  entry
}: Props) => {
  const router = useRouter()
  if(entry === undefined || !entry) {
    toast.error('No entry found')
    router.push('/menu')
    return 
  }

  return (
    <div className="overflow-hidden h-full flex flex-col p-3 rounded-lg border bg-background">
      {
        entry ? (
          <div className='flex flex-col gap-3' >
            <p className='flex gap-1 justify-start items-center text-muted-foreground' >
                        <Calendar size={20} />
                        {format(new Date(entry?.[0]?.createdAt!), 'dd MMMM yyyy')}
                    </p>
            <p className='text-lg flex w-full h-[800px] overflow-auto' >
              {entry?.[0]?.body}
            </p>
          </div>
        ) : (
          <p>No entry found</p>
        )
      }
    </div>
  )
}

export default JournalTemplate
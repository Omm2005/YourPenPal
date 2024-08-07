'use client'

import React from 'react'

import { ArrowRight, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addJournalEntry, sendEmail } from '@/server/actions'
import { toast } from 'sonner'
import { User } from 'next-auth'
import Navbar from './global/Navbar'
import {format} from 'date-fns'

type Props = {
  user: User
}

const JournalInput = ({user}: Props) => {
  const [journal , setJournal] = React.useState('')
  const [aiResponse, setAiResponse] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleOnSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    if(journal === '') {
      toast.info('Please write something before recording')
      return
    }

    try {

      const finalJournal = `Journal of ${user.name} - ${journal}`
      const response = await fetch('https://backend.omshah.workers.dev/api/journal?prompt=' + finalJournal)
      const data: { response: string } = await response.json()
      const res = await data.response
      const finalres = res.replace('[Your Name]' , 'Your friend')
      setAiResponse(finalres)
      const subject = finalres.split('</Subject>')[0]?.replace('<Subject>', '')
        
        const entry = await addJournalEntry(journal, aiResponse, subject!)
        if(entry.success === true) {
          toast.success('Journal entry added successfully')
        } else {
          toast.error('Failed to add journal entry')
        }

      const email = await sendEmail(subject!, finalres)
      if(email.success === true) toast.success('Email sent successfully')

      } catch (error) {
        toast.error('Failed to add journal entry' + error)
      } finally {

        setJournal('')
        setIsLoading(false)
      }
  }
  return (
    <form
      className="overflow-hidden h-full flex flex-col lg:w-1/2 w-5/6 gap-2 relative rounded-lg border bg-background"
      onSubmit={handleOnSubmit}
      >
      <div className='h-auto py-2 px-3' > 
      <Navbar user={user} />
      {/* <AvatarDropdown user={user} /> */}
      </div>
      <Textarea
        placeholder="Write your thoughts here..."
        value={journal}
        className="h-full px-4 focus-visible:ring-0 border-0 mb-12 resize-none text-lg focus-within:ring-1 focus-within:ring-ring"
        onChange={(e) => setJournal(e.target.value)}
         />
      <div className="flex items-center justify-between absolute bottom-3 w-full px-3">
        <div className='flex gap-1 justify-center items-center'>
        <Calendar size={20} />
        <p>
          {
            format(new Date(), "do MMMM, yyyy")
          }
        </p>
        </div>
        <Button type="submit" size="sm" className="gap-1.5" disabled={isLoading}>
          {
            isLoading ? 'Saving...' : (
              <>
              Save
              <ArrowRight size={20} />
              </>
            )
          }
        </Button>
      </div>
    </form>
  )
}

export default JournalInput
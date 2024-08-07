'use client'

import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ArrowUpRight, Calendar, Ellipsis, Ghost, MoveRight, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import AddNewButton from './AddNewButton'
import { Calendar as CalendarComponent } from '../ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { toast } from 'sonner'
import { deleteJournalEntry } from '@/server/actions'

type Props = {
    entries: {
        id: string,
        body: string | null,
        createdAt: Date | null
    }[] | undefined
}

const Entries = ({
    entries
}: Props) => {
    const [search, setSearch] = React.useState('')
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const router = useRouter()
    const [filteredEntries, setFilteredEntries] = React.useState<typeof entries>(entries)

    useEffect(() => {
        if(date) {
            setFilteredEntries(entries?.filter((entry: any) => format(new Date(entry.createdAt), "do MMMM yyyy") === format(date, "do MMMM yyyy")) || [])
        } else {
            setFilteredEntries(entries)
        }
    }, [date, entries])

  return (
    <div>
        <div className="flex items-center gap-2 p-3 border-b justify-between">
            <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg p-2 w-full"
            />
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date > new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
        </div>
        <div className='h-[850px] flex-flex-col w-full overflow-auto p-2' >
        {
            filteredEntries ? filteredEntries.length === 0 ? (
                <div className='flex flex-col justify-center items-center h-96' >
                    <Ghost size={100} className='animate-bounce' />
                    <p className='text-center text-2xl font-serif'>No entries found</p>
                    <AddNewButton />
                </div>
            ): 
            search.length > 0 ? filteredEntries.filter((entry: any) => entry.body?.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                <div className='flex flex-col justify-center items-center h-96' >
                    <Ghost size={100} className='animate-bounce' />
                    <p className='text-center text-2xl font-serif'>No entries found</p>
                    <AddNewButton />
                </div>
            ) : filteredEntries.map((entry: any, index: number) => (
                <div key={index} className={cn("p-3 hover:bg-muted my-2 border border-muted rounded-lg cursor-pointer " )} >
                    <div className='flex md:gap-2 gap-1 mb-2 text-muted-foreground md:flex-row flex-col justify-between w-full'>
                        <div className='flex gap-2' onClick={() => router.push(`/menu/${entry.id}`)} >
                        <p className='flex gap-1' >
                        {format(new Date(entry.createdAt), "do MMMM yyyy")}
                        </p>
                        <MoveRight size={20} className='md:flex hidden' />
                        <p className='flex gap-1' > 
                        {format(new Date(entry.createdAt), "hh:mm a")}
                        </p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Ellipsis size={20} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='w-auto p-1' align='end' >
                                <Button
                                    variant='outline'
                                    className='w-full flex justify-start items-center hover:scale-105 gap-3 border-0'
                                    onClick={() => router.push(`/menu/${entry.id}`)}
                                >
                                    <ArrowUpRight size={20} />
                                    View
                                </Button>
                                <DropdownMenuSeparator />
                                <Button
                                    variant='outline'
                                    className='w-full flex justify-start items-center hover:scale-105 gap-3 border-0 hover:bg-destructive/60'
                                    onClick={() => toast.promise(deleteJournalEntry(entry.id),
                                        {
                                            loading: 'Deleting entry',
                                            success: 'Entry deleted successfully',
                                            error: 'Failed to delete entry',
                                            finally: () => router.refresh()
                                        }
                                    ) }
                                >
                                    <Trash size={20} />
                                    Delete
                                </Button>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </div>
                    <p className='truncate' onClick={() => router.push(`/menu/${entry.id}`)} >{entry.body}</p>
                </div>
            )) : filteredEntries.map((entry: any, index: number) => (
                <div key={index} className={cn("p-3 hover:bg-muted my-2 border border-muted rounded-lg cursor-pointer " )} >
                <div className='flex md:gap-2 gap-1 mb-2 text-muted-foreground md:flex-row flex-col justify-between w-full'>
                    <div className='flex gap-2' onClick={() => router.push(`/menu/${entry.id}`)} >
                    <p className='flex gap-1' >
                    {format(new Date(entry.createdAt), "do MMMM yyyy")}
                    </p>
                    <MoveRight size={20} className='md:flex hidden' />
                    <p className='flex gap-1' > 
                    {format(new Date(entry.createdAt), "hh:mm a")}
                    </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Ellipsis size={20} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-auto p-1' align='end' >
                            <Button
                                variant='outline'
                                className='w-full flex justify-start items-center hover:scale-105 gap-3 border-0'
                                onClick={() => router.push(`/menu/${entry.id}`)}
                            >
                                <ArrowUpRight size={20} />
                                View
                            </Button>
                            <DropdownMenuSeparator />
                            <Button
                                variant='outline'
                                className='w-full flex justify-start items-center hover:scale-105 gap-3 border-0 hover:bg-destructive/60'
                                onClick={() => toast.promise(deleteJournalEntry(entry.id),
                                    {
                                        loading: 'Deleting entry',
                                        success: 'Entry deleted successfully',
                                        error: 'Failed to delete entry',
                                        finally: () => router.refresh()
                                    }
                                ) }
                            >
                                <Trash size={20} />
                                Delete
                            </Button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                <p className='truncate' onClick={() => router.push(`/menu/${entry.id}`)} >{entry.body}</p>
            </div>
          )) : (
              <div className='flex flex-col justify-center items-center h-96' >
                    <Ghost size={100} className='animate-bounce' />
                    <p className='text-center text-2xl font-serif'>No entries found</p>
                    <AddNewButton />
                </div>
          )
        }
        </div>
    </div>
  )
}

export default Entries
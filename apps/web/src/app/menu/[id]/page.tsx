import Navbar from "@/components/global/Navbar";
import { getServerAuthSession } from "@/server/auth";
import { getJournalEntryFromID } from "@/server/actions";
import JournalTemplate from "@/components/global/JournalTemplate";
import { redirect } from "next/navigation";

export default async function Page({
    params: { id },
}: {
    params: {
        id: string
    }
}) {
  const session = await getServerAuthSession()
  const user = session?.user
  if(!user) {
    return ('User not found')
  }
  
  const entry = await getJournalEntryFromID(id)
  console.log(entry)
  if(!entry.success || !entry.entry) {
      return ('Failed to get journal entries')
    }

    if(entry.entry.length === 0) {
        redirect('/menu')
    } 
    
    console.log(entry.entry)

  if(entry.entry.length > 1) {
    return ('Multiple entries found')
  }

  const journalEntry = entry.entry[0]


  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-6 gap-6 h-screen">
        <section 
      className="overflow-hidden h-full flex flex-col lg:w-1/2 w-5/6 gap-2 relative rounded-lg border bg-background"
        >
      <div className='h-auto py-2 px-3' > 
      <Navbar user={user} addNew />
      </div>
      <div className="flex flex-col p-4 h-full" >
        <JournalTemplate entry={journalEntry ? [journalEntry] : []} />
        </div>
        </section>
    </main>
  );
}

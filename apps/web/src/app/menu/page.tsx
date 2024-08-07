import Navbar from "@/components/global/Navbar";
import { getServerAuthSession } from "@/server/auth";
import { getAllJournalEntries } from "@/server/actions";
import Entries from "@/components/global/Entries";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerAuthSession()
  const user = session?.user
  if(!user) {
    return redirect('/')
  }

  const entries = await getAllJournalEntries()
  if(!entries.success) {
    return ('Failed to get journal entries')
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-6 gap-6 h-screen">
        <section 
      className="overflow-hidden h-full flex flex-col lg:w-1/2 w-5/6 gap-2 relative rounded-lg border bg-background"
        >
      <div className='h-auto py-2 px-3' > 
      <Navbar user={user} menu />
      </div>
      <div>
        <Entries entries={entries.entries} />
        </div>
        </section>
    </main>
  );
}

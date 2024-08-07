import JournalInput from "@/components/JournalInput";
import { getServerAuthSession } from "@/server/auth";
import { Landing } from "./Landing";
export default async function Page() {
  const session = await getServerAuthSession()
  const user = session?.user
  if(!user) {
    return <div className="flex justify-center items-center h-screen w-full">
      <Landing />
    </div>
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-6 gap-6 h-screen">
      <JournalInput user={user} />
    </main>
  );
}

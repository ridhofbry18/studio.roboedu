import { getAppSession } from "@/lib/auth"; export default async function Debug() { const session = await getAppSession(); return <pre>{JSON.stringify(session, null, 2)}</pre>; }

import { useAuth } from "components/AuthProvider"
import { PageLinks } from "components/PageLinks"
import { UserStatus } from "components/UserStatus"

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-red-600">Index</h1>
      <UserStatus />
      <PageLinks />
    </div>
  )
}

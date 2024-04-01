import { useAuth } from "components/AuthProvider"
import { PageLinks } from "components/PageLinks"
import { UserStatus } from "components/UserStatus"
import { useEffect } from "react"
import Link from "next/link"
export default function SignOut() {
  const { auth } = useAuth()

  useEffect(() => {
    auth.signOut()
  }, [auth])

  return (
    <div className="flex justify-center items-center h-screen flex-col ">
      <h1 className=" block">Sign Outed</h1>
      <Link href="/" className="text-8xl font-bold text-blue-500 hover:text-yellow-500 transition duration-500 ease-in-out">Back</Link>
    </div>
  )
}

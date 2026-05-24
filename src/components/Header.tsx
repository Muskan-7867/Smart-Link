import { Link, useRouter } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { authClient, useSession } from '#/lib/auth-client'
import { Button } from './ui/button'

export default function Header() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.invalidate()
        },
      },
    })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-lg dark:border-white/10 dark:bg-black/80">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-lg font-bold text-zinc-900 no-underline sm:px-4 sm:py-2 dark:text-white"
          >
           Smart Link
          </Link>
        </h2>

        <div className="order-3 ml-auto flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0">
       
          {session && (
            <Link
              to="/dashboard"
              className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              activeProps={{ className: 'text-zinc-900 dark:text-white' }}
            >
              Dashboard
            </Link>
          )}
        
        </div>

        <div className="order-2 ml-auto flex items-center gap-1.5 sm:order-3 sm:gap-2">
          {!isPending && (
            <>
              {session ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="h-9 border-zinc-200 px-3 text-xs text-zinc-900 transition-colors hover:bg-zinc-100 sm:text-sm dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                >
                  Logout
                </Button>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-3 text-xs text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 sm:text-sm dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button
                      size="sm"
                      className="h-9 bg-zinc-200 px-3 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-300 sm:text-sm dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                    >
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}

import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Link href="/" className="text-xl font-bold">
             بن اّسـر
          </Link>
          <p className="text-center text-sm text-muted-foreground md:text-right">
            بِنْبِيع المَزَاج
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 md:items-end">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()}  بن اّسـر . جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}

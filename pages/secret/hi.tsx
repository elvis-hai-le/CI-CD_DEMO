import Link from 'next/link'
import { NextResponse } from 'next/server'

export async function getStaticProps() {
  return { props: { isDark: false } }
}

export default function Page() {
  return (
    <body className="flex-col space-y-20 bg-inherit">
      <h1 className="text-9xl text-center animate-spin">🧐</h1>
      <h1 className="text-4xl text-center text-green-800 font-poppins">
        {' '}
        👋 Hi! glad you could make it for tea 🍵
      </h1>
      <h1 className="text-5xl text-center">
        <Link href="/">↩️</Link>
      </h1>
    </body>
  )
}

export async function GET() {
  const fruits = [
    { id: 1, name: '🍎' },
    { id: 2, name: '🍐' },
  ]
  return NextResponse.json(fruits, { status: 200 })
}

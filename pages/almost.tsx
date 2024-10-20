import Link from 'next/link'

export async function getStaticProps() {
  return { props: { isDark: true } }
}

export default function Page() {
  return (
    <h1 className="text-4xl text-center text-amber-300 font-poppins">
      <Link href="/secret/hi"> ▶️ ..almost there.. ▶️</Link>
    </h1>
  )
}

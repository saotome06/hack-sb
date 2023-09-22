import Image from 'next/image'

export default function Home() {
  return (
    <>
      <input type="file" capture="environment" accept="image/*"></input>
    </>
  )
}

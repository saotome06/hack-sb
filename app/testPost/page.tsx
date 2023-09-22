"use client"
import { useState } from 'react'

export default function Home() {
  const [name, setName] = useState('')
  const [postedData, setPostedData] = useState('')

  const onChangeHandler = (e: any) => {
    setName(e.target.value)
  }

  const onSubmitHandler = async (e: any) => {
    e.preventDefault()

    const res = await fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name }),
    })

    const data = await res.json()
    setPostedData(data.body)
  }
  return (
    <main>
      <h1>POSTテスト</h1>
      <form onSubmit={onSubmitHandler} className='flex flex-col justify-center' action='/api/form' method='POST'>
          <input value={name} onChange={onChangeHandler} type='text' name='name' placeholder='名前' 
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '2px solid #ccc',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
            fontSize: '16px',
            width: '100%',
            boxSizing: 'border-box',
            marginBottom: '10px'
          }}/>
          <button type='submit'>送信</button>
      </form>

      <p>APIから受け取った値{postedData}</p>
    </main>
  )
}
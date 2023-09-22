import { NextRequest } from "next/server"

export async function POST(request:NextRequest) {
  const body =await request.json()

  const returnBody =`POSTで受け取った値：${body.name}`

  return new Response(JSON.stringify({ body:returnBody}))
}
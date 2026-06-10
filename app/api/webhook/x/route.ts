import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      ok: true,
      message: 'Filtered Stream webhook placeholder. MVP collection runs through /api/collect cron.',
    },
    { status: 202 }
  )
}

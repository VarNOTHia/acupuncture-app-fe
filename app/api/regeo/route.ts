// /app/api/regeo/route.ts

import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  // 获取查询参数
  const url = new URL(req.url)
  const lat = url.searchParams.get('lat')
  const lon = url.searchParams.get('lon')

  if (!lat || !lon || isNaN(Number(lat)) || isNaN(Number(lon))) {
    return NextResponse.json({ error: 'Invalid latitude or longitude' }, { status: 400 })
  }

  // 调用高德地图 API
  const key = process.env.AMAP_API_KEY
  const apiUrl = `https://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${lon},${lat}`

  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch data from Amap API')
    }

    const data = await response.json();
    console.log(data);

    const city: string = data.regeocode?.addressComponent?.city || 'Unknown City'
    console.log(city);
    return NextResponse.json({ city })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

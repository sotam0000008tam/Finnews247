'use client'
import useSWR from 'swr'
import Marquee from 'react-fast-marquee'
const fetcher = (u)=>fetch(u).then(r=>r.json())
export default function LivePrices(){
  const {data} = useSWR('/api/prices', fetcher, { refreshInterval: 15000 })
  if(!data) return null
  return (
    <div className="bg-gray-900 text-white py-2 rounded mb-6">
      <Marquee gradient={false} speed={40}>
        {Array.isArray(data) && data.map(it=>(
          <div key={it.symbol} className="mx-6 flex items-center gap-3 text-sm">
            <span className="font-semibold">{it.symbol}</span>
            <span className={it.change>=0 ? 'text-green-400' : 'text-red-400'}>{it.price} {it.currency}</span>
          </div>
        ))}
      </Marquee>
    </div>
  )
}

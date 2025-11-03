import Link from 'next/link'
import React from 'react'

export default function NavRightBanner() {
  return (
    <div>{
                        <div className="rounded-xl bg-[#4b35f5] p-4 sm:p-6 text-white shadow-[0_18px_40px_rgba(19,16,34,0.18)]">
                          <div className="space-y-3">
                            <p className="text-sm opacity-95">Join more than</p>
                            <p className="text-2xl font-extrabold leading-tight"><span className="text-emerald-300">8 million</span><br/>learners<span className="opacity-90"> worldwide</span></p>
                            <Link
                              href="/signup"
                              className="mt-2 inline-flex items-center justify-center rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#0b0440] transition hover:bg-emerald-300"
                            >
                              Start Learning For Free
                            </Link>
                          </div>
                        </div>
                      }</div>
  )
}

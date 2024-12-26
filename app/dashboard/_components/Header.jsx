"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {
    const path = usePathname();
    useEffect(() => {
        console.log(path);
    }, []);

    return (
        <div className='flex p-4 items-center justify-between bg-gray-950 shadow-sm'>
            {/* Logo now wrapped in Link to make it clickable */}
            <Link href="/" className='cursor-pointer'>
                <span className='text-2xl font-bold text-gray-400 hover:text-gray-700 transition-colors'>
                    VintageGamesGPT
                </span>
            </Link>

            {/* Right-aligned header Menu items */}
            <ul className='flex gap-6 ml-auto'>
                <Link href={"/dashboard"}>
                    <li className={`text-gray-400 font-bold hover:text-gray-700 hover:font-bold transition-all
                    cursor-pointer
                    ${path == '/dashboard' && 'text-gray-400 font-bold'}
                    `}
                    >Dashboard</li>
                </Link>
                <Link href={"/dashboard/upgrade"}>
                    <li className={`text-gray-400 font-bold hover:text-gray-700 hover:font-bold transition-all
                    cursor-pointer
                    ${path == '/dashboard/upgrade' && 'text-gray-400 font-bold'}
                    `}
                    >Upgrade</li>
                </Link>
            </ul>

            {/* Wrapping UserButton in a div to apply margin */}
            <div className="ml-6">
                <UserButton />
            </div>
        </div>
    );
}

export default Header;
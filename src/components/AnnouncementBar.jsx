import React from 'react'
import './AnnouncementBar.css'
import { announcements } from '../data/data'

const AnnouncementBar = () => {
    return (
        <>
            <div className="bg-black text-white overflow-hidden whitespace-nowrap">
                <div className="">
                    <div className="marquee my-1">
                        {announcements.map((item, i) => (
                            Array.from({ length: item.loop }).map((_, j) => (
                                <span className="mx-14" key={i}>
                                    {item.msg}
                                </span>
                            ))
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AnnouncementBar

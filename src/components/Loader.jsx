import React from 'react'
import './Loader.css'
import { brand } from '../data/data'

const Loader = () => {
    return (
        <div className="loader">
            <div className="loader">
                {brand.split('').map((char, index) => (
                    <span key={index}>{char}</span>
                ))}
            </div>
        </div>
    )
}

export default Loader

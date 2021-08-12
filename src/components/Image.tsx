import { CSSProperties } from 'react'
import { useState } from 'react'

interface ImageProps {
    className: string,
    src: string | undefined,
    FallbackComponent: () => JSX.Element
    style?: CSSProperties
}

export default function Image({ className, src, FallbackComponent, style }: ImageProps) {
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)


    //If src is undefined return fallback
    if (!src) {
        return <FallbackComponent/>
    }
    
    return (
        <>

            { (loading || error) &&
                <FallbackComponent/>
            }

            <img
                className={className + ( (loading || error) && " hidden")}
                style={style}
                src={src}
                alt=""
                onError={() => setError(true)}
                onLoad={() => setLoading(false)}
            />

       </>
    )
}

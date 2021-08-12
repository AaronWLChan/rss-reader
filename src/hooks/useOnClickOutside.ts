import React, { useEffect } from 'react'

export default function useOnClickOutside( ref: React.RefObject<HTMLDivElement>, condition?: boolean, onClickOutside?: () => void, onClickInside?: () => void ) {
    useEffect(() => {
       
        const listener = (event: MouseEvent) => {

            if (condition || condition === undefined) {

                if (ref && ref.current) {
    
                    const element = event.target as Node
        
                    if (ref.current.contains(element)) {
                        
                        if (onClickInside){
                            onClickInside()
                        }
                        
                        return
                    }
        
                    if (onClickOutside) {
                        onClickOutside()
                    }

                } 

            }       
    
        }

        document.addEventListener("mousedown", listener)

        return () => {
            document.removeEventListener("mousedown", listener)
        }

    }, [ref, condition, onClickInside, onClickOutside])
}
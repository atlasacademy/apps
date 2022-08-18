import { useEffect, useRef, useState } from "react";

export default function useObserver(options: IntersectionObserverInit) {
    const [entries, setEntries] = useState<IntersectionObserverEntry[]>([])
    const [elements, setElements] = useState<Element[]>([]);

    const observer = useRef(new IntersectionObserver(ObserverEntries => {
        setEntries(ObserverEntries)
    }, options))

    useEffect(() => {
        const currentObserver = observer.current;
        
        currentObserver.disconnect()

        if(elements.length > 0) {
            elements.forEach(element => currentObserver.observe(element))
        }
        
        
        return () => {
            if (currentObserver) currentObserver.disconnect()
        }
    }, [elements])


    return {
        observer: observer.current,
        setElements,
        entries
    }
}
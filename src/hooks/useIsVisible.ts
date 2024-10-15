import { useEffect, useMemo, useState } from "react"

export default function useIsVisible(ref: any) {

    const [isIntersecting, setIntersecting] = useState(false)
  
    const observer = useMemo(() => new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting), {threshold: 1}
    ), [ref])
  
  
    //--below one is old. commented on 2024-07-28
    // useEffect(() => {
    //   observer.observe(ref.current)
    //   return () => observer.disconnect()
    // }, [])

    useEffect(() => {
      if (ref.current) {
        observer.observe(ref.current);
      }
      return () => {
        if (ref.current) {
          observer.disconnect();
        }
      };
    }, [ref, observer]);
  
    return isIntersecting
  }
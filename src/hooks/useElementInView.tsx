
"use client";
import { useEffect, useMemo, useState } from "react";

//-- Custom hook to determine if a referenced element is in view (visible in the viewport)
export default function useElementInView(ref: any) {

    //-- State to track whether the observed element is intersecting (visible in the viewport)
    const [isIntersecting, setIntersecting] = useState(false);
  
    //-- Memoized IntersectionObserver to avoid creating new instances on each render
    //-- The observer triggers the setIntersecting function based on the entry's isIntersecting property
    const observer = useMemo(() => 
      new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting), //- Update state when the observer detects a change in visibility
        { threshold: 0.1 } //-- Trigger when at least 10% of the element is visible
      ), 
      [ref] //-- The memoization ensures that the observer is recreated if the 'ref' dependency changes
    );
  
    useEffect(() => {
      if (ref.current) {
        observer.observe(ref.current); //-- Start observing the referenced element
      }
      //-- Cleanup function to disconnect the observer when the component unmounts or dependencies change
      return () => observer.disconnect();
    }, []); 
  
    return isIntersecting; //-- Return whether the element is intersecting (visible in the viewport)
}

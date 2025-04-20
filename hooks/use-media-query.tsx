"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook that returns true if the current viewport matches the provided media query
 * @param query The media query to check against
 * @returns A boolean indicating if the viewport matches the query
 */
export function useMediaQuery(query: string): boolean {
  // Default to false on the server or during initial client render
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Create media query list
    const media = window.matchMedia(query)
    
    // Set initial value
    setMatches(media.matches)
    
    // Define listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }
    
    // Add the callback listener to handle changes
    media.addEventListener("change", listener)
    
    // Clean up on unmount
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [query]) // Re-run effect if query changes

  return matches
}
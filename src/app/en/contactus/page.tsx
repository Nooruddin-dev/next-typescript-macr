import React from 'react'

import { Metadata } from 'next';
import Link from 'next/link';
import { getLocaleFromURL } from '@/Routes/routeHelper';



export const metadata: Metadata = {
    title: 'Contact Us Title',
    description: 'Its contact us page',
    
    openGraph: {
      type: 'website',
      url: 'https://yourwebsite.com/contact', // Replace with your site's URL
      title: 'Contact Us Title',
      description: 'Its contact us page',
      images: [
        {
          url: 'https://yourwebsite.com/image.jpg', // Replace with your image URL
          width: 800,
          height: 600,
          alt: 'Contact Us Image',
        },
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      title: 'Contact Us Title twitter',
      description: 'Its contact us page',
      images: ['https://yourwebsite.com/image.jpg'], // Replace with your image URL
    },
  };
export default function page() {

  return (
    <div>
        
        <h1>Contact Us Page</h1>
    </div>
  )
}

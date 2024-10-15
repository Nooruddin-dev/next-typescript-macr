import React from 'react'

import { Metadata } from 'next';
import Link from 'next/link';



export const metadata: Metadata = {
    title: 'Contact Us Title',
    description: 'Its contact us page',
    
    openGraph: {
      type: 'website',
      url: 'https://yourwebsite.com/contact', // Replace with your site's URL
      title: 'Contact Us Title',
      description: 'Its contact us page description',
      images: [
        {
          url: 'https://ichef.bbci.co.uk/images/ic/1200xn/p0jv314s.jpg', // Replace with your image URL
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
      images: ['https://ichef.bbci.co.uk/images/ic/1200xn/p0jv314s.jpg'], // Replace with your image URL
    },
  };
export default function page() {

  return (
    <div>
        
        <h1>Contact Us Page</h1>
    </div>
  )
}

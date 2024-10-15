import HomePage from '@/components/Views/HomePage'
import React from 'react'

import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Coding Beauty',
//   description:
//     'codingbeautydev.com: Coding - the art, the science, and the passion.',
// };

type Props = {
  params: { id: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const id = params.id;
  
  //const url = `https://api.mysocialapp.com/posts/${id}`;
  const url = `https://jsonplaceholder.typicode.com/todos/1`;
  const post = await fetch(url).then((res) => res.json());
  return {
    title: post.title,
    description: post.title,
  };
}

export default function page({ params }: Props) {
  const { id } = params;

  return (

    <>
    
      <HomePage />
    </>
  )
}

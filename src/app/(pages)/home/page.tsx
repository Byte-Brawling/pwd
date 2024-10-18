import { ContentLayout } from '@/components/layouts/content'
import React from 'react'

export default function page() {
  return (
    <ContentLayout title='Home'>
    <div className='text-4xl text-center snap-center'>Welcome home</div>
    </ContentLayout>
  )
}

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Instagram Posts - Marathon Majors | Distanz Running',
  description: 'Generate Instagram-ready posts for the 7 Marathon Majors',
}

export default function InstagramPostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout ensures the Instagram posts page renders without navbar/footer
  // The posts are full-screen static images meant to be downloaded
  return (
    <div className="instagram-posts-layout">
      {children}
    </div>
  )
}

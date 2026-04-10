'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Heart, MessageCircle } from 'lucide-react'

const communityPosts = [
  {
    id: 1,
    author: 'María López',
    content: 'Acabo de terminar el curso de maquillaje profesional y ¡estoy fascinada! Las técnicas enseñadas fueron increíbles.',
    likes: 24,
    comments: 5,
    avatar: '👩‍🦱',
  },
  {
    id: 2,
    author: 'Ana García',
    content: 'Mi primer cliente usando lo aprendido en POWERWOMAN. ¡Gracias por empoderarme a ser emprendedora!',
    likes: 42,
    comments: 8,
    avatar: '👩‍💼',
  },
  {
    id: 3,
    author: 'Sofía Martínez',
    content: 'La comunidad de POWERWOMAN me ha dado la confianza que necesitaba. Somos increíbles juntas!',
    likes: 35,
    comments: 6,
    avatar: '👩',
  },
]

export default function CommunityPage() {
  const [newPost, setNewPost] = useState('')
  const [posts, setPosts] = useState(communityPosts)
  const [liked, setLiked] = useState<{ [key: number]: boolean }>({})

  const handleAddPost = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: 'Tú',
        content: newPost,
        likes: 0,
        comments: 0,
        avatar: '👤',
      }
      setPosts([post, ...posts])
      setNewPost('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-12">Comunidad</h1>

            {/* Create Post */}
            <div className="max-w-2xl mb-12 bg-card rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">¿Qué tienes que compartir?</h2>
              <Textarea
                placeholder="Cuéntale a la comunidad tu historia..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-4"
              />
              <Button onClick={handleAddPost} className="w-full">
                Publicar
              </Button>
            </div>

            {/* Posts */}
            <div className="max-w-2xl space-y-6">
              <h2 className="text-2xl font-bold">Posts Recientes</h2>
              {posts.map((post) => (
                <div key={post.id} className="bg-card rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-3xl">{post.avatar}</div>
                    <div className="flex-1">
                      <h3 className="font-bold">{post.author}</h3>
                      <p className="text-sm text-muted-foreground">Hace poco</p>
                    </div>
                  </div>
                  <p className="text-foreground mb-4">{post.content}</p>
                  <div className="flex gap-6 text-muted-foreground">
                    <button
                      onClick={() => setLiked({ ...liked, [post.id]: !liked[post.id] })}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <Heart
                        className="h-4 w-4"
                        fill={liked[post.id] ? 'currentColor' : 'none'}
                      />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

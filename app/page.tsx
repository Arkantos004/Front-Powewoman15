import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FeaturedCourses } from "@/components/featured-courses"
import { Community } from "@/components/community"
import { Products } from "@/components/products"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedCourses />
        <Community />
        <Products />
      </main>
      <Footer />
    </div>
  )
}

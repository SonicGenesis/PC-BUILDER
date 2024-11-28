import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 font-roboto">
            Build Your Dream PC
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover premium computer components for your next build. From processors to graphics cards, we've got everything you need.
          </p>
          <Link
            href="/pcBuilder"
            className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-full text-lg font-medium hover:opacity-80 transition-opacity inline-block"
          >
            Start Building →
          </Link>
        </div>
      </section>
      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Popular Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div key={category.name} className="group relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-xl font-bold text-white">{category.name}</h3>
                <p className="text-gray-200 mt-2">{category.count} products</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const categories = [
  {
    name: 'Processors',
    image: '/images/PROCESSOR.jpg',
    count: 24
  },
  {
    name: 'Graphics Cards',
    image: '/images/GRAPGHIC_CARD.jpg',
    count: 18
  },
  {
    name: 'Memory',
    image: '/images/RAM.jpg',
    count: 32
  },
  {
    name: 'Storage',
    image: '/images/MEMORY.jpg',
    count: 45
  }
];
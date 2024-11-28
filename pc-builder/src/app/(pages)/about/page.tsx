import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Building the perfect PC
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
              for you
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your journey to the perfect custom PC build starts here
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800"
            >
              <div className="w-12 h-12 mb-6 relative">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  fill
                  className="object-contain [filter:brightness(0)_invert(0.8)_sepia(1)_saturate(1)_hue-rotate(180deg)]"
                />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square">
            <Image
              src="/images/pc-build-preview.jpg"
              alt="PC Builder Interface"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Why Choose Our Platform?</h2>
            <div className="space-y-6">
              {valueProps.map((prop) => (
                <div key={prop.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-purple-400 to-cyan-400 flex items-center justify-center">
                    {prop.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{prop.title}</h3>
                    <p className="text-gray-400">{prop.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/pcBuilder"
              className="inline-block mt-8 px-8 py-4 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full font-medium text-black hover:opacity-90 transition-opacity"
            >
              Start Building Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const features = [
  {
    title: 'Comprehensive Marketplace',
    description: 'Access a vast selection of PC components with real-time price comparisons across major retailers.',
    icon: '/icons/marketplace.svg'
  },
  {
    title: 'Compatibility Checker',
    description: 'Our smart system ensures all your chosen components work perfectly together.',
    icon: '/icons/compatibility.svg'
  },
  {
    title: 'Dynamic PC Builder',
    description: 'Intuitive interface to design and customize your dream PC build with real-time updates.',
    icon: '/icons/builder.svg'
  }
];

const valueProps = [
  {
    title: 'Real-time Price Tracking',
    description: 'Get the best deals with our automated price comparison system.',
    icon: <span>💰</span>
  },
  {
    title: 'Expert Recommendations',
    description: 'Receive personalized component suggestions based on your needs and budget.',
    icon: <span>🎯</span>
  },
  {
    title: 'Community Driven',
    description: 'Join thousands of PC enthusiasts and share your builds with the community.',
    icon: <span>👥</span>
  }
];

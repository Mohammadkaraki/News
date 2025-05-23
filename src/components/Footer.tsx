import Link from 'next/link';
import { FiTwitter, FiFacebook, FiInstagram, FiLinkedin, FiYoutube, FiArrowRight } from 'react-icons/fi';

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Terms', href: '/terms-of-service' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Careers', href: '/careers' },
    { name: 'FAQ', href: '/faq' },
  ],
  categories: [
    { name: 'Stories', href: '/category/stories' },
    { name: 'Creator', href: '/category/creator' },
    { name: 'Community', href: '/category/community' },
    { name: 'Technology', href: '/category/technology' },
    { name: 'Business', href: '/category/business' },
    { name: 'Health', href: '/category/health' },
  ],
  social: [
    { name: 'Twitter', icon: FiTwitter, href: '#' },
    { name: 'Facebook', icon: FiFacebook, href: '#' },
    { name: 'Instagram', icon: FiInstagram, href: '#' },
    { name: 'LinkedIn', icon: FiLinkedin, href: '#' },
    { name: 'YouTube', icon: FiYoutube, href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-4">
              <h2 className="text-2xl font-bold text-primary flex items-center">
                <span className="bg-primary text-white px-2 py-1 rounded-md mr-1">B</span>
                uletin
              </h2>
            </Link>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Craft narratives that ignite inspiration, knowledge, and entertainment. 
              Stay informed with our expert coverage of global news, trends, and insights.
            </p>
            <div className="flex space-x-5">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-primary transition-colors duration-200"
                  aria-label={item.name}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {navigation.categories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-500 hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-500 hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-4 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Get the latest news and articles to your inbox every month.
            </p>
            <form className="flex flex-col space-y-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="py-2.5 px-4 w-full rounded-l-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-700 text-white font-medium rounded-r-lg p-2.5 flex items-center justify-center transition-colors duration-200 min-w-[48px]"
                  aria-label="Subscribe"
                >
                  <FiArrowRight className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Buletin. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/terms-of-service" className="text-xs text-gray-400 hover:text-gray-600">
                Terms
              </Link>
              <Link href="/privacy-policy" className="text-xs text-gray-400 hover:text-gray-600">
                Privacy
              </Link>
              <Link href="/cookies" className="text-xs text-gray-400 hover:text-gray-600">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 
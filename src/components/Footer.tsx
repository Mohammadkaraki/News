import Link from 'next/link';
import { FiTwitter, FiFacebook, FiInstagram, FiLinkedin, FiYoutube, FiArrowRight } from 'react-icons/fi';

const navigation = {
  main: [
    { name: 'من نحن', href: '/about' },
    { name: 'اتصل بنا', href: '/contact' },
    { name: 'الشروط', href: '/terms-of-service' },
    { name: 'سياسة الخصوصية', href: '/privacy-policy' },
    { name: 'الوظائف', href: '/careers' },
    { name: 'الأسئلة الشائعة', href: '/faq' },
  ],
  categories: [
    { name: 'قصص', href: '/category/stories' },
    { name: 'منشئ المحتوى', href: '/category/creator' },
    { name: 'المجتمع', href: '/category/community' },
    { name: 'تكنولوجيا', href: '/category/technology' },
    { name: 'أعمال', href: '/category/business' },
    { name: 'صحة', href: '/category/health' },
  ],
  social: [
    { name: 'تويتر', icon: FiTwitter, href: '#' },
    { name: 'فيسبوك', icon: FiFacebook, href: '#' },
    { name: 'انستغرام', icon: FiInstagram, href: '#' },
    { name: 'لينكد إن', icon: FiLinkedin, href: '#' },
    { name: 'يوتيوب', icon: FiYoutube, href: '#' },
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
                <span className="bg-primary text-white px-2 py-1 rounded-md ml-1">أ</span>
                خبار
              </h2>
            </Link>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              اصنع قصصاً تشعل الإلهام والمعرفة والترفيه. 
              ابق على اطلاع بتغطيتنا الخبيرة للأخبار العالمية والاتجاهات والرؤى.
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
              الفئات
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
              الشركة
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
              اشترك في نشرتنا الإخبارية
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              احصل على آخر الأخبار والمقالات في بريدك الإلكتروني كل شهر.
            </p>
            <form className="flex flex-col space-y-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="عنوان بريدك الإلكتروني"
                  className="py-2.5 px-4 w-full rounded-r-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-700 text-white font-medium rounded-l-lg p-2.5 flex items-center justify-center transition-colors duration-200 min-w-[48px]"
                  aria-label="اشتراك"
                >
                  <FiArrowRight className="h-5 w-5 rtl-flip" />
                </button>
              </div>
              <p className="text-xs text-gray-400">
                بالاشتراك، فإنك توافق على سياسة الخصوصية وتوافق على تلقي التحديثات.
              </p>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} أخبار. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-6 space-x-reverse">
              <Link href="/terms-of-service" className="text-xs text-gray-400 hover:text-gray-600">
                الشروط
              </Link>
              <Link href="/privacy-policy" className="text-xs text-gray-400 hover:text-gray-600">
                الخصوصية
              </Link>
              <Link href="/cookies" className="text-xs text-gray-400 hover:text-gray-600">
                ملفات تعريف الارتباط
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 
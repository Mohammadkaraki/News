export default function FAQPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-center">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-center">Find answers to common questions about Buletin</p>
        </header>
        
        <div className="space-y-8">
          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">About Buletin</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">What is Buletin?</h3>
                <p className="text-gray-700">
                  Buletin is a modern news platform dedicated to providing reliable, timely, and engaging news coverage across various categories including politics, technology, business, entertainment, sports, and more.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Who writes the articles on Buletin?</h3>
                <p className="text-gray-700">
                  Our content is created by experienced journalists, industry experts, and professional writers who are passionate about delivering accurate and insightful news coverage. Each article undergoes thorough fact-checking and editorial review.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Is Buletin available in languages other than English?</h3>
                <p className="text-gray-700">
                  Currently, Buletin is only available in English. However, we are working on expanding our services to include additional languages in the future. Stay tuned for updates!
                </p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Account & Subscription</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Do I need an account to read articles?</h3>
                <p className="text-gray-700">
                  No, you can browse and read a limited number of articles without creating an account. However, signing up for a free account gives you access to additional features such as saving articles, customizing your feed, and participating in discussions.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">What are the benefits of a premium subscription?</h3>
                <p className="text-gray-700">
                  Premium subscribers enjoy unlimited access to all articles, ad-free reading experience, exclusive content, early access to special features, and the ability to download articles for offline reading. Premium members also receive our curated weekly newsletter.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">How do I cancel my subscription?</h3>
                <p className="text-gray-700">
                  You can cancel your subscription at any time through your account settings. Navigate to "Subscription" and click on "Cancel Subscription." Your premium access will remain active until the end of your current billing period.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Is there a refund policy?</h3>
                <p className="text-gray-700">
                  We offer a 14-day money-back guarantee for new subscribers. If you're not satisfied with our premium service within the first 14 days, contact our customer support team for a full refund. After this period, refunds are considered on a case-by-case basis.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Content & Features</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">How often is content updated?</h3>
                <p className="text-gray-700">
                  Our platform is updated 24/7 with breaking news and fresh content. Major categories receive multiple updates throughout the day, ensuring you always have access to the latest news and developments.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Can I save articles to read later?</h3>
                <p className="text-gray-700">
                  Yes, registered users can save articles to their reading list for later access. Simply click the bookmark icon on any article to save it. Your reading list can be accessed from your account dashboard.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Does Buletin have a mobile app?</h3>
                <p className="text-gray-700">
                  Yes, Buletin is available as a mobile app for both iOS and Android devices. You can download the app from the Apple App Store or Google Play Store to enjoy a seamless reading experience on your mobile device.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">How can I share articles with others?</h3>
                <p className="text-gray-700">
                  Each article has social sharing buttons that allow you to easily share content on platforms like Facebook, Twitter, LinkedIn, or via email. You can also copy the article link to share it directly with friends and colleagues.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Technical & Support</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">I found an error in an article. How do I report it?</h3>
                <p className="text-gray-700">
                  We appreciate feedback that helps improve our content quality. At the bottom of each article, you'll find a "Report an Error" link. Click it to submit details about the error, and our editorial team will review and address it promptly.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">How can I contact customer support?</h3>
                <p className="text-gray-700">
                  Our customer support team is available via email at support@buletin.com. For premium subscribers, we also offer live chat support available Monday through Friday, 9 AM to 6 PM EST.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Is my personal information secure?</h3>
                <p className="text-gray-700">
                  Yes, we take data security seriously. We employ industry-standard encryption and security measures to protect your personal information. For more details, please review our Privacy Policy.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Can I submit a story or tip to Buletin?</h3>
                <p className="text-gray-700">
                  We welcome news tips and story ideas from our readers. Please email tips@buletin.com with your information. For security-sensitive matters, we offer encrypted communication options detailed on our Contact page.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Still have questions?</h3>
            <p className="text-gray-700 mb-4">
              If you couldn't find the answer you were looking for, please reach out to our support team.
            </p>
            <a href="/contact" className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition duration-200">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 
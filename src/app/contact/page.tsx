export default function ContactPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            We'd love to hear from you. Reach out with questions, feedback, or inquiries.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="font-bold text-lg mb-3">Editorial</h3>
            <p className="text-gray-600 mb-2">For news tips and submissions</p>
            <p className="text-primary font-medium">editorial@buletin.com</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="font-bold text-lg mb-3">Business</h3>
            <p className="text-gray-600 mb-2">For advertising and partnerships</p>
            <p className="text-primary font-medium">business@buletin.com</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="font-bold text-lg mb-3">Support</h3>
            <p className="text-gray-600 mb-2">For technical issues and account help</p>
            <p className="text-primary font-medium">support@buletin.com</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Your email address"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="What is your message about?"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="How can we help you?"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="btn"
            >
              Send Message
            </button>
          </form>
        </div>
        
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold mb-2">Headquarters</h3>
          <p className="text-gray-600">
            123 News Avenue, Media District<br />
            New York, NY 10001
          </p>
        </div>
      </div>
    </div>
  );
} 
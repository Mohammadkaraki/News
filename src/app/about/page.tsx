import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Buletin</h1>
          <p className="text-xl text-gray-600">
            Delivering trusted news and insightful stories from around the world
          </p>
        </header>
        
        <div className="prose lg:prose-xl max-w-none mb-16">
          <p>
            Buletin is a modern news platform that seeks to deliver accurate, timely, and meaningful stories that matter to our readers. Founded in 2023, our mission is to craft narratives that ignite inspiration, knowledge, and entertainment.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            At Buletin, we believe in the power of well-crafted journalism to inform, educate, and inspire. Our team of experienced reporters and editors work tirelessly to bring you the most important stories from around the globe, covering everything from politics and business to technology, health, sports, and entertainment.
          </p>
          
          <div className="my-10 relative aspect-video">
            <Image 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" 
              alt="Buletin editorial team" 
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <h2>Our Values</h2>
          <ul>
            <li><strong>Accuracy:</strong> We are committed to factual reporting and thorough fact-checking.</li>
            <li><strong>Independence:</strong> We maintain editorial independence and journalistic integrity.</li>
            <li><strong>Fairness:</strong> We present diverse perspectives and balanced coverage.</li>
            <li><strong>Transparency:</strong> We are open about our sources and correct errors promptly.</li>
            <li><strong>Innovation:</strong> We embrace new technologies and storytelling formats.</li>
          </ul>
          
          <h2>Our Team</h2>
          <p>
            Buletin brings together a diverse team of journalists, editors, photographers, and digital media professionals who are passionate about quality journalism. Our newsroom spans multiple countries, allowing us to provide local context to global stories.
          </p>
          
          <h2>Join Us</h2>
          <p>
            We're always looking for talented individuals to join our team. If you're passionate about journalism and digital media, check out our careers page for current opportunities.
          </p>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="mb-4">
            Have questions, feedback, or news tips? We'd love to hear from you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Editorial</h3>
              <p>editorial@buletin.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Press Inquiries</h3>
              <p>press@buletin.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Advertising</h3>
              <p>ads@buletin.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Careers</h3>
              <p>careers@buletin.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
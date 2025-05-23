export default function CareersPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-center">Careers at Buletin</h1>
          <p className="text-gray-600 text-center text-lg">Join our team and help shape the future of digital news</p>
        </header>
        
        <div className="prose lg:prose-lg max-w-none">
          <h2>Why work with us?</h2>
          <p>
            At Buletin, we're passionate about delivering high-quality journalism in the digital age. We're looking for talented, curious, and innovative individuals to join our diverse team of writers, editors, designers, developers, and business professionals.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 my-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Impact</h3>
              <p className="text-gray-700">
                Your work will reach millions of readers worldwide, helping them stay informed and make sense of a complex world.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-gray-700">
                We're constantly experimenting with new formats, technologies, and business models to shape the future of news.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Growth</h3>
              <p className="text-gray-700">
                We invest in our team members' professional development and provide opportunities to learn, advance, and take on new challenges.
              </p>
            </div>
          </div>
          
          <h2>Open Positions</h2>
          
          <div className="space-y-8 mb-12">
            <div className="border-b pb-6">
              <h3 className="text-2xl font-bold mb-2">Senior Technology Reporter</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <span className="mr-4">Full-time</span>
                <span className="mr-4">•</span>
                <span>New York or Remote</span>
              </div>
              <p className="mb-4">
                We're looking for an experienced technology reporter to cover the latest developments in AI, tech policy, and the business of technology. You'll write news stories, features, and analysis pieces that explain complex tech concepts to a general audience.
              </p>
              <a href="/careers/apply?position=senior-tech-reporter" className="inline-block px-5 py-2 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition">
                Apply Now
              </a>
            </div>
            
            <div className="border-b pb-6">
              <h3 className="text-2xl font-bold mb-2">Frontend Developer</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <span className="mr-4">Full-time</span>
                <span className="mr-4">•</span>
                <span>Remote</span>
              </div>
              <p className="mb-4">
                Join our engineering team to build and improve our reader-facing website and apps. You'll work with React, Next.js, and other modern frontend technologies to create fast, accessible, and engaging user experiences.
              </p>
              <a href="/careers/apply?position=frontend-developer" className="inline-block px-5 py-2 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition">
                Apply Now
              </a>
            </div>
            
            <div className="border-b pb-6">
              <h3 className="text-2xl font-bold mb-2">Audience Engagement Editor</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <span className="mr-4">Full-time</span>
                <span className="mr-4">•</span>
                <span>New York or Remote</span>
              </div>
              <p className="mb-4">
                Help grow our audience and deepen reader engagement across platforms. You'll develop social media strategies, analyze audience data, and work with our editorial team to optimize content for different channels and formats.
              </p>
              <a href="/careers/apply?position=audience-editor" className="inline-block px-5 py-2 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition">
                Apply Now
              </a>
            </div>
            
            <div className="border-b pb-6">
              <h3 className="text-2xl font-bold mb-2">Business Reporter, Finance</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <span className="mr-4">Full-time</span>
                <span className="mr-4">•</span>
                <span>London or Remote</span>
              </div>
              <p className="mb-4">
                Cover financial markets, banking, fintech, and economic policy for our growing business section. You'll break news, spot trends, and explain complex financial concepts to our diverse readership.
              </p>
              <a href="/careers/apply?position=finance-reporter" className="inline-block px-5 py-2 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition">
                Apply Now
              </a>
            </div>
          </div>
          
          <h2>Internship Program</h2>
          <p>
            We offer paid internships for students and early-career professionals in journalism, design, engineering, and business. Our internships run for 10-12 weeks and provide hands-on experience working with our teams.
          </p>
          <p>
            Applications for summer internships open in January, and applications for fall internships open in June. Check back for specific openings or email <a href="mailto:internships@buletin.com" className="text-primary hover:underline">internships@buletin.com</a> with questions.
          </p>
          
          <h2>Benefits</h2>
          <ul>
            <li>Competitive salary</li>
            <li>Health, dental, and vision insurance</li>
            <li>401(k) retirement plan with employer match</li>
            <li>Generous paid time off</li>
            <li>Parental leave</li>
            <li>Professional development budget</li>
            <li>Flexible remote work options</li>
            <li>Employee resource groups</li>
            <li>Company-wide wellness initiatives</li>
          </ul>
          
          <h2>Our Commitment to Diversity</h2>
          <p>
            Buletin is committed to building a diverse and inclusive workplace where everyone feels welcome and can do their best work. We actively seek candidates from all backgrounds, experiences, and perspectives. We're an equal opportunity employer and prohibit discrimination based on race, color, religion, gender, sexual orientation, national origin, disability, age, or any other protected characteristic.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mt-8 text-center">
            <h3 className="text-xl font-bold mb-3">Don't see the right position?</h3>
            <p className="mb-4">
              We're always interested in connecting with talented people. Send your resume and a brief introduction to:
            </p>
            <a href="mailto:careers@buletin.com" className="text-primary font-medium hover:underline">careers@buletin.com</a>
          </div>
        </div>
      </div>
    </div>
  );
} 
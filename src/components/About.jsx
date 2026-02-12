function About() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-primary/5 via-white to-primary/5 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="inline-block">
              <span className="text-primary font-body text-sm sm:text-base px-5 py-2 rounded-full bg-white border-2 border-primary/20 shadow-sm">
                About Us
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold leading-tight">
              <span className="text-primary">Introducing MedEase</span>
              <br />
              <span className="text-gray-900">Your Partner in Medicine</span>
            </h2>

            <p className="text-gray-600 font-body text-base sm:text-lg md:text-xl leading-relaxed">
              We are here to make your study grind smoother, smarter, and less stressful. From module-wise quizzes to OSPE preps, we've got your back through exams.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 font-body text-base sm:text-lg">
                  <span className="font-semibold text-gray-900">Module-wise Quizzes</span> - Comprehensive subject coverage with targeted practice questions
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 font-body text-base sm:text-lg">
                  <span className="font-semibold text-gray-900">OSPE Preparation</span> - Real exam scenarios to build your clinical confidence
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 font-body text-base sm:text-lg">
                  <span className="font-semibold text-gray-900">Exam Strategies</span> - Expert guidance and marking secrets from toppers
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 font-body text-base sm:text-lg">
                  <span className="font-semibold text-gray-900">Complete Support</span> - From last-minute revisions to structured learning paths
                </p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2 px-2 sm:px-0">
            <div className="relative max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
              {/* Decorative background blur */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl blur-2xl transform scale-95"></div>
              
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white max-h-[400px] sm:max-h-[500px] lg:max-h-[600px]">
                <img 
                  src="/about.jpg" 
                  alt="MedEase - Your Partner in Medicine"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-6 bg-white rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 border-2 border-primary/20 max-w-[180px] sm:max-w-none">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl sm:text-2xl font-heading font-bold text-gray-900">10,000+</p>
                    <p className="text-xs sm:text-sm text-gray-600 font-body">Active Students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About


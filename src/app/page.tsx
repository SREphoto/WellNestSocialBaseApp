import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  Heart,
  MessageCircle,
  Users,
  SmilePlus,
  Sparkles,
  Brain,
  Palette,
  Check,
} from "lucide-react";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How WellNest Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform creates a safe space for emotional well-being
              tracking and meaningful connections with the people who matter
              most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <SmilePlus className="w-6 h-6" />,
                title: "Mood Updates",
                description:
                  "Share how you're feeling with color-coded 'Moodies' that represent your emotional state",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Friend Dashboard",
                description:
                  "See at a glance how your loved ones are doing with user cards and mood indicators",
              },
              {
                icon: <MessageCircle className="w-6 h-6" />,
                title: "WellStream Feed",
                description:
                  "Chronological feed of mood updates from connections with support options",
              },
              {
                icon: <Palette className="w-6 h-6" />,
                title: "Shared Whiteboard",
                description:
                  "Collaborative spaces to share notes, resources, and support",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-green-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Benefits of WellNest</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover how WellNest can transform your relationships and support
              emotional well-being.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <Heart className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Strengthen Connections
              </h3>
              <p className="text-gray-600">
                Stay meaningfully connected with loved ones through regular mood
                updates and supportive interactions.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <Brain className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Mental Health Awareness
              </h3>
              <p className="text-gray-600">
                Track emotional patterns over time and gain insights into your
                mental well-being journey.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <Sparkles className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Supportive Community
              </h3>
              <p className="text-gray-600">
                Create a circle of trust where everyone feels safe to share and
                receive genuine support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-green-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-green-100">Mood Updates Shared</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-green-100">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from people who have transformed their relationships through
              WellNest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah J.",
                role: "Mental Health Advocate",
                quote:
                  "WellNest has completely changed how I stay connected with my family. Being able to see how everyone is feeling has deepened our relationships.",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
              },
              {
                name: "Michael T.",
                role: "Parent & Caregiver",
                quote:
                  "As a parent of teenagers, WellNest has opened up conversations about emotions that we never had before. It's been transformative for our family.",
                avatar:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
              },
              {
                name: "Priya K.",
                role: "Remote Worker",
                quote:
                  "Living far from my loved ones was taking a toll on me. WellNest helps me feel connected despite the distance, and I love the mood tracking feature.",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-xl shadow-sm relative"
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-4 border-white"
                  />
                </div>
                <div className="pt-6">
                  <p className="text-gray-600 italic mb-6">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for you and your wellness circle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Basic</h3>
              <div className="text-green-600 font-bold text-3xl mb-1">Free</div>
              <p className="text-gray-500 mb-6">Perfect for getting started</p>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Up to 5 connections</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic mood tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>WellStream feed</span>
                </li>
              </ul>

              <a
                href="/sign-up"
                className="w-full py-3 text-center text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                Get Started
              </a>
            </div>

            {/* Premium Plan */}
            <div className="bg-white p-8 rounded-xl shadow-md border-2 border-green-500 flex flex-col relative transform scale-105">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Premium</h3>
              <div className="text-green-600 font-bold text-3xl mb-1">
                $4.99
              </div>
              <p className="text-gray-500 mb-6">Per month, billed monthly</p>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited connections</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced mood analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Shared whiteboard spaces</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>

              <a
                href="/sign-up"
                className="w-full py-3 text-center text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Premium
              </a>
            </div>

            {/* Family Plan */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Family</h3>
              <div className="text-green-600 font-bold text-3xl mb-1">
                $9.99
              </div>
              <p className="text-gray-500 mb-6">Per month, billed monthly</p>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Up to 8 family members</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>All Premium features</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Family analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Dedicated support</span>
                </li>
              </ul>

              <a
                href="/sign-up"
                className="w-full py-3 text-center text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                Choose Family
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white" id="faq">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about WellNest and how it works.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            {[
              {
                question: "How does WellNest protect my privacy?",
                answer:
                  "WellNest takes privacy seriously. Your data is encrypted and stored securely. You have complete control over who can see your mood updates and personal information. We never share your data with third parties without your explicit consent.",
              },
              {
                question: "Can I use WellNest to track my children's moods?",
                answer:
                  "Yes, WellNest is designed for families. With our Family plan, parents can connect with their children (13+ years) to view their mood updates. We've designed this with appropriate privacy controls so teens maintain autonomy while parents can stay informed.",
              },
              {
                question: "How is WellNest different from social media?",
                answer:
                  "Unlike traditional social media, WellNest is focused exclusively on emotional well-being and meaningful connections with close friends and family. There are no ads, no algorithms promoting engagement, and no public posting. It's a private space for your wellness circle.",
              },
              {
                question: "Can I export my mood data?",
                answer:
                  "Yes, Premium and Family plan users can export their mood data in various formats for personal use or to share with healthcare providers if desired.",
              },
              {
                question: "Is there a mobile app available?",
                answer:
                  "Yes, WellNest is available on iOS and Android devices. You can download the app from the App Store or Google Play Store to track moods and stay connected on the go.",
              },
            ].map((faq, index) => (
              <div key={index} className="py-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Your Wellness Circle Today
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Create meaningful connections and support the emotional well-being
            of those who matter most.
          </p>
          <a
            href="/sign-up"
            className="inline-flex items-center px-6 py-3 text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors"
          >
            Create Your Account
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  SignInButton as ClerkSignInButton,
  SignUpButton as ClerkSignUpButton,
} from "@clerk/nextjs";
import { Mic, FileText, Brain } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { getCurrentUser } from "@/core/services/clerk/lib/getCurrentUser";
import { ThemeToggle } from "@/core/components/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        <p className="text-2xl font-bold tracking-tight">Landr</p>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Suspense
            fallback={
              <ClerkSignInButton forceRedirectUrl="/app">
                <Button variant="outline">Sign In</Button>
              </ClerkSignInButton>
            }>
            <SignInButton />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}

async function SignInButton() {
  const { userId } = await getCurrentUser();
  const isUserLoggedIn = userId != null;

  if (isUserLoggedIn) return redirect("/app");

  return (
    <ClerkSignInButton forceRedirectUrl="/app">
      <Button variant="outline">Sign In</Button>
    </ClerkSignInButton>
  );
}

function HeroSection() {
  return (
    <section className="container px-6 py-20 md:py-32 flex flex-col items-center text-center gap-8 max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
        Master Your Job Interview with{" "}
        <span className="bg-linear-to-r from-primary to-primary/70 text-transparent bg-clip-text text-nowrap">
          AI-Powered
        </span>{" "}
        Preparation
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl">
        Accelerate your job search with personalized AI-powered tools. Get
        feedback on your resume, practice with mock interviews, and understand
        job descriptions like a pro.
      </p>
      <ClerkSignUpButton>
        <Button size="lg" className="text-base h-12">
          Get Started for Free
        </Button>
      </ClerkSignUpButton>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "AI Interview Practice",
      description:
        "Engage in realistic mock interviews with our AI interviewer. Get instant feedback on your responses, body language, and communication style.",
      icon: <Mic className="w-6 h-6 text-primary" />,
    },
    {
      title: "Tailored Resume Suggestions",
      description:
        "Optimize your resume for specific job postings. Our AI analyzes job requirements and suggests targeted improvements to highlight your strengths.",
      icon: <FileText className="w-6 h-6 text-primary" />,
    },
    {
      title: "Technical Questions Practice",
      description:
        "Practice answering technical questions tailored to the job description. Get instant feedback on your responses and improve your chances of landing an interview.",
      icon: <Brain className="w-6 h-6 text-primary" />,
    },
  ];

  return (
    <section className="container mx-auto px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card
            className="transition-all hover:shadow-lg hover:scale-[1.02]"
            key={feature.title}>
            <CardHeader className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                {feature.icon}
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t mt-20 container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-sm text-muted-foreground">
        © 2025 Landr. All rights reserved.
      </p>
      <div className="flex gap-6 text-sm text-muted-foreground">
        <Link href="#" className="hover:text-foreground transition-colors">
          Privacy Policy
        </Link>
        <Link href="#" className="hover:text-foreground transition-colors">
          Terms of Service
        </Link>
        <Link href="#" className="hover:text-foreground transition-colors">
          Contact
        </Link>
      </div>
    </footer>
  );
}

import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Checkbox } from './components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import './styles/globals.css';

function App() {
  const [email, setEmail] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted:', { email, agreeToTerms });
    setLoading(false);
  };

  // Toggle dark mode
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Dark mode toggle */}
      <div className="mb-8 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️' : '🌙'} Toggle Theme
        </Button>
      </div>

      {/* Hero Section */}
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          StellarIX UI + Tailwind CSS
        </h1>
        <p className="mb-12 text-xl text-muted-foreground">
          Beautiful, accessible components with complete styling freedom
        </p>
      </div>

      {/* Component Showcase */}
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Button Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>
              All button variants with Tailwind CSS styling
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </CardContent>
        </Card>

        {/* Button Sizes */}
        <Card>
          <CardHeader>
            <CardTitle>Button Sizes</CardTitle>
            <CardDescription>
              Responsive button sizes for different use cases
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🚀</Button>
          </CardContent>
        </Card>

        {/* Button States */}
        <Card>
          <CardHeader>
            <CardTitle>Button States</CardTitle>
            <CardDescription>
              Interactive states with visual feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
            <Button loading loadingText="Processing...">
              With Loading Text
            </Button>
          </CardContent>
        </Card>

        {/* Form Example */}
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Newsletter Signup</CardTitle>
            <CardDescription>
              Example form with validation and loading states
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={!email && agreeToTerms}
                errorMessage={!email && agreeToTerms ? 'Email is required' : undefined}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={!email || !agreeToTerms}
              >
                Subscribe
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Custom Styled Components */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Tailwind Styles</CardTitle>
            <CardDescription>
              Components with custom Tailwind utility classes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
              Gradient Button
            </Button>
            <Button className="bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white">
              Custom Outline
            </Button>
            <Button className="rounded-full bg-green-500 text-white hover:bg-green-600 px-8">
              Rounded Button
            </Button>
            <Button className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
              Elevated Button
            </Button>
          </CardContent>
        </Card>

        {/* Responsive Example */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Design</CardTitle>
            <CardDescription>
              Components that adapt to different screen sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full sm:w-auto px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base lg:px-6 lg:py-3 lg:text-lg">
              Responsive Button
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-sm text-muted-foreground">
        <p>
          Built with{' '}
          <a href="https://stellarix-ui.dev" className="underline">
            StellarIX UI
          </a>{' '}
          and{' '}
          <a href="https://tailwindcss.com" className="underline">
            Tailwind CSS
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
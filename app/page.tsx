import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Resume Builder App</h1>
          <p className="text-xl text-muted-foreground">
            A modular, ATS-friendly resume generator
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Generate Resume</CardTitle>
              <CardDescription>
                Create professional resumes from structured JSON input
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Generate ATS-compliant resumes in PDF or HTML format using our
                professional templates.
              </p>
              <Button disabled>Coming Soon</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enhance Resume</CardTitle>
              <CardDescription>
                AI-powered resume enhancement based on job descriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Tailor your resume to specific job postings using AI-powered
                enhancement.
              </p>
              <Button disabled>Coming Soon</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>ATS-compliant resume generation</li>
              <li>Multiple professional templates</li>
              <li>AI-powered resume enhancement</li>
              <li>PDF and HTML output formats</li>
              <li>Built-in ATS validation</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

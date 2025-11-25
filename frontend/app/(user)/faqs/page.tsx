import { cache } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, HelpCircle, MessageSquare } from "lucide-react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  display_order?: number;
  is_active?: boolean;
}

export const revalidate = 300;

const getFaqs = cache(async () => {
  const result = await api.faq.getAllFAQs({ is_active: true });
  if (result.success && result.data?.faqs) return result.data.faqs as FAQ[];
  throw new Error(result.error || "Failed to fetch FAQs");
});

export default async function FAQPage() {
  let faqs: FAQ[] = [];
  let error: string | null = null;

  try {
    faqs = await getFaqs();
  } catch (e: any) {
    error = e.message || "Failed to load FAQs";
  }

  const hasFaqs = faqs.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="text-left">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-primary">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Find answers to common questions about our CTF platform
          </p>
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Content */}
        {!error && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">
                {faqs.length} {faqs.length === 1 ? "Question" : "Questions"}
              </span>
            </div>

            {hasFaqs ? (
              <Accordion type="single" collapsible className="space-y-4">
                {faqs
                  .sort(
                    (a, b) => (a.display_order || 0) - (b.display_order || 0)
                  )
                  .map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id.toString()}
                      className="border border-border rounded-lg px-4 bg-card hover:bg-muted/50 transition-colors"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <span className="text-card-foreground font-medium text-lg">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4 pt-2">
                        <div
                          className="prose max-w-none dark:prose-invert prose-p:text-muted-foreground prose-a:text-primary"
                          dangerouslySetInnerHTML={{
                            __html: faq.answer.replaceAll(
                              String.raw`\\n`,
                              "<br />"
                            ),
                          }}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            ) : (
              <Card className="bg-card border-dashed border-border text-center py-12">
                <CardHeader>
                  <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No FAQs Found
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No FAQs available at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Stats */}
        {!error && hasFaqs && (
          <div className="mt-8 text-center text-muted-foreground/60 text-sm">
            Showing {faqs.length} FAQs
          </div>
        )}
      </div>
    </div>
  );
}

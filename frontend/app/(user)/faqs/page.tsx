"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  HelpCircle,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const result = await api.faq.getAllFAQs({
        is_active: true,
      });

      if (result.success && result.data) {
        setFaqs(result.data.faqs || []);
        setError(null);
      } else {
        setError(result.error || "Failed to fetch FAQs");
        setFaqs([]);
      }
    } catch (error) {
      setError("An error occurred while fetching FAQs" + error);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 6 }, (_, index) => (
            <Card
              key={`faq-skeleton-${index}`}
              className="bg-card border-border"
            >
              <CardHeader>
                <Skeleton className="h-6 w-3/4 bg-muted" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2 bg-muted" />
                <Skeleton className="h-4 w-2/3 bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (faqs.length > 0) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">
              {filteredFaqs.length}{" "}
              {filteredFaqs.length === 1 ? "Question" : "Questions"}
            </span>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">No matching questions found</p>
              <Button
                variant="link"
                onClick={() => setSearchTerm("")}
                className="mt-2"
              >
                Clear search
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs
                .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                .map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id.toString()}
                    className="border border-border rounded-lg px-4 bg-card hover:bg-muted/50 transition-colors"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <div className="flex items-start justify-between w-full gap-4">
                        <span className="text-card-foreground font-medium text-lg">
                          {faq.question}
                        </span>
                        {faq.category && (
                          <Badge variant="secondary" className="shrink-0">
                            {faq.category}
                          </Badge>
                        )}
                      </div>
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
          )}
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">
          No FAQs Found
        </h3>
        <p className="text-muted-foreground/60 mb-6">
          No FAQs available at the moment
        </p>
        <Button onClick={fetchFAQs} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl">
        {/* Navigation Header */}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-left mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-primary">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Find answers to common questions about our CTF platform
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* FAQ Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {renderContent()}
        </motion.div>

        {/* Statistics */}
        {!loading && faqs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center text-muted-foreground/60 text-sm"
          >
            Showing {faqs.length} FAQs
          </motion.div>
        )}
      </div>
    </div>
  );
}

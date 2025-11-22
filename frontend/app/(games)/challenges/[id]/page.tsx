"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Download, Trophy, Flag, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Challenge {
  id: number;
  title: string;
  description: string;
  level: number;
  points: number;
  attachment?: string;
  attachments?: string;
}

export default function ChallengePage() {
  const params = useParams();
  const challengeId = Number(params.id);

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flagInput, setFlagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    points?: number;
  } | null>(null);

  useEffect(() => {
    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId]);

  const fetchChallenge = async () => {
    try {
      const result = await api.challenges.getOneChallenge(challengeId);
      if (result.success && result.data) {
        setChallenge(result.data);
      } else {
        setError(result.error || "Failed to fetch challenge");
      }
    } catch (error) {
      console.error("Failed to fetch challenge:", error);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagInput.trim()) return;

    setSubmitting(true);
    setSubmissionResult(null);

    try {
      const result = await api.challenges.submitChallenge(challengeId, {
        solution: flagInput.trim(),
      });

      if (result.success && result.data) {
        setSubmissionResult({
          success: result.data.correct,
          message: result.data.message,
          points: result.data.points_awarded,
        });

        if (result.data.correct) {
          setFlagInput("");
        }
      } else {
        setSubmissionResult({
          success: false,
          message: result.error || "Submission failed",
        });
      }
    } catch (error) {
      console.error("Flag submission error:", error);
      setSubmissionResult({
        success: false,
        message: "Network error occurred during submission",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-4xl space-y-6">
          <Skeleton className="h-10 w-40 bg-muted/50" />
          <Skeleton className="h-12 w-3/4 bg-muted/50" />
          <Skeleton className="h-32 w-full bg-muted/30" />
          <Skeleton className="h-24 w-full bg-muted/30" />
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Error Loading Challenge
              </h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Link href="/challenges">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Challenges
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/challenges">
            <Button variant="ghost" className="text-foreground hover:bg-muted">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Challenges
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                {challenge.title}
              </h1>
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20">
                <Trophy className="w-5 h-5" />
                <span className="font-bold text-lg text-primary">
                  {challenge.points} pts
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-6">
            <div>
              <p className="text-foreground text-lg leading-relaxed whitespace-pre-wrap">
                {challenge.description}
              </p>
            </div>

            {(challenge.attachment || challenge.attachments) && (
              <div>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() =>
                    window.open(
                      challenge.attachment || challenge.attachments,
                      "_blank"
                    )
                  }
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download{" "}
                  {(challenge.attachment || challenge.attachments || "")
                    .split("/")
                    .pop() || "Attachment"}
                </Button>
              </div>
            )}
          </div>

          {/* Flag Submission Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Flag className="w-5 h-5 text-primary" />
              Submit Flag
            </h2>

            <form onSubmit={handleFlagSubmit} className="space-y-4">
              <div className="flex gap-3 flex-col sm:flex-row">
                <Input
                  placeholder="flag{your_flag_here}"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  className="font-mono text-base h-12 border-2 focus:border-primary flex-1"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting || !flagInput.trim()}
                  className="h-12 px-6 whitespace-nowrap"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Flag className="w-4 h-4 mr-2" />
                      Submit Flag
                    </>
                  )}
                </Button>
              </div>

              {submissionResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border-2 ${
                    submissionResult.success
                      ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
                      : "bg-destructive/10 border-destructive/30 text-destructive"
                  }`}
                >
                  <p className="font-medium">
                    {submissionResult.message}
                    {submissionResult.success &&
                      submissionResult.points &&
                      ` (+${submissionResult.points} points)`}
                  </p>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

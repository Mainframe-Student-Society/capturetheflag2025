"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { api } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Trophy,
  CheckCircle,
  Clock,
  RefreshCw,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface Challenge {
  id: number;
  title: string;
  description: string;
  level: number;
  points: number;
  attachment?: string;
}

interface ApiResponse {
  available: Challenge[];
  completed: Challenge[];
}

const ChallengeCard = ({
  challenge,
  isCompleted,
}: {
  challenge: Challenge;
  isCompleted: boolean;
}) => (
  <Card
    className={`group relative overflow-hidden border-2 transition-all duration-300 h-full flex flex-col ${
      isCompleted
        ? "bg-accent/5 border-accent/30 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/20"
        : "bg-card border-border hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
    }`}
  >
    <CardHeader className="pb-3 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <CardTitle className="text-lg font-bold leading-tight text-card-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1 flex items-center gap-2">
          {isCompleted && (
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          )}
          {challenge.title}
        </CardTitle>
        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full shrink-0 text-xs font-semibold">
          <Trophy className="w-3 h-3" />
          <span>{challenge.points}</span>
        </div>
      </div>
    </CardHeader>

    <CardContent className="flex-1 flex flex-col pt-0 space-y-4">
      <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
        {challenge.description}
      </CardDescription>
      {challenge.attachment && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Attachment available</span>
            </div>
          </div>
        </div>
      )}

      <Link href={`/challenges/${challenge.id}`} className="mt-auto">
        <Button
          disabled={isCompleted}
          onClick={(e) => {
            if (isCompleted) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className={`w-full font-medium py-2.5 transition-all duration-200 ${
            isCompleted
              ? "bg-accent text-accent-foreground opacity-60 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-md"
          }`}
        >
          {isCompleted ? "Completed" : "Start Challenge"}
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const EmptyState = ({ type }: { type: "available" | "completed" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="text-center py-16 px-6"
  >
    <div
      className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
        type === "available"
          ? "bg-primary/10 text-primary"
          : "bg-accent/10 text-accent"
      }`}
    >
      {type === "available" ? (
        <Clock className="w-10 h-10" />
      ) : (
        <CheckCircle className="w-10 h-10" />
      )}
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">
      {type === "available"
        ? "No Challenges Available"
        : "No Completed Challenges"}
    </h3>
    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
      {type === "available"
        ? "All challenges are currently under review. Check back soon for exciting new challenges!"
        : "Complete your first challenge to track your progress and showcase your skills!"}
    </p>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
    <div className="container mx-auto max-w-7xl space-y-8">
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-80 mx-auto bg-muted/50" />
        <Skeleton className="h-6 w-96 mx-auto bg-muted/30" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-8 w-64 bg-muted/50" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-64 bg-muted/30 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function ChallengesPage() {
  const [available, setAvailable] = useState<Challenge[]>([]);
  const [completed, setCompleted] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"available" | "completed">(
    "available"
  );
  const [authChecked, setAuthChecked] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  // Auth check & redirect
  useEffect(() => {
    const token = api.auth.getAuthToken?.();
    if (!token || !api.auth.isAuthenticated()) {
      setRedirecting(true);
      router.replace(`/login?next=${encodeURIComponent("/challenges")}`);
      return;
    }
    setAuthChecked(true);
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.challenges.getAllChallenges();
      // Redirect on unauthorized
      if (result.status === 401 || result.status === 403) {
        setRedirecting(true);
        router.replace(`/login?next=${encodeURIComponent("/challenges")}`);
        return;
      }
      if (result.success && result.data) {
        const data = result.data as unknown as ApiResponse;
        setAvailable(data.available || []);
        setCompleted(data.completed || []);
      } else {
        setError("Failed to load challenges");
      }
    } catch (err) {
      setError("Network error occurred: " + err);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch after auth confirmed
  useEffect(() => {
    if (authChecked && !redirecting) {
      fetchData();
    }
  }, [authChecked, redirecting]);

  if (redirecting || !authChecked) {
    return <LoadingSkeleton />;
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-card border-destructive/20">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                s Something went wrong
              </h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button
              onClick={fetchData}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentChallenges = activeTab === "available" ? available : completed;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className=" space-y-4"
        >
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary">
              CTF Challenges
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg  mx-auto leading-relaxed">
              Test you mainframe skills with our carefully crafted challenges
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Tab Navigation */}
          <div className="flex items-center justify-center w-full">
            <div className="inline-flex w-full bg-muted p-1 rounded-lg pointer">
              <button
                onClick={() => setActiveTab("available")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === "available"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="font-medium">Available</span>
                <span className="bg-background/20 text-xs px-2 py-0.5 rounded-full ml-2">
                  {available.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("completed")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === "completed"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Completed</span>
                <span className="bg-background/20 text-xs px-2 py-0.5 rounded-full ml-2">
                  {completed.length}
                </span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {currentChallenges.length === 0 ? (
              <EmptyState type={activeTab} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentChallenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * index }}
                  >
                    <ChallengeCard
                      challenge={challenge}
                      isCompleted={activeTab === "completed"}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

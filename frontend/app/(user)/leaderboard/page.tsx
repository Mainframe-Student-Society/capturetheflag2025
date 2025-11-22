"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trophy,
  Medal,
  Crown,
  Users,
  GraduationCap,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface LeaderboardEntry {
  id: number;
  username: string;
  points: number;
  rank: number;
  is_wlv_student?: boolean;
}

const LeaderboardTable = ({ data }: { data: LeaderboardEntry[] }) => (
  <div className="space-y-4">
    {!Array.isArray(data) || data.length === 0 ? (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-20 px-6"
      >
        <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">
          No Rankings Yet
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto text-base">
          Be the first to solve challenges and claim your spot on the
          leaderboard!
        </p>
      </motion.div>
    ) : (
      data.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.03 }}
        >
          <Card className="border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="px-4 py-2 bg-muted rounded-full">
                      <span className="text-sm font-bold text-foreground">
                        #{entry.rank}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground">
                        {entry.username}
                      </h3>
                      {entry.rank <= 3 && (
                        <Badge className="bg-primary text-primary-foreground text-xs font-semibold">
                          TOP {entry.rank}
                        </Badge>
                      )}
                    </div>
                    {entry.is_wlv_student && (
                      <Badge
                        variant="outline"
                        className="text-xs border-primary text-primary"
                      >
                        <GraduationCap className="w-3 h-3 mr-1" />
                        WLV Student
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-primary" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                      {entry.points.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">points</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))
    )}
  </div>
);

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-8 h-8 text-yellow-500" />;
    case 2:
      return <Medal className="w-8 h-8 text-gray-500" />;
    case 3:
      return <Medal className="w-8 h-8 text-amber-600" />;
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-muted border-2 border-border flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">{rank}</span>
        </div>
      );
  }
};

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
    <div className="container mx-auto max-w-5xl space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-12 w-80 bg-muted/50" />
        <Skeleton className="h-6 w-96 bg-muted/30" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-12 w-64 bg-muted/50" />
        <div className="space-y-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-20 bg-muted/30 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function LeaderboardPage() {
  const [globalLeaderboard, setGlobalLeaderboard] = useState<
    LeaderboardEntry[]
  >([]);
  const [wlvLeaderboard, setWlvLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("global");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchLeaderboards();

    // Set up auto-refresh every 1 minute (60000 ms)
    const interval = setInterval(() => {
      fetchLeaderboards(true); // Pass true for silent refresh
    }, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboards = async (silentRefresh = false) => {
    if (!silentRefresh) {
      setLoading(true);
    }
    setError(null);

    try {
      const [globalResult, wlvResult] = await Promise.all([
        api.leaderboard.getLeaderboard(),
        api.leaderboard.getWlvLeaderboard(),
      ]);

      if (globalResult.success) {
        const globalData = globalResult.data;
        setGlobalLeaderboard(Array.isArray(globalData) ? globalData : []);
      } else {
        console.error("❌ Global leaderboard failed:", globalResult.error);
      }

      if (wlvResult.success) {
        const wlvData = wlvResult.data;
        setWlvLeaderboard(Array.isArray(wlvData) ? wlvData : []);
      } else {
        console.error("❌ WLV leaderboard failed:", wlvResult.error);
        console.error("🔍 WLV error details:", wlvResult);
      }

      if (!globalResult.success && !wlvResult.success) {
        setError("Failed to fetch leaderboard data");
      } else {
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("🔥 Leaderboard fetch error:", err);
      setError("Network error occurred");
    } finally {
      if (!silentRefresh) {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Something went wrong
              </h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => fetchLeaderboards(false)} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentData =
    activeTab === "global" ? globalLeaderboard : wlvLeaderboard;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left space-y-6"
        >
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                Leaderboard
              </h1>

              {lastUpdated && (
                <div className="flex items-center gap-3 text-sm bg-muted/50 w-fit rounded-full px-4 py-1.5 border border-border/50 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-foreground font-medium whitespace-nowrap">
                      Live
                    </span>
                  </div>
                  <span className="text-muted-foreground/40">|</span>
                  <span className="text-muted-foreground whitespace-nowrap">
                    Updated {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>

            <p className="text-muted-foreground text-lg max-w-2xl">
              Compete with the best mainframe technology enthusiasts and
              showcase your skills
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-8"
        >
          {/* Tab Navigation */}
          <div className="flex w-full">
            <div className="inline-flex w-full bg-muted p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("global")}
                className={`w-1/2 flex items-center justify-between gap-3 px-4 py-3 rounded-md transition-all duration-300 font-medium ${
                  activeTab === "global"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted-foreground/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span>Global Rankings</span>
                </div>
                <span className="bg-background/80 text-xs px-2 py-1 rounded-full font-bold text-foreground">
                  {globalLeaderboard.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("wlv")}
                className={`w-1/2 flex items-center justify-between gap-3 px-4 py-3 rounded-md transition-all duration-300 font-medium ${
                  activeTab === "wlv"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted-foreground/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5" />
                  <span>WLV Students</span>
                </div>
                <span className="bg-background/80 text-xs px-2 py-1 rounded-full font-bold text-foreground">
                  {wlvLeaderboard.length}
                </span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="w-full">
              <LeaderboardTable data={currentData} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

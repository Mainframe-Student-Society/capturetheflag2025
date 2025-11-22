"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Trophy,
  Target,
  Mail,
  LogOut,
  Shield,
  Crown,
  Activity,
  Medal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

interface UserStats {
  rank: number;
  points: number;
  total_users: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initProfile = async () => {
      try {
        const storedData = localStorage.getItem("userData");
        if (!storedData) {
          router.push("/login");
          return;
        }

        const parsedUser = JSON.parse(storedData);
        setUser(parsedUser);

        // Fetch leaderboard to determine rank and points
        let currentRank = 0;
        let currentPoints = 0;
        let totalUsers = 0;

        try {
          const leaderboardResponse = await api.leaderboard.getLeaderboard();
          if (
            leaderboardResponse.success &&
            Array.isArray(leaderboardResponse.data)
          ) {
            totalUsers = leaderboardResponse.data.length;
            const userEntry = leaderboardResponse.data.find(
              (entry) => entry.username === parsedUser.username
            );

            if (userEntry) {
              currentRank = userEntry.rank;
              currentPoints = userEntry.points;
            } else {
              // Fallback if user not found in leaderboard (e.g. 0 points)
              currentPoints = parsedUser.score || 0;
            }
          }
        } catch (err) {
          console.error("Failed to fetch leaderboard data", err);
          // Fallback to stored data on error
          currentPoints = parsedUser.score || 0;
        }

        setStats({
          points: currentPoints,
          rank: currentRank,
          total_users: totalUsers,
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    initProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      router.push("/login");
    }
  };

  const getUserInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const getTitleFromScore = (score: number) => {
    if (score >= 1000) return "Cyber Expert";
    if (score >= 500) return "Security Analyst";
    if (score >= 200) return "Script Kiddie";
    if (score >= 50) return "Novice Hacker";
    return "Beginner";
  };

  const getProgress = (score: number) => {
    // 10 tasks * 100 points = 1000 max points
    const maxPoints = 1000;
    return Math.min((score / maxPoints) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-5xl space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-48 bg-muted/50" />
            <Skeleton className="h-6 w-96 bg-muted/30" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-64 bg-muted/30 rounded-xl" />
            <Skeleton className="h-64 bg-muted/30 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            Player Profile
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Track your progress, achievements, and standing in the competition
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full border-border/60 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-2xl border border-primary/20">
                    {getUserInitials(user.username)}
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{user.username}</h2>
                    <Badge variant="secondary" className="font-normal">
                      {getTitleFromScore(stats?.points || 0)}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Player ID: #{user.id}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full border-border/60 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Performance Stats</span>
                </CardTitle>
                <CardDescription>
                  Your current standing in the CTF
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="flex justify-center mb-2">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {stats?.points.toLocaleString() || 0}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">
                      Total Points
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-accent/5 border border-accent/10">
                    <div className="flex justify-center mb-2">
                      <Crown className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="text-3xl font-bold text-foreground">
                      #{stats?.rank || "-"}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">
                      Global Rank
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total Progress
                    </span>
                    <span className="font-medium">
                      {Math.round(getProgress(stats?.points || 0))}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${getProgress(stats?.points || 0)}%`,
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    Complete all 10 challenges to reach 100%
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-2"
          >
            <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button
                    onClick={() => router.push("/challenges")}
                    className="h-12 text-base"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Solve Challenges
                  </Button>
                  <Button
                    onClick={() => router.push("/leaderboard")}
                    variant="outline"
                    className="h-12 text-base"
                  >
                    <Medal className="w-5 h-5 mr-2" />
                    View Leaderboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

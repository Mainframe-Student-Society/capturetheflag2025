"use client";
import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Crown, GraduationCap, Medal, Trophy } from "lucide-react";

interface Winner {
  rank: number;
  username: string;
  name: string;
  points: string | number;
  linkedin: string;
}

const WINNERS: Winner[] = [
  {
    rank: 1,
    username: "Jigsaw",
    name: "Ben Fulbrook",
    points: "49,600",
    linkedin: "https://www.linkedin.com/in/ben-fulbrook-2bb12b22b",
  },
  {
    rank: 2,
    username: "Anwar",
    name: "Anwar Syed Ali",
    points: "49,600",
    linkedin: "https://www.linkedin.com/in/anwar-syed-ali/",
  },
];
const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-20 h-20 text-yellow-500 drop-shadow-lg" />;
    case 2:
      return <Medal className="w-20 h-20 text-gray-400 drop-shadow-lg" />;
    default:
      return (
        <div className="w-20 h-20 rounded-full bg-muted border-4 border-border flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{rank}</span>
        </div>
      );
  }
};
export default function Winner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-foreground">
        Winners of MaSS CTF 2025
      </h2>
      <div className="grid md:grid-cols-2 gap-6 mx-auto">
        {WINNERS.map((winner, index) => (
          <motion.div
            key={winner.rank}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.03, y: -8 }}
          >
            <Card
              className={`border-2 transition-all duration-300 hover:shadow-2xl ${
                winner.rank === 1
                  ? "border-yellow-500 bg-linear-to-br from-yellow-500/10 to-yellow-500/5 hover:from-yellow-500/15 hover:to-yellow-500/10"
                  : "border-gray-400 bg-linear-to-br from-gray-400/10 to-gray-400/5 hover:from-gray-400/15 hover:to-gray-400/10"
              }`}
            >
              <CardContent className="p-8 text-center space-y-6">
                <div className="flex justify-center mb-2">
                  {getRankIcon(winner.rank)}
                </div>

                <div className="space-y-3">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-sm font-bold text-primary">
                      {winner.rank === 1 ? "🥇 1st Place" : "🥈 2nd Place"}
                    </span>
                  </div>

                  <a
                    href={winner.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <h3 className="text-3xl font-bold text-primary group-hover:text-primary/80 transition-colors underline decoration-primary/30 decoration-2 underline-offset-4 group-hover:decoration-primary group-hover:decoration-[3px]">
                      {winner.name}
                    </h3>
                  </a>

                  <p className="text-base text-muted-foreground font-medium">
                    @{winner.username}
                  </p>

                  <Badge
                    variant="outline"
                    className="text-sm border-primary text-primary px-3 py-1"
                  >
                    <GraduationCap className="w-4 h-4 mr-1.5" />
                    WLV Student
                  </Badge>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-center gap-3">
                    <Trophy className="w-6 h-6 text-primary" />
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">
                        {winner.points.toLocaleString()}
                      </span>
                      <span className="text-base text-muted-foreground font-medium">
                        points
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

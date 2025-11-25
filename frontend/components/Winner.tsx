import Image from "next/image";
import * as motion from "motion/react-client";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Crown, GraduationCap, Medal, Trophy } from "lucide-react";

interface Winner {
  rank: number;
  username: string;
  name: string;
  points: string | number;
  image: string;
  linkedin: string;
}

const WINNERS: Winner[] = [
  {
    rank: 1,
    username: "Jigsaw",
    name: "Ben Fulbrook",
    points: "49,600",
    image: "/ben.jpeg",
    linkedin: "https://www.linkedin.com/in/ben-fulbrook-2bb12b22b",
  },
  {
    rank: 2,
    username: "Anwar",
    name: "Anwar Syed Ali",
    points: "49,600",
    image: "/anwar.jpeg",
    linkedin: "https://www.linkedin.com/in/anwar-syed-ali/",
  },
];
const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-8 h-8 text-yellow-500" />;
    case 2:
      return <Medal className="w-8 h-8 text-gray-500" />;
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-muted border-2 border-border flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">{rank}</span>
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
        Winners of MaSS CTF - Tuesday 25th November 2025
      </h2>
      <div className="grid md:grid-cols-2 gap-6  mx-auto">
        {WINNERS.map((winner, index) => (
          <motion.div
            key={winner.rank}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <Card
              className={`border-2 transition-all duration-300 hover:shadow-2xl ${
                winner.rank === 1
                  ? "border-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10"
                  : "border-gray-400 bg-gray-400/5 hover:bg-gray-400/10"
              }`}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary">
                  <Image
                    src={winner.image}
                    alt={winner.username}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-1">
                    {winner.rank === 1 ? "1st Place" : "2nd Place"}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {getRankIcon(winner.rank)}
                    <a
                      href={winner.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <h3 className="text-2xl font-bold text-primary underline decoration-primary decoration-1 underline-offset-4 hover:decoration-2">
                        {winner.name}
                      </h3>
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    @{winner.username}
                  </p>
                  {winner && (
                    <Badge
                      variant="outline"
                      className="text-xs border-primary text-primary mb-3"
                    >
                      <GraduationCap className="w-3 h-3 mr-1" />
                      WLV Student
                    </Badge>
                  )}
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span className="text-xl font-bold text-foreground">
                      {winner.points.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      points
                    </span>
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

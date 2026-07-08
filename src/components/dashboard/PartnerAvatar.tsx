import dragonImg from "@/assets/dragon-master.png";
import phoenixImg from "@/assets/phoenix-trend.png";
import tigerImg from "@/assets/tiger-volatility.png";
import elonImg from "@/assets/elon-v2.png";
import gamblingImg from "@/assets/gambling-v2.png";
import aladdinImg from "@/assets/aladdin-v2.png";
import luckyStarImg from "@/assets/lucky-star-v2.png";
import acheloisImg from "@/assets/achelois-v2.png";
import { TrendingUp, Gamepad2 } from "lucide-react";

const partnerAvatarMap: Record<string, string> = {
  dragon: dragonImg,
  "dragon-master": dragonImg,
  phoenix: phoenixImg,
  "phoenix-trend": phoenixImg,
  tiger: tigerImg,
  "tiger-volatility": tigerImg,
  elon: elonImg,
  "elon-v2": elonImg,
  gambling: gamblingImg,
  "gambling-v2": gamblingImg,
  "god-of-gambling": gamblingImg,
  aladdin: aladdinImg,
  "aladdin-v2": aladdinImg,
  luckystar: luckyStarImg,
  "lucky-star": luckyStarImg,
  "lucky-star-v2": luckyStarImg,
  achelois: acheloisImg,
  "achelois-v2": acheloisImg,
};

interface Props {
  modelUsed: string;
  reportType: string;
  size?: number;
}

const PartnerAvatar = ({ modelUsed, reportType, size = 28 }: Props) => {
  const key = modelUsed.toLowerCase().replace(/\s+/g, "-");
  const avatar = partnerAvatarMap[key];

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={modelUsed}
        className="rounded-full border border-border object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  // Fallback icon
  return reportType === "stock" ? (
    <div className="rounded-full bg-emerald-500/20 flex items-center justify-center" style={{ width: size, height: size }}>
      <TrendingUp size={size * 0.5} className="text-emerald-400" />
    </div>
  ) : (
    <div className="rounded-full bg-amber-500/20 flex items-center justify-center" style={{ width: size, height: size }}>
      <Gamepad2 size={size * 0.5} className="text-amber-400" />
    </div>
  );
};

export default PartnerAvatar;

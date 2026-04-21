import { Emotion } from "@/types";
import {
  FolderOpen,
  Heart,
  BicepsFlexed,
  BadgeRussianRuble,
  Star,
  Building2,
  FileText,
  Music,
  Sun,
  Moon,
  Smile,
  Bird,
  Cat,
  Fish,
  Rabbit,
  Sunrise,
  HouseHeart,
  LoaderPinwheel,
  EyeClosed,
  Meh,
  Frown,
} from "lucide-react"

export const FOLDER_ICONS = {
  folder: FolderOpen,
  heart: Heart,
  bicepsFlexed: BicepsFlexed,
  badgeRussianRuble: BadgeRussianRuble,
  star: Star,
  building2: Building2,
  fileText: FileText,
  music: Music,
  sun: Sun,
  moon: Moon,
  smile: Smile,
  bird: Bird,
  cat: Cat,
  fish: Fish,
  rabbit: Rabbit,
  sunrise: Sunrise,
  houseHeart: HouseHeart,
  loaderPinwheel: LoaderPinwheel,
  eyeClosed: EyeClosed,
}

export type FolderIconName = keyof typeof FOLDER_ICONS

export const EMOTION_ICONS = {
  [Emotion.POSITIVE]: Smile,
  [Emotion.NEUTRAL]: Meh,
  [Emotion.NEGATIVE]: Frown,
}

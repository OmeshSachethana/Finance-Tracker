import {
  Briefcase,
  Car,
  CircleEllipsis,
  CirclePlus,
  Coffee,
  Dumbbell,
  Film,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  PawPrint,
  Plane,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  TrendingUp,
  Utensils,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/** Icons available for categories, keyed by the name stored on the server. */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  utensils: Utensils,
  'shopping-cart': ShoppingCart,
  car: Car,
  home: Home,
  zap: Zap,
  'heart-pulse': HeartPulse,
  film: Film,
  'shopping-bag': ShoppingBag,
  'graduation-cap': GraduationCap,
  'circle-ellipsis': CircleEllipsis,
  briefcase: Briefcase,
  laptop: Laptop,
  'trending-up': TrendingUp,
  gift: Gift,
  'circle-plus': CirclePlus,
  coffee: Coffee,
  plane: Plane,
  'paw-print': PawPrint,
  dumbbell: Dumbbell,
  smartphone: Smartphone,
};

export function categoryIcon(name: string): LucideIcon {
  return CATEGORY_ICONS[name] ?? CircleEllipsis;
}

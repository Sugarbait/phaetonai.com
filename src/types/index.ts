export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ComponentType;
  color: string;
  bgColor: string;
}

export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface StepItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface StatItem {
  value: string;
  label: string;
  icon: React.ComponentType;
}
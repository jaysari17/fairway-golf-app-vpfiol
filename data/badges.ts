
import { Badge } from '@/types/golf';

export const availableBadges: Badge[] = [
  {
    id: 'first-round',
    name: 'First Round',
    description: 'Log your first round',
    icon: '⛳',
    earned: false,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Play 10 different courses',
    icon: '🗺️',
    earned: false,
  },
  {
    id: 'semi-pro',
    name: 'Semi-Pro',
    description: 'Log 50 rounds',
    icon: '🏆',
    earned: false,
  },
  {
    id: 'state-traveler',
    name: 'State Traveler',
    description: 'Play courses in 5 different states',
    icon: '✈️',
    earned: false,
  },
  {
    id: 'high-roller',
    name: 'High Roller',
    description: 'Rate a premium course 90+',
    icon: '💎',
    earned: false,
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Log rounds for 30 consecutive days',
    icon: '🔥',
    earned: false,
  },
  {
    id: 'reviewer',
    name: 'Top Reviewer',
    description: 'Write 25 course reviews',
    icon: '📝',
    earned: false,
  },
  {
    id: 'variety-seeker',
    name: 'Variety Seeker',
    description: 'Play all course types',
    icon: '🌟',
    earned: false,
  },
];

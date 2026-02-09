/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                                                                ║
 * ║   🎮  REGISTRE DES JEUX - FAMILLE SAVRY  🎮                    ║
 * ║                                                                ║
 * ║   C'est ICI qu'on ajoute les jeux !                            ║
 * ║                                                                ║
 * ║   Pour ajouter un nouveau jeu :                                ║
 * ║                                                                ║
 * ║   1. Créer un fichier dans src/games/ (ex: MonJeu.tsx)         ║
 * ║      → Le composant doit être exporté par défaut               ║
 * ║      → Il reçoit aucun props, c'est autonome                   ║
 * ║                                                                ║
 * ║   2. Importer le composant ci-dessous avec les autres imports  ║
 * ║                                                                ║
 * ║   3. Ajouter une entrée dans le tableau GAMES ci-dessous       ║
 * ║      → id: identifiant unique (pas d'espaces)                  ║
 * ║      → title: nom affiché                                      ║
 * ║      → description: courte description                         ║
 * ║      → emoji: un emoji pour la carte                           ║
 * ║      → color: couleur de fond (classe Tailwind)                ║
 * ║      → component: le composant importé                         ║
 * ║      → players: nombre de joueurs (ex: "1-4")                  ║
 * ║      → difficulty: "Facile" | "Moyen" | "Difficile"            ║
 * ║                                                                ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import type { ComponentType } from "react";

// ═══════════════════════════════════════════════════════════════
// 📦 IMPORTS DES JEUX — Ajouter les imports ici
// ═══════════════════════════════════════════════════════════════
import TicTacToe from "./TicTacToe";
import MemoryGame from "./MemoryGame";
import SnakeGame from "./SnakeGame";
// import MonNouveauJeu from "./MonNouveauJeu";  // ← Exemple

// ═══════════════════════════════════════════════════════════════
// 🎯 TYPE — Structure d'un jeu
// ═══════════════════════════════════════════════════════════════
export interface GameEntry {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  component: ComponentType;
  players: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
}

// ═══════════════════════════════════════════════════════════════
// 🎮 LISTE DES JEUX — Ajouter vos jeux ici !
// ═══════════════════════════════════════════════════════════════
export const GAMES: GameEntry[] = [
  {
    id: "morpion",
    title: "Morpion",
    description: "Le classique ! Alignez 3 symboles pour gagner.",
    emoji: "❌",
    color: "from-blue-500 to-indigo-600",
    component: TicTacToe,
    players: "2",
    difficulty: "Facile",
  },
  {
    id: "memory",
    title: "Memory",
    description: "Retournez les cartes et trouvez les paires !",
    emoji: "🧠",
    color: "from-purple-500 to-pink-600",
    component: MemoryGame,
    players: "1-4",
    difficulty: "Facile",
  },
  {
    id: "snake",
    title: "Snake",
    description: "Mangez les pommes et grandissez sans vous mordre !",
    emoji: "🐍",
    color: "from-green-500 to-emerald-600",
    component: SnakeGame,
    players: "1",
    difficulty: "Moyen",
  },

  // ┌──────────────────────────────────────────────────────────┐
  // │  ➕ AJOUTER UN NOUVEAU JEU ICI                          │
  // │                                                          │
  // │  {                                                       │
  // │    id: "mon-jeu",                                        │
  // │    title: "Mon Super Jeu",                               │
  // │    description: "Description courte du jeu",             │
  // │    emoji: "🎯",                                          │
  // │    color: "from-orange-500 to-red-600",                  │
  // │    component: MonNouveauJeu,                             │
  // │    players: "1-2",                                       │
  // │    difficulty: "Facile",                                 │
  // │  },                                                      │
  // └──────────────────────────────────────────────────────────┘
];

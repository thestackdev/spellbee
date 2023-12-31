"use client";

import { useEffect, useState } from "react";
import Encouragement from "./encouragement";
import InputIndex from "./input";
import Hints from "./menu/hints";
import HowTo from "./menu/howTo";
import Rankings from "./menu/rankings";
import Realistic from "./realistic";
import UserRanking from "./userRanking";
import WordList from "./wordList";

interface GameIndexProps {
  data: {
    displayWeekday: string;
    displayDate: string;
    printDate: string;
    centerLetter: string;
    outerLetters: string[];
    validLetters: string[];
    pangrams: string[];
    answers: string[];
    id: string;
    freeExpiration: string;
    editor: string;
  };
}

export const getPoints = (wordList: string[]): number => {
  let sum = 0;
  if (wordList === undefined) {
    return sum;
  }

  for (let i = 0; i < wordList?.length; i++) {
    if (wordList[i].length === 4) {
      sum += 1;
    } else if (wordList[i].length > 4) {
      sum += wordList[i].length - 3;
    }
  }

  let word: Set<string>;
  for (let i = 0; i < wordList.length; i++) {
    word = new Set(wordList[i].split(""));
    if (word.size === 7) {
      sum += 7;
    }
  }

  return sum;
};

export const checkLetters = (word: string, letters: string[]): boolean => {
  console.log(letters);
  let wordArr: string[] = word.split("");
  for (let i = 0; i < wordArr.length; i++) {
    if (!letters.includes(wordArr[i])) {
      return false;
    }
  }
  return true;
};

const menuItems = [
  {
    name: "How to Play",
    onClickArg: "howTo",
  },
  {
    name: "Rankings",
    onClickArg: "rankings",
  },
  {
    name: "Today's Hints",
    onClickArg: "hints",
  },
];

export default function GameIndex(props: GameIndexProps) {
  const { data } = props;
  const [showMenuItem, setShowMenuItem] = useState<string | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [inputWord, setInputWord] = useState<string>("");
  const [revealWords, setRevealWords] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);
  const [addedPoints, setAddedPoints] = useState<number | null>(null);

  useEffect(() => {
    if (!data) return;

    if (localStorage.getItem("foundWords") !== null) {
      if (
        localStorage.getItem("revealed") === "true" &&
        data.answers.includes(
          localStorage.getItem("foundWords")?.split(",")[0].toLowerCase()!
        )
      ) {
        setRevealWords(true);
        setFoundWords(localStorage.getItem("foundWords")?.split(",")!);
      } else if (
        data.answers.includes(
          localStorage.getItem("foundWords")?.split(",")[0].toLowerCase()!
        )
      ) {
        const foundedWords = localStorage.getItem("foundWords")?.split(",")!;
        setFoundWords([...foundedWords]);
        setUserPoints(getPoints([...foundedWords]));
      } else {
        localStorage.clear();
      }
    }
  }, [data]);

  const enterWord = (word: string): void => {
    if (word.length < 4) {
      setMessage("Too short");
      setTimeout(() => setMessage(null), 1000);
    } else if (checkLetters(word, data.validLetters)) {
      setMessage("Bad letters");
      setTimeout(() => setMessage(null), 1000);
    } else if (
      data.pangrams.includes(word.toLowerCase()) &&
      !foundWords.includes(word)
    ) {
      localStorage.setItem("foundWords", String([word, ...foundWords]));
      setFoundWords([word, ...foundWords]);
      setUserPoints(getPoints([...foundWords, word]));
      setInputWord("");
      setReaction("Pangram!");
      setAddedPoints(getPoints([word]));
      setTimeout(() => setAddedPoints(null), 750);
      setTimeout(() => setReaction(null), 750);
    } else if (
      data.answers.includes(word.toLowerCase()) &&
      !foundWords.includes(word)
    ) {
      localStorage.setItem("foundWords", String([word, ...foundWords]));
      setFoundWords([word, ...foundWords]);
      setUserPoints(getPoints([...foundWords, word]));
      setInputWord("");
      setAddedPoints(getPoints([word]));
      setTimeout(() => setAddedPoints(null), 750);
    } else if (foundWords.includes(word)) {
      setMessage("Already found");
      setTimeout(() => setMessage(null), 750);
    } else {
      setMessage("Not in word list");
      setTimeout(() => setMessage(null), 750);
    }
  };

  return (
    <div data-testid="game-index" className="flex flex-col items-center p-6">
      {showMenuItem === "howTo" && (
        <HowTo setShowMenuItem={(arg) => setShowMenuItem(arg)} />
      )}
      {showMenuItem === "hints" && (
        <Hints
          revealAnswers={revealWords}
          setRevealAnswers={() => setRevealWords(true)}
          setShowMenuItem={(arg) => setShowMenuItem(arg)}
          pangrams={data.pangrams}
          answers={data.answers}
        />
      )}
      {showMenuItem === "rankings" && (
        <Rankings
          setShowMenuItem={(arg) => setShowMenuItem(arg)}
          answers={data.answers}
        />
      )}
      <Realistic reaction={reaction} />
      <div className="flex flex-col md:flex-row-reverse w-full">
        <div className="flex flex-col md:w-1/2 w-full md:px-2 items-center">
          <UserRanking answers={data.answers} userPoints={userPoints} />
          <WordList
            answers={data.answers}
            pangrams={data.pangrams}
            revealWords={revealWords}
            words={foundWords}
          />
        </div>
        {addedPoints && <Encouragement points={addedPoints} />}
        <InputIndex
          message={message}
          inputWord={inputWord}
          setInputWord={(str) => setInputWord(str)}
          centerLetter={data.centerLetter.toUpperCase()}
          revealedAnswers={revealWords}
          enterWord={(word) => enterWord(word)}
          outerLetters={data.outerLetters.map((i) => i.toUpperCase())}
        />
      </div>
      <div className="flex flex-row gap-4">
        {menuItems.map((i) => (
          <button
            className="p-3 border border-gray-300 rounded-lg"
            key={i.name}
            onClick={() => setShowMenuItem(i.onClickArg)}
          >
            {i.name}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import wordLists from "@/components/lists";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Link from "next/link";

export default function Home() {
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [guessedWord, setGuessedWord] = useState<string>("");
  const [remainingAttempts, setRemainingAttempts] = useState<number>(7);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalExtreme, setShowModalExtreme] = useState<boolean>(false);
  const [level, setLevel] = useState<string>("easy");
  const [category, setCategory] = useState<string>("fruit");
  const [showCreepyFace, setShowCreepyFace] = useState<boolean>(false);
  const [selectedCreepyFace, setSelectedCreepyFace] = useState<string>("");

  const creepyFaces = [
    "/images/creepy-face1.jpg",
    "/images/creepy-face2.jpg",
    "/images/creepy-face3.jpg",
    "/images/creepy-face4.jpg",
  ];

  const winAudio = useRef<HTMLAudioElement>(null!);
  const lostAudio = useRef<HTMLAudioElement>(null!);
  const extremeAudio = useRef<HTMLAudioElement>(null!);

  useEffect(() => {
    winAudio.current = new Audio("/audios/win-sound.wav");
    lostAudio.current = new Audio("/audios/lost-sound.wav");
    extremeAudio.current = new Audio("/audios/extreme-sound.wav");
  }, []);

  const isGameWon = guessedWord === selectedWord;
  const isGameLost = remainingAttempts === 0;

  const categories = [
    { value: "fruit", label: "Fruit" },
    { value: "country", label: "Country" },
    { value: "animal", label: "Animal" },
  ];

  const levels = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
    { value: "extreme", label: "Extreme" },
  ];

  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setCategory(event.target.value);
  }

  function handleLevelChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedLevel = event.target.value;
    selectedLevel === "extreme"
      ? setShowModalExtreme(true)
      : setLevel(selectedLevel);
  }

  function handleModalExtremeConfirm() {
    setLevel("extreme");
    setShowModalExtreme(false);
  }

  function handleModalExtremeCancel() {
    setShowModalExtreme(false);
  }

  const selectRandomWord = useCallback(() => {
    const words = wordLists[category][level];
    const randomIndex = Math.floor(Math.random() * words.length);
    setSelectedWord(words[randomIndex]);
    setGuessedWord("_".repeat(words[randomIndex].length));
    let remainingAttempts = 7;
    if (level === "medium") remainingAttempts = 5;
    if (level === "hard") remainingAttempts = 4;
    if (level === "extreme") remainingAttempts = 2;
    setRemainingAttempts(remainingAttempts);
  }, [category, level]);

  function handleGuess(letter: string): void {
    if (selectedWord.includes(letter)) {
      const newGuessedWord = selectedWord
        .split("")
        .map((char: string, index: number) =>
          char === letter ? letter : guessedWord[index]
        )
        .join("");
      setGuessedWord(newGuessedWord);
    } else {
      setRemainingAttempts(remainingAttempts - 1);
    }

    setGuesses([...guesses, letter]);
  }

  const getRandomCreepyFace = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * creepyFaces.length);
    return creepyFaces[randomIndex];
  }, []);

  function handleRestart(): void {
    setSelectedWord("");
    setGuessedWord("");
    setGuesses([]);
    setRemainingAttempts(7);
    selectRandomWord();
  }

  if (!selectedWord) selectRandomWord();

  useEffect(() => {
    setGuessedWord("");
    setGuesses([]);
    selectRandomWord();
  }, [category, level, selectRandomWord]);

  useEffect(() => {
    if (isGameWon) {
      winAudio.current.play();
      setShowModal(true);
    } else if (isGameLost) {
      if (level === "extreme") {
        extremeAudio.current.play();
        const creepyFace = getRandomCreepyFace();
        setSelectedCreepyFace(creepyFace);
        setShowCreepyFace(true);
        document.body.classList.add("red-bg2");

        const timer = setTimeout(() => {
          setShowCreepyFace(false);
          setShowModal(true);
          document.body.classList.remove("red-bg2");
        }, 3000);

        return () => {
          clearTimeout(timer);
        };
      } else {
        lostAudio.current.play();
        setShowModal(true);
      }
    }
  }, [isGameWon, isGameLost, level, getRandomCreepyFace]);

  useEffect(() => {
    if (level === "extreme" && remainingAttempts === 2) {
      document.body.classList.add("red-bg1");
    } else if (level === "extreme" && remainingAttempts === 1) {
      document.body.classList.add("red-bg2");
    } else if (level === "extreme" && isGameLost) {
      document.body.classList.add("red-bg2");
    } else {
      document.body.classList.remove("red-bg1");
      document.body.classList.remove("red-bg2");
    }
  }, [isGameLost, level, remainingAttempts]);

  useEffect(() => {
    if (level === "extreme" && isGameLost) {
      const creepyFace = getRandomCreepyFace();
      setSelectedCreepyFace(creepyFace);
    }
  }, [level, isGameLost, getRandomCreepyFace]);

  return (
    <>
      <main className="my-8">
        <h1 className="text-3xl my-4 font-semibold bg-black pt-1 pb-2 px-3 mx-auto text-white max-w-max rounded shadow-md">
          Guessing Game
        </h1>
        <div className="flex gap-8 justify-center items-center">
          <Select
            title="Category"
            value={category}
            onChange={handleCategoryChange}
            options={categories}
          />
          <Select
            title="Level"
            value={level}
            onChange={handleLevelChange}
            options={levels}
          />
        </div>

        {showModalExtreme && (
          <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="bg-black text-white mx-6 p-8 rounded-lg shadow-md text-center md:max-w-md">
              <h2 className="text-2xl font-bold mb-2">Warning!</h2>
              <p className="mb-12 text-left">
                This is a highly explicit level that may contain disturbing
                content. Are you sure you want to proceed?
              </p>
              <div className="flex gap-2 justify-center items-center">
                <button
                  className="bg-white text-black font-semibold px-3 py-1 rounded"
                  onClick={handleModalExtremeConfirm}
                >
                  Yes
                </button>
                <button
                  className="bg-white text-black font-semibold px-3 py-1 rounded"
                  onClick={handleModalExtremeCancel}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {isGameWon && (
          <Modal
            title="Congratulation, You Win!"
            selectedWord={selectedWord}
            handleRestart={handleRestart}
          />
        )}
        {isGameLost && (
          <>
            {showCreepyFace && (
              <Image
                width={1000}
                height={1000}
                src={selectedCreepyFace}
                alt="Creepy Face"
                className="fixed inset-0 z-20 object-cover object-center w-full h-screen"
                placeholder="blur"
                blurDataURL={selectedCreepyFace}
              />
            )}
            {showModal && !showCreepyFace && (
              <Modal
                title={
                  isGameLost && level === "extreme"
                    ? "LMAO, You Lost!"
                    : "Sorry, You Lost!"
                }
                selectedWord={selectedWord}
                handleRestart={handleRestart}
              />
            )}
          </>
        )}

        {!isGameWon && !isGameLost && (
          <article className="text-center mb-8">
            <h2 className="my-4 text-xl font-semibold">
              Guess the {category}:
            </h2>
            <section className="flex justify-center items-center gap-2 mx-4 text-3xl">
              {guessedWord.split("").map((letter, index) => (
                <div className="uppercase" key={index}>
                  {letter}
                </div>
              ))}
            </section>
            <section className="flex justify-center items-center uppercase mt-4">
              {guesses.map((letter: string, index: number) => (
                <div
                  key={index.toString()}
                  className={`${
                    selectedWord.includes(letter)
                      ? "text-green-500"
                      : "text-rose-500"
                  } mx-1 font-semibold`}
                >
                  {letter}
                </div>
              ))}
            </section>

            <section className="mt-4">
              <h2 className="font-semibold">Remaining Attempts:</h2>
              <div className="text-5xl font-bold mt-4">{remainingAttempts}</div>
            </section>

            <div className="grid grid-cols-7 justify-center items-center gap-2 max-w-[90%] md:max-w-[50%] lg:max-w-[33.33%] mx-auto mt-12">
              {"abcdefghijklmnopqrstuvwxyz"
                .split("")
                .map((letter: string, index: number) => (
                  <button
                    className={`bg-black text-white p-2 rounded text-center uppercase ${
                      guesses.includes(letter)
                        ? selectedWord.includes(letter)
                          ? "bg-green-500"
                          : "bg-rose-500"
                        : ""
                    }`}
                    key={index}
                    onClick={() => handleGuess(letter)}
                    disabled={guesses.includes(letter)}
                  >
                    {letter}
                  </button>
                ))}
            </div>
          </article>
        )}
      </main>
      <footer className="relative h-full">
        <h3 className="text-xs text-center fixed left-0 right-0 bottom-2">
          &copy;Copyright by{" "}
          <Link
            className="font-semibold underline"
            href="https://github.com/Fal-hi"
            target="_blank"
          >
            Syaifal Illahi
          </Link>
          . All right reserved.
        </h3>
      </footer>
    </>
  );
}

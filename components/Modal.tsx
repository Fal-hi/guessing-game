export default function Modal({ title, selectedWord, handleRestart }: any) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="bg-black text-white mx-6 p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="mb-12">
          The word is{" "}
          <span className="uppercase font-semibold text-green-500">
            {selectedWord}
          </span>
        </p>
        <button
          className="bg-white text-black font-semibold px-3 py-1 rounded"
          onClick={handleRestart}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
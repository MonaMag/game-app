'use client';
import { useState } from "react";
import { TicTacToyBoard } from "./TicTacToyBoard";


export default function TicTacToy() {
  const [size, setSize] = useState(3);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        const value = Number(e.currentTarget.value);
        if (value >= 3 && value <= 10) {
            setSize(value);
        }
    }
};
  return (
    <div className="flex flex-col w-full h-screen items-center p-10 bg-gray-100">
      <h2 className='mb-5 text-2xl font-bold text-green-600 underline'>TicTacToy game</h2>
      <div className="flex flex-row mb-6">
        <input
          min="3"
          max="10"
          defaultValue={size}
          onKeyDown={handleKeyDown}
          className="p-2 border border-gray-300"
        />
      </div>
      <TicTacToyBoard n={size} />
    </div>
  );
}
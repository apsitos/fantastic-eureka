'use client';
import './css/multiChoice.css';

import { useState } from 'react';

import Image from 'next/image';

import Ding from '../public/assets/ding.mp3';
import HotDogStand from '../public/assets/hot-dog-cart.png';
import TryAgain from '../public/assets/try-again.mp3';
import MultiAnswer from './components/MultiAnswer';
import AnswerModal from './components/AnswerModal';

export default function MultiChoicePage({ setChange }) {
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const answers = [
    { id: 1, text: 'Cash', correct: true },
    { id: 2, text: 'Card', correct: false },
  ];
  const question = "What's the best type of payment?";

  let correctSound = new Audio(Ding);
  let incorrectSound = new Audio(TryAgain);

  function playResponse(response) {
    if (response === true) {
      correctSound.play();
    } else {
      incorrectSound.play();
    }
  }

  function selectAnswer(answer) {
    setSelected(answer.correct);
    setIsOpen(true);
    playResponse(answer.correct);
  }

  if (!!selected) {
    new Promise((resolve) => {
      setTimeout(() => resolve(setChange(false)), 1000);
    });
  }

  return (
    <article className='container'>
      <h1 className='question'>{question}</h1>
      <div className='questionContainer'>
        <Image src={HotDogStand} alt='drawing of hot dog stand' />
        {isOpen && <AnswerModal answer={selected} setIsOpen={setIsOpen} />}
      </div>
      <div className='answerContainer'>
        {answers.map((answer) => (
          <MultiAnswer
            key={answer.id}
            answer={answer}
            inputSelection={selectAnswer}
          />
        ))}
      </div>
    </article>
  );
}

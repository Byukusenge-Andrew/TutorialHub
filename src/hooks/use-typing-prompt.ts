import { useState } from 'react';

const prompts = [
  "In the middle of every difficulty lies opportunity. Learning from mistakes allows you to grow as a person and gain a better understanding of the world. Remember, the most successful people were once beginners.",
  "Typing is a skill that takes practice to master. Over time, your fingers will learn the positions of the keys, and your speed will increase naturally. Be patient and enjoy the process of improvement.",
  "The rain was falling lightly on the rooftops, creating a soothing sound that filled the night. As the clock ticked away, the world outside seemed to fade into the background, leaving only the rhythmic sound of typing on the keyboard.",
  "Time and tide wait for no one, and this typing challenge is no different. With each word you type, you not only improve your speed but also build the discipline to stay focused under pressure. Take a deep breath and type away!",
  "Each moment in life is an opportunity to learn and grow. The typing test you're undertaking is just one small challenge in the grand scheme of things. Whether you excel or stumble, it's all part of the journey to becoming a more skilled and confident individual",
];

export function useTypingPrompt() {
  const [currentPrompt] = useState(() => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  });

  return { currentPrompt };
}
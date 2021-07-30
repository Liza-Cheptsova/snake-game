import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Snake } from "./Snake";
import { Food } from "./Food";

const getRandomCoordinates = () => {
  const min = 1;
  const max = 98;
  const x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  const y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

const App = () => {
  const [snakeDots, setSnakeDots] = useState([
    [0, 0],
    [2, 0],
  ]);

  const [food, setFood] = useState(getRandomCoordinates());
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(200);

  const resetGame = () => {
    setSnakeDots([
      [0, 0],
      [2, 0],
    ]);
    setFood(getRandomCoordinates());
    setDirection("RIGHT");
    setSpeed(200);
  };

  const moveSnake = useCallback(() => {
    const dots = [...snakeDots];
    let head = dots[dots.length - 1];

    switch (direction) {
      case "RIGHT":
        head = [head[0] + 2, head[1]];
        break;
      case "LEFT":
        head = [head[0] - 2, head[1]];
        break;
      case "UP":
        head = [head[0], head[1] - 2];
        break;
      case "DOWN":
        head = [head[0], head[1] + 2];
        break;
      default:
        break;
    }
    dots.push(head);
    dots.shift();
    setSnakeDots(dots);
  }, [snakeDots, direction]);

  const onGameOver = useCallback(() => {
    alert(`Game over. Snake lenght is ${snakeDots.length}`);
    resetGame();
  }, [snakeDots.length]);

  const checkIfOutOfBorders = useCallback(() => {
    let head = snakeDots[snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      onGameOver();
    }
  }, [snakeDots, onGameOver]);

  const enlargeSnake = useCallback(() => {
    let newSnake = [...snakeDots];
    newSnake.unshift([]);
    setSnakeDots(newSnake);
  }, [snakeDots]);

  const increaseSpeed = useCallback(() => {
    if (speed > 10) {
      setSpeed(speed - 10);
    }
  }, [speed]);

  const checkIfEat = useCallback(() => {
    const head = snakeDots[snakeDots.length - 1];
    if (head[0] === food[0] && head[1] === food[1]) {
      setFood(getRandomCoordinates());
      enlargeSnake();
      increaseSpeed();
    }
  }, [enlargeSnake, increaseSpeed, food, snakeDots]);

  useEffect(() => {
    let moveSnakeHandel = setInterval(moveSnake, speed);
    document.onkeydown = onKeyDown;
    checkIfOutOfBorders();
    checkIfEat();

    return () => {
      clearInterval(moveSnakeHandel);
    };
  }, [moveSnake, speed, checkIfOutOfBorders, checkIfEat]);

  const onKeyDown = (e) => {
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        setDirection("UP");
        break;
      case 40:
        setDirection("DOWN");
        break;
      case 37:
        setDirection("LEFT");
        break;
      case 39:
        setDirection("RIGHT");
        break;
      default:
        setDirection("RIGHT");
    }
  };

  return (
    <div className="snake-area">
      <Snake snakeDots={snakeDots} />
      <Food dot={food} />
    </div>
  );
};

export default App;

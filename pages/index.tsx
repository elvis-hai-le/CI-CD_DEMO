import { useState, useEffect, useRef, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useInterval from '@use-it/interval'

import { HeadComponent as Head } from 'components/Head'
import Link from 'next/link'

type Apple = {
  x: number
  y: number
}

type SnakePart = {
  x: number
  y: number
}

type Velocity = {
  dx: number
  dy: number
}

export async function getStaticProps() {
  return { props: { isDark: true } }
}

export default function SnakeGame() {
  // Canvas Settings
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasWidth = 720
  const canvasHeight = 480
  const canvasGridSize = 40

  // Game Settings
  const minGameSpeed = 10
  const maxGameSpeed = 30
  const wallKills = false

  // Game State
  const [gameDelay, setGameDelay] = useState<number>(1000 / minGameSpeed)
  const [countDown, setCountDown] = useState<number>(4)
  const [running, setRunning] = useState(false)
  const [isLost, setIsLost] = useState(false)
  const [highscore, setHighscore] = useState(0)
  const [newHighscore, setNewHighscore] = useState(false)
  const [score, setScore] = useState(0)
  const [snake, setSnake] = useState<{
    head: { x: number; y: number }
    trail: SnakePart[]
  }>({
    head: { x: 12, y: 9 },
    trail: [],
  })
  const [apple, setApple] = useState<Apple>({ x: -1, y: -1 })
  const [velocity, setVelocity] = useState<Velocity>({ dx: 0, dy: 0 })
  const [previousVelocity, setPreviousVelocity] = useState<Velocity>({
    dx: 0,
    dy: 0,
  })

  const clearCanvas = (ctx: CanvasRenderingContext2D) =>
    ctx.clearRect(-1, -1, canvasWidth + 2, canvasHeight + 2)

  const generateApplePosition = (): Apple => {
    const x = Math.floor(Math.random() * (canvasWidth / canvasGridSize))
    const y = Math.floor(Math.random() * (canvasHeight / canvasGridSize))
    // Check if random position interferes with snake head or trail
    if (
      (snake.head.x === x && snake.head.y === y) ||
      snake.trail.some((snakePart) => snakePart.x === x && snakePart.y === y)
    ) {
      return generateApplePosition()
    }
    return { x, y }
  }

  // Initialise state and start countdown
  const startGame = () => {
    setGameDelay(1000 / minGameSpeed)
    setIsLost(false)
    setScore(0)
    setSnake({
      head: { x: 12, y: 9 },
      trail: [],
    })
    setApple(generateApplePosition())
    setVelocity({ dx: 0, dy: -1 })
    setRunning(true)
    setNewHighscore(false)
    setCountDown(3)
  }

  // Reset state and check for highscore
  const gameOver = () => {
    if (score > highscore) {
      setHighscore(score)
      localStorage.setItem('highscore', score.toString())
      setNewHighscore(true)
    }
    setIsLost(true)
    setRunning(false)
    setVelocity({ dx: 0, dy: 0 })
    setCountDown(4)
  }

  const fillText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    w: number
  ) => {
    ctx.fillText(text, x, y, w)
  }

  const drawTree = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.font = '40px serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      for (let x = 0; x < 18; x++) {
        for (let y = 0; y < 12; y++) {
          fillText(
            ctx,
            '🌲',
            x * canvasGridSize - 5,
            y * canvasGridSize + 30,
            70
          )
        }
      }
    },
    [canvasGridSize]
  )

  const drawSnake = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.font = '30px serif'
      fillText(
        ctx,
        '🐰',
        snake.head.x * canvasGridSize,
        snake.head.y * canvasGridSize + 30,
        canvasGridSize
      )
      snake.trail.forEach((snakePart) => {
        fillText(
          ctx,
          '🐇',
          snakePart.x * canvasGridSize,
          snakePart.y * canvasGridSize + 30,
          canvasGridSize
        )
      })
    },
    [snake, canvasGridSize]
  )

  const drawApple = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.textAlign = 'left'
      ctx.font = '30px serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 1)'
      if (
        apple &&
        typeof apple.x !== 'undefined' &&
        typeof apple.y !== 'undefined'
      ) {
        fillText(
          ctx,
          '🥕',
          apple.x * canvasGridSize,
          apple.y * canvasGridSize + 30,
          canvasGridSize
        )
      }
    },
    [apple, canvasGridSize]
  )

  // Update snake.head, snake.trail and apple positions. Check for collisions.
  const updateSnake = () => {
    // Check for collision with walls
    let nextHeadPosition = {
      x: snake.head.x + velocity.dx,
      y: snake.head.y + velocity.dy,
    }
    if (
      (nextHeadPosition.x < 0 ||
        nextHeadPosition.y < 0 ||
        nextHeadPosition.x >= canvasWidth / canvasGridSize ||
        nextHeadPosition.y >= canvasHeight / canvasGridSize) &&
      wallKills
    ) {
      gameOver()
    }
    if (nextHeadPosition.x < 0) {
      nextHeadPosition = {
        x: canvasWidth / canvasGridSize + velocity.dx,
        y: snake.head.y + velocity.dy,
      }
    }

    if (nextHeadPosition.y < 0) {
      nextHeadPosition = {
        x: snake.head.x + velocity.dx,
        y: canvasHeight / canvasGridSize + velocity.dy,
      }
    }

    if (nextHeadPosition.x >= canvasWidth / canvasGridSize) {
      nextHeadPosition = {
        x: -1 + velocity.dx,
        y: snake.head.y + velocity.dy,
      }
    }

    if (nextHeadPosition.y >= canvasHeight / canvasGridSize) {
      nextHeadPosition = {
        x: snake.head.x + velocity.dx,
        y: 0 + velocity.dx,
      }
    }

    // Check for collision with apple
    if (nextHeadPosition.x === apple.x && nextHeadPosition.y === apple.y) {
      setScore((prevScore) => prevScore + 1)
      setApple(generateApplePosition())
    }

    const updatedSnakeTrail = [...snake.trail, { ...snake.head }]
    // Remove trail history beyond snake trail length (score + 2)
    while (updatedSnakeTrail.length > score + 2) updatedSnakeTrail.shift()
    // Check for snake colliding with itsself
    if (
      updatedSnakeTrail.some(
        (snakePart) =>
          snakePart.x === nextHeadPosition.x &&
          snakePart.y === nextHeadPosition.y
      )
    )
      gameOver()

    // Update state
    setPreviousVelocity({ ...velocity })
    setSnake({
      head: { ...nextHeadPosition },
      trail: [...updatedSnakeTrail],
    })
  }

  // Game Hook
  useEffect(() => {
    const canvas = canvasRef?.current
    const ctx = canvas?.getContext('2d')

    if (ctx && !isLost) {
      clearCanvas(ctx)
      drawTree(ctx)
      drawApple(ctx)
      drawSnake(ctx)
    }
  }, [isLost, drawApple, drawSnake, drawTree])

  // Game Update Interval
  useInterval(
    () => {
      if (!isLost) {
        updateSnake()
      }
    },
    running && countDown === 0 ? gameDelay : null
  )

  // Countdown Interval
  useInterval(
    () => {
      setCountDown((prevCountDown) => prevCountDown - 1)
    },
    countDown > 0 && countDown < 4 ? 800 : null
  )

  // DidMount Hook for Highscore
  useEffect(() => {
    setHighscore(
      localStorage.getItem('highscore')
        ? parseInt(localStorage.getItem('highscore')!)
        : 0
    )
  }, [])

  // Score Hook: increase game speed starting at 16
  useEffect(() => {
    if (score > minGameSpeed && score <= maxGameSpeed) {
      setGameDelay(1000 / score)
    }
  }, [score])

  // Event Listener: Key Presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'w',
          'a',
          's',
          'd',
        ].includes(e.key)
      ) {
        let velocity = { dx: 0, dy: 0 }

        switch (e.key) {
          case 'ArrowRight':
            velocity = { dx: 1, dy: 0 }
            break
          case 'ArrowLeft':
            velocity = { dx: -1, dy: 0 }
            break
          case 'ArrowDown':
            velocity = { dx: 0, dy: 1 }
            break
          case 'ArrowUp':
            velocity = { dx: 0, dy: -1 }
            break
          case 'd':
            velocity = { dx: 1, dy: 0 }
            break
          case 'a':
            velocity = { dx: -1, dy: 0 }
            break
          case 's':
            velocity = { dx: 0, dy: 1 }
            break
          case 'w':
            velocity = { dx: 0, dy: -1 }
            break
          default:
            console.error('Error with handleKeyDown')
        }
        if (
          !(
            previousVelocity.dx + velocity.dx === 0 &&
            previousVelocity.dy + velocity.dy === 0
          )
        ) {
          setVelocity(velocity)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [previousVelocity])

  return (
    <>
      <Head />
      <h1 className="title font-poppins">NextJS Snake Demo Deploy</h1>
      <h1 className="font-poppins text-center text-base text-sky-300">
        <a href="https://github.com/marcmll/next-snake">
          👉 CREDITS TO MARC MULLER FOR ORIGINAL GAME 👈
        </a>
      </h1>
      <br />
      <main>
        <canvas
          ref={canvasRef}
          width={canvasWidth + 1}
          height={canvasHeight + 1}
        />
        <section className="font-poppins flex flex-row bg-green-900 text-amber-50 pt-2">
          <div className="score basis-1/3">
            <p className="basis-1/3">
              <FontAwesomeIcon icon={['fas', 'star']} />
              Score: {score}
            </p>
            <p>
              <FontAwesomeIcon icon={['fas', 'trophy']} />
              Highscore: {highscore > score ? highscore : score}
            </p>
          </div>
          {!isLost && countDown > 0 ? (
            <button
              onClick={startGame}
              className="basis-1/3 bg-amber-600 shadow-md shadow-amber-500/0 hover:shadow-lg hover:shadow-amber-500/30 transition duration-300"
            >
              {countDown === 4 ? 'Start Game' : countDown}
            </button>
          ) : (
            <p className="text-5xl text-amber-500 basis-1/3 text-center">
              {score}
            </p>
          )}
          <div className="controls basis-1/3">
            <p>How to Play?</p>
            <p>
              <FontAwesomeIcon icon={['fas', 'arrow-up']} />
              <FontAwesomeIcon icon={['fas', 'arrow-right']} />
              <FontAwesomeIcon icon={['fas', 'arrow-down']} />
              <FontAwesomeIcon icon={['fas', 'arrow-left']} />
            </p>
          </div>
        </section>
        {isLost && (
          <div className="game-overlay">
            <p className="large">Game Over</p>
            <p className="final-score">
              {newHighscore ? `🎉 New Highscore 🎉` : `You scored: ${score}`}
            </p>
            {!running && isLost && (
              <button
                onClick={startGame}
                className="bg-amber-600 shadow-lg shadow-amber-600/0 hover:shadow-amber-600/30 transition duration-300"
              >
                {countDown === 4 ? 'Restart Game' : countDown}
              </button>
            )}
          </div>
        )}
      </main>
      <h1 className="text-sm text-rose-400 hover:text-rose-300 pt-10 transition duration-200 motion-safe:animate-bounce text-center pt-4 font-poppins">
        <Link href="/almost">⁉️ what&apos;s hiding here? ⁉️</Link>
      </h1>
      <footer>
        Copyright &copy; <a href="https://mueller.dev">Marc Müller</a> 2022
        &nbsp;|&nbsp;{' '}
        <a href="https://github.com/marcmll/next-snake">
          <FontAwesomeIcon icon={['fab', 'github']} /> Github
        </a>
      </footer>
    </>
  )
}

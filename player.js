export class Player {
  constructor(canvasContext) {
    this.canvasContext = canvasContext
    this.gameWidth = this.canvasContext.width
    this.gameHeight = this.canvasContext.height

    const image = './assets/characters/Adventurer.png'
    this.image = new Image()
    this.image.src = image
    this.srcWidth = 32
    this.srcHeight = 32
    this.playerWidth = 32
    this.playerHeight = 32
    this.x = 0
    this.y = this.canvasContext.height - this.srcHeight
    this.vy = 0

    this.weight = 1
    this.jumpHeight = 15
    this.speed = 0
    this.maxSpeed = 3
    this.state = 'idle'
    this.frameX = 0
    this.frameY = 0
    this.maxFrame = 12  // total number of frames in image sprites, start from 0
    this.frame = 0
    this.fps = 10
    this.frameTimer = 0
    this.frameInterval = 1000 / this.fps

    this.additionalScores = []
    this.totalAdditionalScores = 0
    this.isShowAdditionalScore = false
    this.additionalScoreTimeStamp = 0
    this.additionalScoreShowDuration = 500
  }

  draw(context) {
    context.strokeStyle = 'red'
    context.strokeRect(this.x, this.y, this.srcWidth, this.srcHeight)
    context.beginPath()
    context.arc(this.x + this.srcHeight / 2, this.y + this.srcWidth / 2, this.srcWidth / 2, 0, 2 * Math.PI)
    context.stroke()
    this.gameContext = context
    this.gameContext.drawImage(this.image, this.frameX * this.srcWidth, this.frameY * this.srcHeight, this.srcWidth, this.srcHeight, this.x, this.y, this.srcWidth, this.srcHeight)
  }

  update(keyboards, deltaTime, fruits) {
    this.x += this.speed
    this.run(keyboards.keys)
    this.jump(keyboards.keys)

    // animate
    if (this. frameTimer > this.frameInterval) {
      if (this.frameX >= this.maxFrame) {
        this.frameX = 0
      } else {
        this.frameX += 1
      }
      this.frameTimer = 0
    } else {
      this.frameTimer += deltaTime
    }

    //collision with fruit
    fruits.forEach((fruit) => {
      const dx = fruit.x - this.x
      const dy = fruit.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < this.srcWidth) {
        fruit.isOutOufScreen = true
        // game.isGameOver = true
        this.isShowAdditionalScore = true
        this.additionalScores.push(fruit.additionalScore)
        this.totalAdditionalScores += fruit.additionalScore
      }
    })

    this.handleAdditionalScore()
  } 

  run(keyboards) {
    if (keyboards.includes('ArrowRight')) {
      this.speed = this.maxSpeed
      this.frameY = 1
      this.maxFrame = 7
    } else if (keyboards.includes('ArrowLeft')) {
      this.speed = -this.maxSpeed
      this.frameY = 1
      this.maxFrame = 7
    } else {
      this.speed = 0
      this.frameY = 0
      this.maxFrame = 12
    }

    if (this.x < 0) {
      this.x = 0
    }
    if (this.x > this.gameWidth - this.srcWidth) {
      this.x = this.gameWidth - this.srcWidth
    }
  }

  jump(keyboards) {
    if ((keyboards.includes('ArrowUp')) && this.landing()) {
      this.vy -= this.jumpHeight
    }
    this.y += this.vy

    if (!this.landing()){
      this.vy += this.weight
      this.frameY = 5
      this.maxFrame = 5
    } 
    else {
      this.vy = 0
    }
  }

  landing() {
    return this.y >= this.gameHeight - this.srcHeight
  }

  handleAdditionalScore = () => {
    this.gameContext.font = '10px "Press Start 2P"'
    this.gameContext.fillStyle = '#E18608'
    if (this.isShowAdditionalScore) {
      if (this.additionalScoreTimeStamp > this.additionalScoreShowDuration) {
        this.additionalScores.splice(0, 1)
        this.isShowAdditionalScore = false
        this.additionalScoreTimeStamp = 0
      } else {
        this.additionalScoreTimeStamp += 10

        const score = this.additionalScores[0]
        this.gameContext.fillText(`+${score}`, this.x, this.y)
      }
    }
  }

  click(x, y) {
    const dx = x - this.x
    const dy = y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    console.log({ x, y })
    console.log({ playerX: this.x, playerY: this.y })
    console.log({ distance })

    if (distance < (this.srcWidth / 2)) {
      console.log('click player')
    } else {
      console.log('not click player')
    }
  }
}
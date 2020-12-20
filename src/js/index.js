import gsap from 'gsap'

import './images.js'
import {getMousePosition} from './utils/mouse.js'
import NormalizeWheel from './utils/normalizeWheel.js'

class Scroll {
    constructor(selector) {
        this.element = typeof selector === 'string' ?  document.querySelector(selector) : selector
        this.scroll = {
            target: 0,
            current: 0,
            off: 0,
            speed: 1.5,
            drag: false
        }
    }

    onWheel(event) {
        const
            wheel = new NormalizeWheel(event),
            delta = wheel.spinY * 50

        this.scroll.off += delta * this.scroll.speed
        this.scroll.target = this.scroll.off
    }

    onScrollTouchStart(event) {
        this.scroll.drag = true;
        event.preventDefault();

        this.startX = getMousePosition(event).x
    }

    onScrollTouchEnd() {
        this.scroll.drag = false;
        this.scroll.off = this.scroll.target
    }

    onScrollTouchMove(event) {
        if (!this.scroll.drag) return

        const {x} = getMousePosition(event)
        this.distance = (x - this.startX) * -1

        this.scroll.target = this.scroll.off + this.distance * this.scroll.speed
    }

    onScrollKeyboard(event) {
        const keyCode = event.code

        if (keyCode === "ArrowRight") {
            this.scroll.off += 20
            this.scroll.target = this.scroll.off
        } else if (keyCode === "ArrowLeft") {
            this.scroll.off -= 20
            this.scroll.target = this.scroll.off
        }
    }

    onScrollUpdate() {
        const total = this.element.clientWidth - window.innerWidth

        if (this.scroll.target < 0) this.scroll.target = 0
        if (this.scroll.target > total) this.scroll.target = total

        gsap.to(this.element, {
            x: -this.scroll.target,
            duration: 0.3,
        })

        window.requestAnimationFrame(this.onScrollUpdate.bind(this))
    }

    init() {
        document.addEventListener('wheel', this.onWheel.bind(this))

        document.addEventListener('mousedown', this.onScrollTouchStart.bind(this))
        document.addEventListener('mousemove', this.onScrollTouchMove.bind(this))
        document.addEventListener('mouseup', this.onScrollTouchEnd.bind(this))

        document.addEventListener('touchstart', this.onScrollTouchStart.bind(this), { passive: false })
        document.addEventListener('touchmove', this.onScrollTouchMove.bind(this))
        document.addEventListener('touchend', this.onScrollTouchEnd.bind(this))

        document.addEventListener('keydown', this.onScrollKeyboard.bind(this))

        this.onScrollUpdate()
    }
}

const scroll = new Scroll('.scroll')

scroll.init()

import gsap from 'gsap'

import './images.js'
import {getMousePosition} from './utils/mouse.js'
import NormalizeWheel from './utils/normalizeWheel.js'

class Scroll {
    constructor(selector, options) {
        this.element = typeof selector === 'string' ?  document.querySelector(selector) : selector
        this.maxScroll = this.element.clientWidth - window.innerWidth
        this.scroll = {
            _scrollValue: 0,
            _latestScrollValue: 0,
            _drag: false,
            dragSpeed: options.dragSpeed,
            wheelScrollValue: options.wheelScrollValue,
            keyBoardScrollValue: options.keyBoardScrollValue,
            keyBoardScrollValueIncrementer: options.keyBoardScrollValueIncrementer
        }
        this.onWheelCb = this.onWheel.bind(this)
        this.onScrollTouchStartCb = this.onScrollTouchStart.bind(this)
        this.onScrollTouchMoveCb = this.onScrollTouchMove.bind(this)
        this.onScrollTouchEndCb = this.onScrollTouchEnd.bind(this)
        this.onScrollKeyboardDownCb = this.onScrollKeyboardDown.bind(this)
        this.onScrollKeyboardUpCb = this.onScrollKeyboardUp.bind(this)
    }

    onWheel(event) {
        const wheel = new NormalizeWheel(event)

        this.scroll._latestScrollValue += wheel.spinY * this.scroll.wheelScrollValue

        this._checkIfFitsWindow()

        this.scroll._scrollValue = this.scroll._latestScrollValue

        this.onScrollUpdate()
    }

    onScrollTouchStart(event) {
        event.preventDefault()
        this.scroll._drag = true

        this.element.classList.add('is-grabbing')

        this.startX = getMousePosition(event).x
    }

    onScrollTouchMove(event) {
        if (!this.scroll._drag) return

        this.distance = (getMousePosition(event).x - this.startX) * -1

        this.scroll._scrollValue = this.scroll._latestScrollValue + this.distance * this.scroll.dragSpeed

        this.onScrollUpdate()
    }

    onScrollTouchEnd() {
        this.scroll._drag = false
        this.element.classList.remove('is-grabbing')
        this.scroll._latestScrollValue = this.scroll._scrollValue
    }

    onScrollKeyboardDown(event) {
        const
            keyCode = event.code,
            // TODO: make speed increase by multiply not plus
            scrolledFromKeyBoard = this.scroll.keyBoardScrollValue + this.scroll.keyBoardScrollValueIncrementer++

        if (keyCode === "ArrowRight") {
            this.scroll._latestScrollValue += scrolledFromKeyBoard
        }

        if (keyCode === "ArrowLeft") {
            this.scroll._latestScrollValue -= scrolledFromKeyBoard
        }

        this._checkIfFitsWindow()

        this.scroll._scrollValue = this.scroll._latestScrollValue

        this.onScrollUpdate()
    }

    _checkIfFitsWindow() {
        if (this.scroll._latestScrollValue <= 0) this.scroll._latestScrollValue = 0

        if (this.scroll._latestScrollValue >= this.maxScroll) this.scroll._latestScrollValue = this.maxScroll
    }

    onScrollKeyboardUp() {
        this.scroll.keyBoardScrollValueIncrementer = this.scroll.keyBoardScrollValue
    }

    onScrollUpdate() {
        if (this.scroll._scrollValue < 0) this.scroll._scrollValue = 0
        if (this.scroll._scrollValue > this.maxScroll) this.scroll._scrollValue = this.maxScroll

        gsap.to(this.element, {
            x: -this.scroll._scrollValue,
            duration: 0.3,
        })
    }

    init() {
        document.addEventListener('wheel', this.onWheelCb)

        document.addEventListener('mousedown', this.onScrollTouchStartCb)
        document.addEventListener('mousemove', this.onScrollTouchMoveCb)
        document.addEventListener('mouseup', this.onScrollTouchEndCb)

        document.addEventListener('touchstart', this.onScrollTouchStartCb, { passive: false })
        document.addEventListener('touchmove', this.onScrollTouchMoveCb)
        document.addEventListener('touchend', this.onScrollTouchEndCb)

        document.addEventListener('keydown', this.onScrollKeyboardDownCb)
        document.addEventListener('keyup', this.onScrollKeyboardUpCb)
    }

    destroy() {
        document.removeEventListener('wheel', this.onWheelCb)

        document.removeEventListener('mousedown', this.onScrollTouchStartCb)
        document.removeEventListener('mousemove', this.onScrollTouchMoveCb)
        document.removeEventListener('mouseup', this.onScrollTouchEndCb)

        document.removeEventListener('touchstart', this.onScrollTouchStartCb)
        document.removeEventListener('touchmove', this.onScrollTouchMoveCb)
        document.removeEventListener('touchend', this.onScrollTouchEndCb)

        document.removeEventListener('keydown', this.onScrollKeyboardDownCb)
        document.removeEventListener('keyup', this.onScrollKeyboardUpCb)
    }
}

const scroll = new Scroll('.scroll', {
    dragSpeed: 2,
    wheelScrollValue: 50,
    keyBoardScrollValue: 20,
    keyBoardScrollValueIncrementer: 120
})

scroll.init()

document.getElementById('destroy').addEventListener('click', function () {
    scroll.destroy()
})

document.getElementById('init').addEventListener('click', function () {
    scroll.init()
})

import gsap from 'gsap'

import Wheel from './utils/normalizeWheel'
import getMousePosition from './utils/mouse'

import '../bg-1.jpg'
import '../bg-2.jpg'
import '../bg-3.jpg'
import '../bg-4.jpg'

class Scroll {
    constructor(selector) {

        this.element = document.querySelector(selector);

        this.scroll = {
            target: 0,
            current: 0,
            off: 0,
            speed: 1.5,
            drag: false
        }

        this.addEventListeners()

       this.onScrollUpdate()
    }

    onWheel(event) {
        let wheel = new Wheel(event)
        let delta = wheel.spinY * 50
        this.scroll.off += delta * this.scroll.speed
        this.scroll.target = this.scroll.off
    }


    onScrollTouchStart(event) {
        this.scroll.drag = true;
        event.preventDefault();

        this.startX = getMousePosition(event).x
    }

    onScrollTouchEnd(event) {
        this.scroll.drag = false;
        this.scroll.off = this.scroll.target

        // startX = event.touches ? event.touches[0].clientX : event.clientX;
        // console.log({startX})
    }

    onScrollTouchMove(event) {
        if (!this.scroll.drag) return

        const {
            x
        } = getMousePosition(event)
        this.distance = (x - this.startX) * -1;


        this.scroll.target = this.scroll.off + this.distance * this.scroll.speed

        // console.log(scroll.target)
    }

    onScrollKeyboard(event) {
        const keyCode = event.code;

        if (keyCode == "ArrowRight") {
            this.scroll.off += 20
            this.scroll.target = this.scroll.off
        } else if (keyCode == "ArrowLeft") {
            this.scroll.off -= 20
            this.scroll.target = this.scroll.off
        }

    }

    onScrollUpdate() {
        const total = this.element.clientWidth - window.innerWidth

        if (this.scroll.target < 0) this.scroll.target = 0;
        if (this.scroll.target > total) this.scroll.target = total;

        gsap.to('.scroll', {
            x: -this.scroll.target,
            duration: 0.3,
        });

        this.onScrollUpdateEvent = window.requestAnimationFrame(this.onScrollUpdate.bind(this))
    }

    addEventListeners() {
        document.addEventListener('wheel', this.onWheel.bind(this))

        document.addEventListener('mousedown', this.onScrollTouchStart.bind(this))
        document.addEventListener('mousemove', this.onScrollTouchMove.bind(this))
        document.addEventListener('mouseup', this.onScrollTouchEnd.bind(this))

        document.addEventListener('touchstart', this.onScrollTouchStart.bind(this), { passive: false })
        document.addEventListener('touchmove', this.onScrollTouchMove.bind(this))
        document.addEventListener('touchend', this.onScrollTouchEnd.bind(this))

        document.addEventListener('keydown', this.onScrollKeyboard.bind(this))
    }

}

new Scroll('.scroll');


// let windowWidth = window.innerWidth,
//     container = document.querySelector('.scroll'),
//     containerWidth = container.clientWidth,
//     maxScroll = (containerWidth - windowWidth),
//     isDrag = false,
//     startX;

// let scroll = {
//     target: 0,
//     current: 0,
//     off: 0,
//     speed: 1.5,
// }

// function initScroll(event) {
//     let wheel = new Wheel(event)
//     let delta = wheel.spinY * 50
//     scroll.off += delta * scroll.speed
//     scroll.target = scroll.off
// }

// function onScrollTouchStart(event) {
//     isDrag = true;
//     event.preventDefault();

//     startX = getMousePosition(event).x
//     // console.log({startX})
// }

// function onScrollTouchEnd(event) {
//     isDrag = false;
//     scroll.off = scroll.target

//     // startX = event.touches ? event.touches[0].clientX : event.clientX;
//     // console.log({startX})
// }

// function onScrollTouchMove(event) {
//     if (!isDrag) return

//     const {
//         x
//     } = getMousePosition(event)
//     let distance = (x - startX) * -1;


//     scroll.target = scroll.off + distance * scroll.speed

//     // console.log(scroll.target)
// }

// function onScrollKeyboard(event) {
//     const keyCode = event.code;
//     if (keyCode == "ArrowRight") {
//         scroll.off += 20
//         scroll.target = scroll.off
//     } else if (keyCode == "ArrowLeft") {
//         scroll.off -= 20
//         scroll.target = scroll.off
//     }
// }

// function onScrollUpdate(event) {
//     if (scroll.target < 0) scroll.target = 0;
//     if (scroll.target > maxScroll) scroll.target = maxScroll;

//     gsap.to('.scroll', {
//         x: -scroll.target,
//         duration: 0.4,
//     });

//     requestAnimationFrame(onScrollUpdate)
// }

// onScrollUpdate();

// document.addEventListener('wheel', initScroll);

// document.addEventListener('mousedown', onScrollTouchStart);
// document.addEventListener('mousemove', onScrollTouchMove);
// document.addEventListener('mouseup', onScrollTouchEnd);

// document.addEventListener('touchstart', onScrollTouchStart, {
//     passive: false
// });
// document.addEventListener('touchmove', onScrollTouchMove);
// document.addEventListener('touchend', onScrollTouchEnd);

// document.addEventListener('keydown', onScrollKeyboard)
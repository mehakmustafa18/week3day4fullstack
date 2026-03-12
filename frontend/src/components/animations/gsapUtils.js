import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export const staggerFadeUp = (targets, delay = 0) =>
  gsap.from(targets, { y: 50, opacity: 0, duration: 0.75, stagger: 0.12, ease: 'power3.out', delay });

export const fadeInScale = (target, delay = 0) =>
  gsap.from(target, { scale: 0.88, opacity: 0, duration: 0.38, ease: 'back.out(1.7)', delay });

export const slideInLeft = (targets, delay = 0) =>
  gsap.from(targets, { x: -70, opacity: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out', delay });

export const countUp = (element, endValue, duration = 2, delay = 0) => {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: endValue, duration, delay, ease: 'power2.out',
    onUpdate: () => { if (element) element.textContent = Math.round(obj.value); }
  });
};

export const pageEnter = (container) =>
  gsap.from(container, { opacity: 0, y: 25, duration: 0.45, ease: 'power2.out' });

export const shakeElement = (target) =>
  gsap.to(target, { x: [-10, 10, -8, 8, -5, 5, 0], duration: 0.45, ease: 'power2.inOut' });

export const heroTimeline = (refs) => {
  const tl = gsap.timeline();
  refs.forEach((ref, i) => {
    tl.from(ref, { y: i % 2 === 0 ? -35 : 30, opacity: 0, duration: 0.75, ease: 'power3.out' }, i === 0 ? 0 : '-=0.5');
  });
  return tl;
};

export const floatAnimation = (target) =>
  gsap.to(target, { y: -10, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });

export const glowPulse = (target, color = '#00d4ff') =>
  gsap.to(target, { boxShadow: `0 0 28px ${color}55`, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });

export default gsap;

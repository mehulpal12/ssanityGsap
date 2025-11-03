"use client"
import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
// use your own icon import if react-icons is not available
import { GoArrowUpRight } from 'react-icons/go';

type CardNavLink = {
  label: string;
  href?: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links?: CardNavLink[];
};

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items?: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const CardNav: React.FC<CardNavProps> = ({

  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      className={`card-nav-container absolute left-1/2 -translate-x-1/2 w-[90%] max-w-[80vw] z-[99] top-[1em] md:top-[0.5em] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''} block h-[60px] p-0 rounded-xl shadow-md relative overflow-hidden will-change-[height]`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-[1.1rem] z-[2]">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''} group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] order-2 md:order-none`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            style={{ color: menuColor || '#000' }}
          >
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? 'translate-y-[4px] rotate-45' : ''
              } group-hover:opacity-75`}
            />
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? '-translate-y-[4px] -rotate-45' : ''
              } group-hover:opacity-75`}
            />
          </div>

          <div className="logo-container flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none">
            <img src={"data:image/png;base64,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"} alt={logoAlt} className="logo h-[6vh]" />
            <h1 className='mx-2 font-semibold text-lg text-black'> DevPilot Studio</h1>
          </div>

          <button
            type="button"
            className="card-nav-cta-button hidden md:inline-flex border-0 rounded-[calc(0.75rem-0.2rem)] px-4 items-center h-full font-medium cursor-pointer transition-colors duration-300"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            Get Started
          </button>
        </div>

        <div
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-[1] ${
            isExpanded ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
          } md:flex-row md:items-end md:gap-[12px]`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none relative flex flex-col gap-2 p-[12px_16px] rounded-[calc(0.75rem-0.2rem)] min-w-0 flex-[1_1_auto] h-auto min-h-[60px] md:h-full md:min-h-0 md:flex-[1_1_0%]"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label font-normal tracking-[-0.5px] text-[18px] md:text-[22px]">
                {item.label}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-[2px]">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[15px] md:text-[16px]"
                    href={lnk.href}
                    aria-label={lnk.ariaLabel}
                  >
                    <GoArrowUpRight className="nav-card-link-icon shrink-0" aria-hidden="true" />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;

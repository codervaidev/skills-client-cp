import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { SuccessStory } from "@/data/successStories";

interface AnimatedSuccessStoriesProps {
  stories: SuccessStory[];
}

const AnimatedSuccessStories: React.FC<AnimatedSuccessStoriesProps> = ({ stories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [animationValues, setAnimationValues] = useState<Record<string, {x: number, y: number}>>({});
  const animationRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setDirection(Math.random() > 0.5 ? 1 : -1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [stories.length]);

  useEffect(() => {
    if (!mounted) return;
    
    const updateAnimations = () => {
      const time = Date.now() / 1000;
      const newValues: Record<string, {x: number, y: number}> = {};
      
      for (let i = 0; i < 7; i++) {
        const ampX = 10 + (i % 3) * 5;
        const ampY = 8 + (i % 4) * 4;
        const speedX = 0.5 + (i % 3) * 0.2;
        const speedY = 0.3 + (i % 4) * 0.2;
        const phaseX = i * 0.7;
        const phaseY = i * 0.9;
        
        newValues[`element-${i}`] = {
          x: ampX * Math.sin(time * speedX + phaseX),
          y: ampY * Math.cos(time * speedY + phaseY)
        };
      }
      
      setAnimationValues(newValues);
      animationRef.current = requestAnimationFrame(updateAnimations);
    };
    
    animationRef.current = requestAnimationFrame(updateAnimations);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mounted]);

  if (!mounted) return null;

  const story = stories[currentIndex];

  // Enhanced card enter/exit variants for more dynamic movement
  const containerVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 20 },
        opacity: { duration: 0.3 },
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    }),
  };

  // Children element variants for staggered animations
  const itemVariants: Variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 50 : -50,
      x: direction > 0 ? -30 : 30,
      opacity: 0,
      scale: 0.8,
      rotate: direction > 0 ? 10 : -10,
    }),
    center: {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring", 
        stiffness: 500,
        damping: 30,
      },
    },
    exit: (direction: number) => ({
      y: direction > 0 ? -100 : 100,
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.8,
      rotate: direction > 0 ? -10 : 10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
      },
    }),
  };

  // Random positions for elements while ensuring they don't overlap the image
  // The image will be on the left side, so other elements placed accordingly
  const getRandomPosition = () => {
    // Elements can be in these regions - avoiding the image area on left-center
    const positions = [
      { area: "top-right", className: "absolute right-[5%] sm:right-[15%] top-[10%]" },
      { area: "middle-right", className: "absolute right-[10%] sm:right-[25%] top-[40%]" },
      { area: "bottom-right", className: "absolute right-[15%] sm:right-[10%] bottom-[15%]" },
      { area: "top-center", className: "absolute right-[40%] top-[5%]" },
      { area: "bottom-center", className: "absolute right-[40%] bottom-[10%]" },
      { area: "far-right-top", className: "absolute right-[5%] top-[30%]" },
      { area: "far-right-bottom", className: "absolute right-[5%] bottom-[30%]" },
    ];
    
    return positions[Math.floor(Math.random() * positions.length)].className;
  };

  // Use this function to generate deterministic but random positions per element type
  const getPositionForElement = (elementType: string): string => {
    // Define specific regions for each element type
    const positionMap: Record<string, string> = {
      "name": "absolute right-[10%] top-[10%] z-20",
      "batch": "absolute right-[30%] top-[35%] z-20",
      "rating": "absolute right-[20%] bottom-[25%] z-20",
      "rankName": "absolute right-[40%] bottom-[15%] z-20",
      "codeforces": "absolute right-[5%] bottom-[45%] z-20",
      "codechef": "absolute right-[15%] bottom-[5%] z-20",
    };
    
    return positionMap[elementType] || getRandomPosition();
  };

  // Add a function to handle click/touch events
  const handleImageInteraction = () => {
    if (isHovered === 0) {
      setIsHovered(null);
    } else {
      setIsHovered(0);
    }
  };

  return (
    <div className="relative w-full h-[420px] mx-auto">
      {/* Ambient background blurs with constant motion */}
      <motion.div
        className="absolute top-[15%] left-[10%] w-40 h-40 bg-purple-600/15 rounded-full blur-3xl z-0"
        animate={{
          x: [0, 20, -10, 30, 0],
          y: [0, -20, 10, -30, 0],
          scale: [1, 1.2, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-[20%] right-[5%] w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl z-0"
        animate={{
          x: [0, -30, 20, -10, 0],
          y: [0, 20, -15, 25, 0],
          scale: [1, 1.3, 0.8, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main content area with floating elements */}
      <div className="relative h-full w-full z-10 overflow-visible">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 overflow-visible"
          >
            {/* Floating elements with improved randomization and constant motion */}
            
            {/* Profile image - larger and positioned on the left */}
            <motion.div 
              variants={itemVariants}
              custom={direction}
              className="absolute left-[10%] top-[15%] w-64 h-80 overflow-hidden rounded-lg backdrop-blur-sm shadow-lg perspective"
              animate={{
                x: animationValues["element-0"]?.x || 0,
                y: animationValues["element-0"]?.y || 0
              }}
              transition={{
                type: "spring",
                stiffness: 50,
                damping: 10
              }}
              style={{
                boxShadow: "0 8px 32px rgba(138, 43, 226, 0.3)",
                background: "rgba(30, 30, 40, 0.3)",
                border: "1px solid rgba(138, 43, 226, 0.3)",
                perspective: "1000px",
                cursor: "pointer"
              }}
              onClick={handleImageInteraction}
              onHoverStart={() => setIsHovered(0)}
              onHoverEnd={() => setIsHovered(null)}
            >
              <motion.div 
                className="w-full h-full relative"
                animate={{
                  rotateY: isHovered === 0 ? 180 : 0
                }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                style={{
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Front side (regular image) */}
                <motion.div
                  className="absolute w-full h-full backface-hidden"
                  style={{
                    backfaceVisibility: "hidden"
                  }}
                >
                  {story.image && story.image !== "placeholder" ? (
                    <Image
                      src={story.image}
                      alt={story.name}
                      className="object-cover"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <Image
                      src="/assets/success-story/profile.png"
                      alt={story.name}
                      className="object-cover"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                </motion.div>

                {/* Back side (3D image) */}
                <motion.div
                  className="absolute w-full h-full backface-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  {story.image_3d ? (
                    <Image
                      src={story.image_3d}
                      alt={`${story.name} 3D`}
                      className="object-cover"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <Image
                      src="/assets/success-story/profile_3d.png"
                      alt={`${story.name} 3D`}
                      className="object-cover"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Name - dynamic position */}
            <motion.div 
              variants={itemVariants}
              custom={direction}
              className={getPositionForElement("name")}
              animate={{
                x: animationValues["element-1"]?.x || 0,
                y: animationValues["element-1"]?.y || 0
              }}
              transition={{
                type: "spring",
                stiffness: 50,
                damping: 10
              }}
            >
              <motion.h2 
                className="text-2xl sm:text-3xl font-bold text-white py-2 px-4 rounded-lg"
                style={{
                  textShadow: "0 0 15px rgba(138, 43, 226, 0.8)",
                  background: "rgba(30, 30, 40, 0.4)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(138, 43, 226, 0.3)",
                }}
              >
                {story.name}
              </motion.h2>
            </motion.div>
            
            {/* Batch badge - dynamic position */}
            <motion.div 
              variants={itemVariants}
              custom={direction}
              className={getPositionForElement("batch")}
              animate={{
                x: animationValues["element-2"]?.x || 0,
                y: animationValues["element-2"]?.y || 0
              }}
              transition={{
                type: "spring",
                stiffness: 50,
                damping: 10
              }}
            >
              <motion.span 
                className="text-red-300 px-4 py-2 rounded-full text-sm font-medium block"
                style={{
                  background: "rgba(185, 28, 28, 0.3)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(185, 28, 28, 0.3)",
                  boxShadow: "0 5px 15px rgba(185, 28, 28, 0.2)",
                }}
              >
                Batch {story.batch}
              </motion.span>
            </motion.div>
            
            {/* Rating badge - dynamic position */}
            {story.codeforces && (
              <motion.div 
                variants={itemVariants}
                custom={direction}
                className={getPositionForElement("rating")}
                animate={{
                  x: animationValues["element-3"]?.x || 0,
                  y: animationValues["element-3"]?.y || 0
                }}
                transition={{
                  type: "spring",
                  stiffness: 50,
                  damping: 10
                }}
              >
                <motion.span 
                  className="text-green-300 px-4 py-2 rounded-full text-sm font-medium block"
                  style={{
                    background: "rgba(22, 163, 74, 0.2)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(22, 163, 74, 0.3)",
                    boxShadow: "0 5px 15px rgba(22, 163, 74, 0.2)",
                  }}
                >
                  {story.codeforces.rating} ⭐
                </motion.span>
              </motion.div>
            )}
            
            {/* Rank name - dynamic position */}
            {story.codeforces?.rankName && (
              <motion.div 
                variants={itemVariants}
                custom={direction}
                className={getPositionForElement("rankName")}
                animate={{
                  x: animationValues["element-4"]?.x || 0,
                  y: animationValues["element-4"]?.y || 0
                }}
                transition={{
                  type: "spring",
                  stiffness: 50,
                  damping: 10
                }}
              >
                <motion.span 
                  className="text-white px-4 py-2 rounded-lg text-sm font-bold block"
                  style={{
                    background: "rgba(138, 43, 226, 0.2)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(138, 43, 226, 0.3)",
                    boxShadow: "0 5px 15px rgba(138, 43, 226, 0.2)",
                  }}
                >
                  {story.codeforces.rankName}
                </motion.span>
              </motion.div>
            )}
            
            {/* Codeforces handle - dynamic position */}
            {story.codeforces && (
              <motion.div 
                variants={itemVariants}
                custom={direction}
                className={getPositionForElement("codeforces")}
                animate={{
                  x: animationValues["element-5"]?.x || 0,
                  y: animationValues["element-5"]?.y || 0
                }}
                transition={{
                  type: "spring",
                  stiffness: 50,
                  damping: 10
                }}
              >
                <motion.div 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
                  style={{
                    background: "rgba(30, 30, 40, 0.5)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(138, 43, 226, 0.3)",
                    boxShadow: "0 5px 15px rgba(30, 30, 40, 0.3)",
                  }}
                >
                  <div className="w-5 h-5 relative">
                    <Image
                      src="/assets/success-story/codeforces-96x96.png"
                      alt="Codeforces"
                      className="object-contain"
                      width={20}
                      height={20}
                      priority
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-100">
                    {story.codeforces.handle}
                  </span>
                </motion.div>
              </motion.div>
            )}
            
            {/* Codechef handle - dynamic position */}
            {story.codechef && (
              <motion.div 
                variants={itemVariants}
                custom={direction}
                className={getPositionForElement("codechef")}
                animate={{
                  x: animationValues["element-6"]?.x || 0,
                  y: animationValues["element-6"]?.y || 0
                }}
                transition={{
                  type: "spring",
                  stiffness: 50,
                  damping: 10
                }}
              >
                <motion.div 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg"
                  style={{
                    background: "rgba(30, 30, 40, 0.5)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                    boxShadow: "0 5px 15px rgba(30, 30, 40, 0.3)",
                  }}
                >
                  <div className="w-5 h-5 relative">
                    <Image
                      src="/assets/success-story/codechef-100x100.png"
                      alt="CodeChef"
                      className="object-contain"
                      width={20}
                      height={20}
                      priority
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-100">
                    {story.codechef.handle}
                  </span>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-20">
        {stories.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-purple-500" : "bg-gray-600"
            }`}
            onClick={() => setCurrentIndex(index)}
            whileHover={{ scale: 1.5 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedSuccessStories; 

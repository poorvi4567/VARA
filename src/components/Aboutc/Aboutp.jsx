import React, { useEffect } from 'react';
import './Aboutp.css';
import { motion } from 'framer-motion';
import channapatna_workshop from '../Assets/images/channapatna_workshop.avif';
import artisanworking from '../Assets/images/artisanworking.jpeg';
import spinningtop from '../Assets/images/spinningtop.webp';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (

    <motion.div className="about-page"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}>
      <section className="about-hero">
        <h1>The Timeless Charm of Channapatna Toys</h1>
        <p>From Craft to Childhood Memories</p>
      </section>

      <section className="about-section">
        <div className="about-content">
          <div className="text">
            <h2>A Tiny Workshop, A World of Magic</h2>
            <p className='about-info'>
              Tucked away in the heart of Karnataka, the town of Channapatna hums with the rhythmic
              tap-tap of chisels meeting wood, the soft swirl of lacquer coating, and the warm scent
              of seasoned ivory wood. Here, generations of artisans breathe life into blocks of wood,
              turning them into vibrant toys that have been a part of Indian childhoods for centuries.
              For the uninitiated, these aren't just toys; they are fragments of nostalgia, handcrafted
              with patience, skill, and love.
            </p>
          </div>
          <img src={channapatna_workshop} alt="Channapatna Workshop" />
        </div>

        <div className="about-content reverse">
          <img src={artisanworking} alt="Artisan working on toy" />
          <div className="text">
            <h2>The Hands That Build Joy</h2>
            <p className='about-info'>
              A Channapatna toy starts as a humble piece of Wrightia tinctoria, locally called Aale Mara,
              known for its smooth texture and durability. It’s seasoned, shaped, and carefully sanded before
              being coated in natural dyes extracted from turmeric, indigo, and kumkum—a conscious,
              sustainable alternative to plastic-laden modern toys.
              <br /><br />
              The artisans, some of whom have inherited the craft from their forefathers, don’t follow blueprints.
              Their hands know the curves, the proportions, the finishing touch—an instinct built over years of practice.
              A spinning top, a pull-along elephant, or a tumbling acrobat—all take shape under the steady hands
              of these skilled craftsmen.
            </p>
          </div>
        </div>

        <div className="about-content">
          <div className="text">
            <h2>A Walk Down Memory Lane</h2>
            <p className='about-info'>
              For many of us, these toys bring back sepia-toned childhood memories. The excitement of spinning a
              lacquered top and watching it dance, the careful stacking of wooden rings to form a wobbly tower,
              the pull-along duck that followed us everywhere—these simple joys remain etched in our hearts.
              <br /><br />
              In an age of touchscreens and AI-driven playthings, Channapatna toys whisper stories of simpler times—
              when play meant imagination, not algorithms; when a wooden train could take you on a grand adventure,
              and a handcrafted doll could become your best friend.
            </p>
          </div>
          <img src={spinningtop} alt="Spinning Top" />
        </div>

        <div className="about-conclusion">
          <h2>Keeping the Legacy Alive</h2>
          <p className='about-info'>
            Today, brands like VARA are working to blend tradition with modern storytelling, ensuring these toys don’t
            just remain souvenirs but become a part of every child’s playroom once again. Whether it's through themed
            subscription boxes or creative reinterpretations of classic toys, the goal remains the same—to keep the spirit
            of handmade joy alive.
            <br /><br />
            So, the next time you hold a Channapatna toy, remember—you’re not just holding a piece of wood;
            you’re holding a piece of history, a slice of childhood, and a story that deserves to be told
            for generations to come.
          </p>
        </div>
      </section>
    </motion.div>
  );
};

export default About;

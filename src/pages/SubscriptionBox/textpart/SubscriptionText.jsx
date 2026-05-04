import React from 'react'
import { motion } from 'framer-motion';
import './SubscriptionText.css';

const SubscriptionText = () => {
    return (
        <motion.div
        className="intro"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h2> Our Monthly Subscription Experience</h2>
        <p>
          At Vara, we bring joy and learning together with our curated monthly subscription boxes.
          Each box is thoughtfully designed around a unique theme, celebrating the essence of every
          month with handcrafted, eco-friendly toys and games. Whether it’s sparking creativity,
          encouraging social play, or exploring tradition and culture — our subscription keeps little
          ones engaged all year round. Subscribe now and receive a fresh dose of wonder every month!
        </p>

        <h3> What's Inside Each Month:</h3>
        <div className="monthly-list">
        {[
          ["January", "New Year Joy Box", "Interactive memory games, and goal-setting strategic toys to kickstart the year."],
          ["February", "Love & Friendship Box", "Pair-play board games, tic-tac-toe sets, and handcrafted heart-themed toys."],
          ["March", "Spring Adventure Box", "Animal figurines, pull-along toys, and nature-inspired toys."],
          ["April", "Fun & Learn Box", "Educational toys like abacus, shape sorters, and colour-matching games."],
          ["May", "Summer Explorer Box", "Outdoor-friendly wooden tops, yo-yos, and spinning toys for endless fun."],
          ["June", "Back to School Box", "Wooden stationery items like pencil tops, sharpeners, and interactive desk toys."],
          ["July", "Rainy Day Play Box", "Stacking games, tumbling towers, and Connect 4 to enjoy cozy indoor playtime."],
          ["August", "Heritage & Culture Box", "Handcrafted folk-themed toys and miniature traditional figurines."],
          ["September", "Classic Board Games Box", "Traditional Indian games like Pachisi, Navakankari, and Aliguli Mane."],
          ["October", "Festive Fun Box", "Hand-crafted spinning tops, torans, and Diwali-themed toy sets."],
          ["November", "Superhero & Fantasy Box", "Custom-themed action figures, warrior toys, and imaginative playsets."],
          ["December", "Christmas Surprise Box", "Santa figurines, reindeer pull-along toys, and holiday-themed puzzles."]
        ].map(([month, title, desc]) => (
          <div className="monthly-card" key={month}>
            <h4>{month}</h4>
            <p><strong>{title}</strong></p>
            <p>{desc}</p>
          </div>
        ))}
</div>

      </motion.div>
    );
};

export default SubscriptionText;

import React from 'react';
import '../PlayerCard.css';

const PlayerCard = ({
  rating,
  position,
  nationImage,
  clubImage,
  playerImage,
  extraStats,
  playerName,
  playerFeatures
}) => {
  return (
    <div className="wrapper">
      <div className="fut-player-card">
        <div className="player-card-top">
          <div className="player-master-info">
            <div className="player-rating"><span>{rating}</span></div>
            <div className="player-position"><span>{position}</span></div>
            <div className="player-nation">
              <img src={nationImage} alt="Nation" draggable="false" />
            </div>
            <div className="player-club">
              <img src={clubImage} alt="Club" draggable="false" />
            </div>
          </div>
          <div className="player-picture">
            <img src={playerImage} alt="Player" draggable="false" />
          </div>
        </div>
        <div className="player-card-bottom">
          <div className="player-info">
            <div className="player-name"><span>{playerName}</span></div>
            <div className="player-features">
              {playerFeatures.map((featureCol, index) => (
                <div className="player-features-col" key={index}>
                  {featureCol.map((feature, subIndex) => (
                    <span key={subIndex}>
                      <span className="player-feature-value">{feature.value}</span>
                      <span className="player-feature-title">{feature.title}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;

// import React from 'react';
// import PlayerCard from './PlayerCard.jsx';
// const Squad = () => {
//     const playerProps = {
//         rating: 65,
//         position: 'MC',
//         nationImage: 'https://selimdoyranli.com/cdn/fut-player-card/img/argentina.svg',
//         clubImage: 'https://selimdoyranli.com/cdn/fut-player-card/img/barcelona.svg',
//         playerImage: '../src/img/fran.png',
//         extraStats: ['4*SM', '4*WF'],
//         playerName: 'Fran',
//         playerFeatures: [
//           [
//             { value: 65, title: 'PAC' },
//             { value: 60, title: 'SHO' },
//             { value: 72, title: 'PAS' },
//           ],
//           [
//             { value: 54, title: 'DRI' },
//             { value: 72, title: 'DEF' },
//             { value: 77, title: 'PHY' },
//           ],
//         ],
//       };
//     return (
//         <div>
//             <PlayerCard {...playerProps} />
//         </div>
//     );
// };

// export default Squad;
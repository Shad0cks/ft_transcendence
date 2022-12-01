import React from 'react';

export default function AvailableParty({
  name,
  password,
  id,
  joinChannel,
  leaveChannel,
  isIn,
}: {
  name: string;
  password: boolean;
  id: string;
  isIn: boolean;
  joinChannel: () => void;
  leaveChannel: () => void;
}) {
  return (
    <div>
      <div className="card" style={{ width: '18rem' }}>
        <img
          src="https://ponggame.io/images/pong-thumbnail.png"
          className="card-img-top"
          alt="pong"
        />
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text"> {password ? 'public' : 'Private Game'} </p>
          {!isIn ? (
            <button className="btn btn-primary" onClick={joinChannel}>
              Join
            </button>
          ) : (
            <button className="btn btn-danger" onClick={leaveChannel}>
              Leave
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function AvailableParty({
  name,
  password,
  id,
  joinChannel,
  leaveChannel,
  editChannel,
  isIn,
  isAdmin,
}: {
  name: string;
  password: boolean;
  id: string;
  isIn: boolean;
  joinChannel: () => void;
  leaveChannel: () => void;
  editChannel: () => void;
  isAdmin: boolean;
}) {
  return (
    <div>
      <div className="card" style={{ width: '18rem' }}>
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">
            {' '}
            {password ? 'public' : 'Private Channel'}{' '}
          </p>
          {!isIn ? (
            <button className="btn btn-primary" onClick={joinChannel}>
              Join
            </button>
          ) : (
            <button className="btn btn-danger" onClick={leaveChannel}>
              Leave
            </button>
          )}

          {isIn && isAdmin ? (
            <button className="btn btn-danger" onClick={editChannel}>
              Edit
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

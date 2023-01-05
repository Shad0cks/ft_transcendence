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
  editWhitelist,
}: {
  name: string;
  password: string;
  id: string;
  isIn: boolean;
  joinChannel: () => void;
  leaveChannel: () => void;
  editChannel: () => void;
  isAdmin: boolean;
  editWhitelist: () => void;
}) {
  return (
    <div>
      <div className="card" style={{ width: '18rem' }}>
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text"> {password} </p>
          {!isIn ? (
            <button className="btn btn-primary" onClick={joinChannel}>
              Join
            </button>
          ) : (
            <button className="btn btn-danger" onClick={leaveChannel}>
              Leave
            </button>
          )}
          &nbsp;
          {isIn && isAdmin ? (
            <button className="btn btn-danger" onClick={editChannel}>
              Edit
            </button>
          ) : null}
          {password === 'private' && isIn && isAdmin ? (
            <button className="btn btn-primary" style={{marginRight: "2px", marginTop: "10px"}} onClick={editWhitelist}>
              Whitelist
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

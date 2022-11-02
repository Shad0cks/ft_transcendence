import React from 'react';

export default function AvailableParty({
  name,
  password,
  id,
}: {
  name: string;
  password: boolean;
  id: string;
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
          <button className="btn btn-primary">
            Join 
          </button>
        </div>
      </div>
    </div>
  );
}

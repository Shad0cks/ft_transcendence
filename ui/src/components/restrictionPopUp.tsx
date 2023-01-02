import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

import Popup from 'reactjs-popup';
import { resType } from '../models/res';
import { socket } from '../services/socket';

export default function RestrictionPopUp({
  open,
  setOpen,
  applyRes,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  applyRes: resType;
}) {
  function addHours(numOfHours: number, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
    return date;
  }

  function resSub(expire: number) {
    const time = addHours(expire);
    applyRes.end = time.toISOString();
    socket.emit('AddRestriction', applyRes);
    setOpen(false);
  }

  return (
    <Popup
      open={open}
      closeOnDocumentClick
      onClose={() => {
        setOpen(false);
      }}
    >
      <h2 style={{ textAlign: 'center' }}> Duration: </h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto',
        }}
      >
        <ButtonGroup aria-label="Basic example">
          <Button
            variant="dark"
            onClick={() => {
              resSub(1);
            }}
          >
            a hour{' '}
          </Button>
          &nbsp;
          <Button
            variant="dark"
            onClick={() => {
              resSub(24);
            }}
          >
            a day{' '}
          </Button>
          &nbsp;
          <Button
            variant="dark"
            onClick={() => {
              resSub(730);
            }}
          >
            a month{' '}
          </Button>
          &nbsp;
          <Button
            variant="dark"
            onClick={() => {
              resSub(8760);
            }}
          >
            a year{' '}
          </Button>
        </ButtonGroup>
      </div>
    </Popup>
  );
}

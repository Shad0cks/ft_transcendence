import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { AlertColor, Button, FormControlLabel } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Channel } from '../models/channel';
import { createChannel } from '../services/chatService';
import TSSnackbar from './TSSnackbar';

export default function TSCreateChannel() {
  const { register, handleSubmit } = useForm<Channel>();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>('success');

  const onSubmit: SubmitHandler<Channel> = (data) => {
    createChannel(data)
      .then((res) => {
        setSnackbarMessage('Channel created.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.error(err);
        setSnackbarMessage('Error while creating channel.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          required
          id="outlined-required"
          label="Channel name"
          {...register('name')}
        />
        <TextField
          required
          id="outlined-required"
          label="Channel password"
          {...register('password')}
        />
        <FormControlLabel
          control={<Checkbox defaultChecked {...register('isPublic')} />}
          label="is public"
        />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
      <TSSnackbar
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </div>
  );
}

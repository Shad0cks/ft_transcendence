import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AlertColor } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Channel } from '../../models/channel';
import { createChannel } from '../../services/createChannel';
import TSSnackbar from '../../components/TSSnackbar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom/dist';

export default function PartyCreate() {
  const { register, watch, handleSubmit } = useForm<Channel>();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>('success');

  const channelVisiblity = watch('restriction');
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Channel> = (data: Channel) => {
    console.log(data);

    createChannel(data)
      .then((res) => {
        if (res.ok) {
          const requete = res.text().then((e) => JSON.parse(e));
          requete.then((e) => {
            navigate('/game_' + e.id);
          });
        } else {
          setSnackbarMessage('Error while creating channel.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setSnackbarMessage('Error while creating channel.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  };

  return (
    <div style={{ margin: '100px auto', color: '#fff', width: '40%' }}>
      <h3 style={{ marginBottom: '20px' }}> Create your game </h3>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="gameName">Game name</Form.Label>
          <Form.Control
            id="gameName"
            placeholder="Wanderful name"
            {...register('name')}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledSelect">Game visibility</Form.Label>
          <Form.Select id="disabledSelect" {...register('restriction')}>
            <option>protected</option>
            <option>public</option>
            <option>private</option>
          </Form.Select>
        </Form.Group>
        {channelVisiblity !== 'public' ? (
          <Form.Group className="mb-3">
            <Form.Label htmlFor="gamePass">Password</Form.Label>
            <Form.Control
              id="gamePass"
              placeholder="1234"
              type="password"
              {...register('password')}
            />
          </Form.Group>
        ) : null}

        <Button type="submit">Submit</Button>
      </Form>
      <TSSnackbar
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </div>
  );
}

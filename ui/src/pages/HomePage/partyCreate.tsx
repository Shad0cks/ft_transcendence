import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Socket } from 'socket.io-client';
import { ChannelDTO } from '../../models/channel';
import { CreateChannelDTO } from '../../models/newChannel';

export default function PartyCreate({
  username,
  socket,
  channelEdit,
  setChannelEdit,
}: {
  socket: Socket | undefined;
  username: string | undefined;
  channelEdit: ChannelDTO | undefined;
  setChannelEdit: React.Dispatch<React.SetStateAction<ChannelDTO | undefined>>;
}) {
  const { register, watch, handleSubmit } = useForm<CreateChannelDTO>();
  //const [openSnackbar, setOpenSnackbar] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState('');
  // const [snackbarSeverity, setSnackbarSeverity] =
  //   useState<AlertColor>('success');

  const channelVisiblity = watch('privacy');

  const onSubmit: SubmitHandler<CreateChannelDTO> = (
    data: CreateChannelDTO,
  ) => {
    data.creatorNickname = username!;

    if (socket && socket.id !== undefined) {
      if (channelEdit) {
        if (data.privacy === channelEdit.privacy)
          socket.emit('EditChannelPassword', {
            channel: channelEdit.name,
            password: data.password,
          });
        else
          socket.emit('ChangeChannelToPrivacy', {
            name: channelEdit.name,
            privacy: data.privacy,
            password: data.password,
          });
        setChannelEdit(undefined);
      } else socket.emit('createChannel', data);
    }
  };

  return (
    <div style={{ margin: '100px auto', color: '#fff', width: '40%' }}>
      <h3 style={{ marginBottom: '20px' }}>
        {' '}
        {!channelEdit ? 'Create' : 'Edit'} your Channel{' '}
      </h3>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {!channelEdit ? (
          <Form.Group className="mb-3">
            <Form.Label htmlFor="gameName">Channel name</Form.Label>
            <Form.Control
              id="gameName"
              placeholder="Wanderful name"
              {...register('channelName')}
              required
            />
          </Form.Group>
        ) : null}
        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledSelect">Channel visibility</Form.Label>
          <Form.Select
            defaultValue={'public'}
            id="disabledSelect"
            {...register('privacy')}
          >
            <option>protected</option>
            <option>public</option>
            <option>private</option>
          </Form.Select>
        </Form.Group>
        {channelVisiblity === 'protected' ? (
          <Form.Group className="mb-3">
            <Form.Label htmlFor="gamePass">Password</Form.Label>
            <Form.Control
              id="gamePass"
              placeholder={channelEdit ? 'New Password' : '1234'}
              type="password"
              required
              {...register('password')}
            />
          </Form.Group>
        ) : null}
        <Button type="submit">Submit</Button>
        {'  '}
        {channelEdit ? (
          <Button onClick={() => setChannelEdit(undefined)}>
            {' '}
            Back To Creation
          </Button>
        ) : null}
      </Form>
      {/* <TSSnackbar
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
      /> */}
    </div>
  );
}

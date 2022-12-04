import { FC, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useForm, SubmitHandler } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import '../css/Components/TwoFA.css';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { Form } from 'react-bootstrap';

type TwoFactorAuthProps = {
  otpauth_url: string;
  ascii: string;
  user_id: string;
  closeModal: () => void;
  settwofa: () => void;
};

const twoFactorAuthSchema = object({
  token: string().min(1, 'Authentication code is required'),
});

type TwoFactorAuthInput = TypeOf<typeof twoFactorAuthSchema>;

const TwoFactorAuth: FC<TwoFactorAuthProps> = ({
  otpauth_url,
  ascii,
  user_id,
  closeModal,
  settwofa,
}) => {
  const speakeasy = require('speakeasy');
  const [qrcodeUrl, setqrCodeUrl] = useState('');

  const {
    handleSubmit,
    register,
    formState: { errors },
    setFocus,
  } = useForm<TwoFactorAuthInput>({
    resolver: zodResolver(twoFactorAuthSchema),
  });

  const verifyOtp = async (tokenIn: string) => {
    var res = speakeasy.totp.verify({
      secret: ascii,
      encoding: 'ascii',
      token: tokenIn,
    });

    if (res) {
      settwofa();
    }
  };

  const onSubmitHandler: SubmitHandler<TwoFactorAuthInput> = (values) => {
    verifyOtp(values.token);
  };

  useEffect(() => {
    QRCode.toDataURL(otpauth_url).then(setqrCodeUrl);
  }, [otpauth_url]);

  useEffect(() => {
    setFocus('token');
  }, [setFocus]);
  return (
    <div>
      <div className="popupE">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 p-4 border-b">
            Two-Factor Authentication (2FA)
          </h3>
          <div className="block2">
            <img className="imgQR" src={qrcodeUrl} alt="qrcode url" />
            <div className="alternativ">
              <h4>Or Enter Code Into Your App</h4>
              <p className="text-sm">SecretKey: {ascii} (ascii encoded)</p>
            </div>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <p className="mt-2 text-xs text-red-600">
                {errors.token ? errors.token.message : null}
              </p>
              <InputGroup
                className="mb-3"
                style={{ width: 'auto', margin: '0 10px 0 10px' }}
              >
                <Form.Control
                  className="inputCode"
                  placeholder="Auth Code"
                  {...register('token')}
                />
                <Button type="submit">Verify</Button>
              </InputGroup>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;

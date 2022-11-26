import React from 'react';
import { useRef } from 'react';
import { Valide2Fa } from '../services/User/valide2fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Friend } from '../models/friend';
import { TwoFAtoken } from '../models/twofatoken';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

export default function FaPage() {
  const [searchParams] = useSearchParams();
  const token = useRef(null);
  const navigate = useNavigate();

  const usrReq = searchParams.get('nickname');
  const logReq = searchParams.get('login42');

  const callLogin = () => {
    if (!token.current || !usrReq) {
      return;
    }
    Valide2Fa(usrReq, (token.current as HTMLInputElement).value)
      .then((res) => {
        if (res.ok) {
          const requete = res.text().then((e) => JSON.parse(e));
          requete.then((e: TwoFAtoken) => {
            if (e.token === 'true')
              window.location.replace(
                'http://localhost:8080/auth/42/2faredirect',
              );
            else return;
          });
        } else {
          console.log('err req', res.status);
        }
      })
      .catch((err) => {
        navigate('/');
        console.log(err);
      });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <InputGroup className="mb-3" style={{ width: '300px' }}>
        <Form.Control
          placeholder="Authentication Code"
          aria-label="Recipient's token"
          aria-describedby="basic-addon2"
          ref={token}
        />
        <Button
          onClick={callLogin}
          variant="outline-success"
          id="button-addon2"
        >
          Verify
        </Button>
      </InputGroup>
    </div>
  );
}

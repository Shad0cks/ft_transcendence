import React from 'react';
import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

export default function FaPage() {
  const [searchParams] = useSearchParams();
  const token = useRef(null);

  const usrReq = searchParams.get('nickname');

  const callLogin = () => {
    if (!token.current || !usrReq) {
      return;
    }
    // TODO case empty token
    window.location.replace(
      'http://localhost:8080/auth/42/2faredirect/' +
        (token.current as HTMLInputElement).value,
    );
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
